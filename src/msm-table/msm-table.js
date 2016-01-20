angular
    .module('mindsmash-table')
    .provider('msmTableFactory', msmTableFactoryProvider);

/**
 * @ngdoc service
 * @name mindsmash-table.msmTableFactoryProvider
 *
 * @description
 * TODO
 */
function msmTableFactoryProvider(msmTableConfig) {
  var tableConfig = msmTableConfig;

  return {
    setTableConfig: defaultTableConfig,
    $get: $get
  };

  // ==========

  function defaultTableConfig(config) {
    angular.merge(tableConfig, config);
  }

  function $get($rootScope, $q) {
    return new msmTableFactory($rootScope, $q, tableConfig);
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.msmTableFactory
 *
 * @description
 * TODO
 */
function msmTableFactory($rootScope, $q, tableConfig) {

  /**
   * @ngdoc method
   * @name get
   * @methodOf mindsmash-table.msmTableFactory
   *
   * @description
   * Returns a new {@link mindsmash-table.MsmTable MsmTable} API instance to be used with *msmTable*-directives.
   *
   * @param {string} name The table's unique identifier.
   * @param {Object} config The table's configuration.
   * @returns {API} A {@link mindsmash-table.MsmTable MsmTable} API instance.
   */
  return {
    get: get
  };

  // ==========

  function get(name, config) {
    return new MsmTable($rootScope, $q, name, angular.merge(tableConfig, config));
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.MsmTable
 *
 * @description
 * TODO
 */
function MsmTable($rootScope, $q, tableName, tableConfig) {
  var vm = this;

  var tName = tableConfig.namespace + '.' + tableName;
  var tCols = tableConfig.columns;
  var tRows = [];

  var tState = {
    active: null,
    page: 0,
    pageSize: 10,
    itemCount: 100, // should be named RowCount
    orderBy: null,
    selection: { //TODO: init
      1: true,
      2: true,
      3: false
    },
    visibility: { //TODO: init
      id: false,
      firstName: true,
      lastName: true,
      age: true,
      birthday: false
    }
  };

  // ==========

  vm.getConfig = getConfig;
  vm.getName = getName;
  vm.getCols = getCols;
  vm.getRows = getRows;

  vm.getItemCount = getItemCount;

  vm.reload = reload;

  vm.getPage = getPage;
  vm.setPage = setPage;
  vm.firstPage = firstPage;
  vm.previousPage = previousPage;
  vm.nextPage = nextPage;
  vm.lastPage = lastPage;
  vm.getPageSize = getPageSize;
  vm.setPageSize = setPageSize;

  vm.getOrderBy = getOrderBy;
  vm.setOrderBy = setOrderBy;

  vm.getActive = getActive;
  vm.setActive = setActive;
  vm.firstActive = firstActive;
  vm.previousActive = previousActive;
  vm.nextActive = nextActive;
  vm.lastActive = lastActive;

  vm.getVisibility = getVisibility;
  vm.setVisibility = setVisibility;

  vm.getSelection = getSelection;
  vm.setSelection = setSelection;

  // ==========

  function getConfig() {
    return tableConfig;
  }

  function getName() {
    return tName;
  }

  function getCols() {
    return tRows;
  }

  function getRows() {
    return tRows;
  }

  function getItemCount() {
    return tState.itemCount;
  }

  // -----------

  function getParams() {
    var params = {
      page: tState.page,
      pageSize: tState.pageSize
    };
    if (tState.orderBy) {
      params.orderBy = tState.orderBy.key;
      params.orderAsc = tState.orderBy.asc;
    }
    return params;
  }

  function reload() {
    notify('loading', true);
    return tableConfig.source(getParams()).then(function(response) {
      response = tableConfig.onAfterLoad(response);

      /* refresh content */
      tRows = response.content;
      notify('items');

      /* refresh state */
      var mappings = {
        number: 'page',
        size: 'pageSize',
        totalElements: 'itemCount',
        totalPages: 'pageCount'
        //TODO: orderBy
      };
      for (var remoteKey in mappings) {
        var localKey = mappings[remoteKey];
        var remoteValue = response[remoteKey]
        if (tState[localKey] !== remoteValue) {
          tState[localKey] = remoteValue;
          notify(localKey, remoteValue);
        }
      }

      /* check active boundaries */
      if (tState.active !== null && tState.active >= tRows.length) {
        tState.active = tRows.length - 1;
        notify('active', tState.active);
      }

    }).finally(function() {
      notify('loading', false);
    });
  }

  // ----------- Pagination

  /**
   * @ngdoc method
   * @name getPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the current page number.
   *
   * @returns {number} The page number.
   */
  function getPage() {
    return tState.page;
  }

  /**
   * @ngdoc method
   * @name setPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Moves to a specific page.
   *
   * @param {number} page The new page number.
   * @returns {Promise} A table resource promise.
   */
  function setPage(page) {
    var deferred = $q.defer();
    var newPage = Math.min(Math.max(0, page), getPageCount() - 1);

    if (tState.page !== newPage) {
      tState.page = newPage;
      deferred.resolve(reload());
    } else {
      deferred.reject(newPage);
    }

    return deferred.promise.then(function(result) {
      notify('page', newPage);
      return result;
    });
  }

  /**
   * @ngdoc method
   * @name firstPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to move to the first page.
   *
   * @returns {Promise} A table resource promise.
   */
  function firstPage() {
    return setPage(0);
  }

  /**
   * @ngdoc method
   * @name previousPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to move to the previous page.
   *
   * @returns {Promise} A table resource promise.
   */
  function previousPage() {
    return setPage(tState.page - 1);
  }

  /**
   * @ngdoc method
   * @name nextPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to move to the next page.
   *
   * @returns {Promise} A table resource promise.
   */
  function nextPage() {
    return setPage(tState.page + 1);
  }

  /**
   * @ngdoc method
   * @name lastPage
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to move to the last page.
   *
   * @returns {Promise} A table resource promise.
   */
  function lastPage() {
    return setPage(getPageCount() - 1);
  }

  /**
   * @ngdoc method
   * @name getPageSize
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the current page size.
   *
   * @returns {number} The page size.
   */
  function getPageSize() {
    return tState.pageSize;
  }

  /**
   * @ngdoc method
   * @name setPageSize
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Sets a specific page size.
   *
   * @param {number} pageSize The new page size.
   * @returns {Promise} A table resource promise.
   */
  function setPageSize(pageSize) {
    var deferred = $q.defer();
    var newPageSize = Math.max(1, pageSize);

    if (tState.pageSize !== newPageSize) {
      tState.pageSize = newPageSize;
      deferred.resolve(reload());
    } else {
      deferred.reject(newPageSize);
    }

    return deferred.promise.then(function(result) {
      notify('pageSize', newPageSize);
      return result;
    });
  }

  // ----------- Sorting

  /**
   * @ngdoc method
   * @name getOrderBy
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the current order, denoted by `key` (sort key) and `asc` (sort order).
   *
   * @returns {Object} The ordering or `null`.
   */
  function getOrderBy() {
    return tState.orderBy;
  }

  /**
   * @ngdoc method
   * @name setOrderBy
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Toggles or sets a new sort order. The sort order is set according to the following rules:
   *
   * - **reset** (no sort order), if called with no or `null` arguments.
   * - **toggle** (rotate sort order), if the `key` equals the current key.
   * - **set** (spec. sort order), if the `key` differs from the current key or the direction is explicitly set.
   *
   * @param {string=} key The new sort key.
   * @param {boolean=} asc The new sort order.
   * @returns {Promise} A table resource promise.
   */
  function setOrderBy(key, asc) {
    var deferred = $q.defer();
    var newOrderBy;

    if (tState.orderBy) {
      if (angular.isUndefined(key) || key === null || asc === null) {
        newOrderBy = null;
      } else if (tState.orderBy.key !== key) {
        newOrderBy = { key: key, asc: angular.isUndefined(asc) || !!asc };
      } else if (angular.isDefined(asc) && tState.orderBy.asc !== asc) {
        newOrderBy = { key: tState.orderBy.key, asc: asc };
      } else if (tState.orderBy.asc) {
        newOrderBy = { key: tState.orderBy.key, asc: false };
      } else {
        newOrderBy = null;
      }
    } else if (angular.isDefined(key) && key !== null && asc !== null) {
      newOrderBy = { key: key, asc: angular.isUndefined(asc) || !!asc };
    }

    if (angular.isDefined(newOrderBy)) {
      tState.orderBy = newOrderBy;
      deferred.resolve(reload());
    } else {
      deferred.reject({ key: key, asc: angular.isUndefined(asc) || !!asc });
    }

    return deferred.promise.then(function(result) {
      notify('orderBy', newOrderBy);
      return result;
    });
  }

  // ----------- Active Row

  /**
   * @ngdoc method
   * @name getActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the index of the currently active row.
   *
   * @returns {number} The index or `null`.
   */
  function getActive() {
    return tState.active;
  }

  /**
   * @ngdoc method
   * @name setActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Activates a specific row of the current page.
   *
   * @param {number} active The index of the row to be activated.
   * @returns {Promise} A table resource promise.
   */
  function setActive(active) {
    var deferred = $q.defer();
    var newActive;
    var prev = false;
    var next = false;

    if (active === null) {
      newActive = tState.active !== null ? null : tState.active;
    } else if (active < 0) {
      prev = tState.page > 0;
      newActive = prev ? tState.pageSize - 1 : tState.active;
    } else if (active >= tState.pageSize) {
      next = tState.page < getPageCount() - 1;
      newActive = next ? 0 : tState.active;
    } else {
      newActive = Math.min(active, tRows.length - 1);
    }

    if (tState.active !== newActive) {
      tState.active = newActive;
      if (prev) {
        deferred.resolve(previousPage());
      } else if (next) {
        deferred.resolve(nextPage());
      } else {
        deferred.resolve();
      }
    } else {
      deferred.reject(newActive);
    }

    return deferred.promise.then(function(result) {
      notify('active', newActive);
      return result;
    });
  }

  /**
   * @ngdoc method
   * @name firstActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to activate the first row.
   *
   * @returns {Promise} A table resource promise.
   */
  function firstActive() {
    setActive(0)
  }

  /**
   * @ngdoc method
   * @name previousActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to activate the previous row.
   *
   * @returns {Promise} A table resource promise.
   */
  function previousActive() {
    setActive(tState.active - 1);
  }

  /**
   * @ngdoc method
   * @name nextActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to activate the next row.
   *
   * @returns {Promise} A table resource promise.
   */
  function nextActive() {
    setActive(tState.active + 1);
  }

  /**
   * @ngdoc method
   * @name lastActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to activate the last row.
   *
   * @returns {Promise} A table resource promise.
   */
  function lastActive() {
    setActive(tRows.length - 1);
  }

  // -----------

  /**
   * @ngdoc method
   * @name getVisibility
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * TODO
   *
   * @param {string=} key The column's key.
   * @returns {boolean} The visibility.
   */
  function getVisibility(key) {
    return angular.isDefined(key) ? tState.visibility[key] : tState.visibility;
  }

  function setVisibility(key, value) {
    var deferred = $q.defer();
    var newVisibility = angular.isDefined(value) ? !!value : !tState.visibility[key];

    var args = {};
    args[key] = newVisibility;

    if (tState.visibility[key] !== newVisibility) {
      tState.visibility[key] !== newVisibility;
      deferred.resolve();
    } else {
      deferred.reject(args);
    }

    return deferred.promise.then(function(result) {
      notify('visibility', args);
      return result;
    });
  }

  // -----------

  function getSelection(key) {
    if (angular.isDefined(key)) {
      return !!tState.selection[key];
    }
    return tState.selection; //TODO
  }

  function setSelection(key, value) {
    console.log(1);
    var deferred = $q.defer();
    var idx = tState.selection.indexOf(key);
    var newSelection = angular.isDefined(value) ? !!value : idx === -1;

    var args = {};
    args[key] = newSelection;

    if ((idx !== -1) !== newSelection) {
      if (newSelection) {
        tState.selection.push(key);
      } else {
        tState.selection.splice(idx, 1);
      }
      deferred.resolve();
    } else {
      deferred.reject(args);
    }

    return deferred.promise.then(function(result) {
      notify('selection', args);
      return result;
    });
  }

  // ----------- Helpers

  function getPageCount() {
    return Math.ceil(tState.itemCount / tState.pageSize);
  }

  function notify(key, data) {
    $rootScope.$emit(tName + '.' + key, data);
  }

}
