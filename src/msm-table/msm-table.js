angular
    .module('mindsmash-table')
    .provider('MsmTableFactory', MsmTableFactoryProvider);

/**
 * @ngdoc service
 * @name mindsmash-table.MsmTableFactoryProvider
 *
 * @description
 * TODO
 */
function MsmTableFactoryProvider(msmTableConfig, $translateProvider) {
  var tableConfig = msmTableConfig;

  $translateProvider.translations('en', {
    'msmTable.pagination.previous': '«',
    'msmTable.pagination.next': '»',
    'msmTable.pager.previous': '« Previous',
    'msmTable.pager.next': 'Next »'
  });

  return {
    setTableConfig: defaultTableConfig,
    $get: $get
  };

  // ==========

  function defaultTableConfig(config) {
    angular.merge(tableConfig, config);
  }

  function $get($rootScope, $q, $window) {
    return new MsmTableFactory($rootScope, $q, $window, tableConfig);
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.MsmTableFactory
 *
 * @description
 * TODO
 */
function MsmTableFactory($rootScope, $q, $window, tableConfig) {

  /**
   * @ngdoc method
   * @name get
   * @methodOf mindsmash-table.MsmTableFactory
   *
   * @description
   * Returns a new {@link mindsmash-table.MsmTable MsmTable} API instance to be used with *msmTable*-directives.
   *
   * @param {string} name The table's unique identifier.
   * @param {Object} config The table's configuration.
   * @returns {Object} A {@link mindsmash-table.MsmTable MsmTable} API instance.
   */
  return {
    get: get
  };

  // ==========

  function get(name, config) {
    return new MsmTable($rootScope, $q, $window, name, angular.merge(tableConfig, config));
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.MsmTable
 *
 * @description
 * TODO
 *
 * #Configuration
 * TODO
 *
 * #Events
 * TODO
 */
function MsmTable($rootScope, $q, $window, tableName, tableConfig) {
  var vm = this;

  var tName = tableConfig.namespace + '.' + tableName;
  var tCols = tableConfig.columns;
  var tRows = [];

  var tStorage = function() {
    if (tableConfig.storage === 'session') {
      return sessionStorage;
    } else if (tableConfig.storage === 'local') {
      return localStorage;
    }
    return null;
  }();

  var tState = angular.extend({
    active: tableConfig.active,
    page: tableConfig.page,
    pageSize: tableConfig.pageSizes[0],
    itemCount: 100, // should be named RowCount
    orderBy: tableConfig.orderBy,
    selection: {},
    visibility: function init() {
      var result = {};
      for (var i = 0; i < tCols.length; i++) {
        result[tCols[i].key] = !tCols[i].isHidden;
      }
      return result;
    }()
  }, loadState());

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

  if (tableConfig.orderBy !== false) {
    vm.getOrderBy = getOrderBy;
    vm.setOrderBy = setOrderBy;
    vm.clearOrderBy = clearOrderBy;
  }

  if (tableConfig.active !== false) {
    vm.getActive = getActive;
    vm.setActive = setActive;
    vm.firstActive = firstActive;
    vm.previousActive = previousActive;
    vm.nextActive = nextActive;
    vm.lastActive = lastActive;
    vm.clearActive = clearActive;
  }

  vm.getVisibility = getVisibility;
  vm.setVisibility = setVisibility;

  if (tableConfig.selection !== false) {
    vm.getSelection = getSelection;
    vm.setSelection = setSelection;
    vm.clearSelection = clearSelection;
    if (tableConfig.active !== false) {
      vm.setActiveSelection = setActiveSelection;
    }
  }

  // ----------

  vm.reload();

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

  /**
   * @ngdoc method
   * @name reload
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Reloads the data of the table.
   *
   * @returns {Promise} A table resource promise.
   */
  function reload() {
    notify('loading', true);
    return tableConfig.source(tableConfig.onBeforeLoad(getParams())).then(function(response) {
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
        if (mappings.hasOwnProperty(remoteKey)) {
          var localKey = mappings[remoteKey];
          var remoteValue = response[remoteKey];
          if (tState[localKey] !== remoteValue) {
            tState[localKey] = remoteValue;
            notify(localKey, remoteValue);
          }
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

  // ----------- Storage

  function loadState() {
    var data = tStorage !== null ? tStorage[tName] : null;
    return data ? JSON.parse(data) : {};
  }

  function saveState() {
    if (tStorage !== null) {
      tStorage[tName] = JSON.stringify({
        page: tState.page,
        pageSize: tState.pageSize,
        orderBy: tState.orderBy
      });
    }
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
      saveAndNotify('page', newPage);
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
      saveAndNotify('pageSize', newPageSize);
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
      saveAndNotify('orderBy', newOrderBy);
      return result;
    });
  }

  /**
   * @ngdoc method
   * @name clearOrderBy
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to clear the current sort order.
   *
   * @returns {Promise} A table resource promise.
   */
  function clearOrderBy() {
    return setOrderBy(null);
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
    setActive(tState.active !== null ? 0 : tRows.length - 1)
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
    setActive(tState.active !== null ? tState.active - 1 : 0);
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
    setActive(tState.active !== null ? tState.active + 1 : 0);
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
    setActive(tState.active !== null ? tRows.length - 1 : 0)
  }

  /**
   * @ngdoc method
   * @name clearActive
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to clear the current active row.
   *
   * @returns {Promise} A table resource promise.
   */
  function clearActive() {
    return setActive(null);
  }

  // ----------- Column Visibility

  /**
   * @ngdoc method
   * @name getVisibility
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the visibility of the column with the given `key` or the visibility of all columns.
   *
   * @param {string=} key The column's key.
   * @returns {boolean|Object} The visibility.
   */
  function getVisibility(key) {
    return angular.isDefined(key) ? !!tState.visibility[key] : tState.visibility;
  }

  /**
   * @ngdoc method
   * @name setVisibility
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Toggles or sets the visibility of the column with the given key. The visibility is set according to the following
   * rules:
   *
   * - **toggle** (rotate visibility), if the `value` parameter is omitted.
   * - **set** (spec. visibility), if the `value` is explicitly set.
   *
   * @param {string=} key The column's key.
   * @param {boolean=} value The new visibility value.
   * @returns {Promise} A table resource promise.
   */
  function setVisibility(key, value) {
    var deferred = $q.defer();
    var newVisibility = angular.isDefined(value) ? !!value : !tState.visibility[key];

    if (tState.visibility[key] !== newVisibility) {
      tState.visibility[key] = newVisibility;
      deferred.resolve();
    } else {
      var args = {};
      args[key] = newVisibility;
      deferred.reject(args);
    }

    return deferred.promise.then(function(result) {
      notify('visibility', tState.visibility);
      return result;
    });
  }

  // ----------- Row Selection

  /**
   * @ngdoc method
   * @name getSelection
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Returns the selection of the column with the given `key` or the selection of all columns.
   *
   * @param {string=} key The column's key.
   * @returns {boolean|Object} The selection.
   */
  function getSelection(key) {
    return angular.isDefined(key) ? !!tState.selection[key] : tState.selection;
  }

  /**
   * @ngdoc method
   * @name setSelection
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Toggles or sets the selection of the column with the given key. The selection is set according to the following
   * rules:
   *
   * - **toggle** (rotate selection), if the `value` parameter is omitted.
   * - **set** (spec. selection), if the `value` is explicitly set.
   *
   * @param {string=} key The column's key.
   * @param {boolean=} value The new selection value.
   * @returns {Promise} A table resource promise.
   */
  function setSelection(key, value) {
    var deferred = $q.defer();
    var newSelection = angular.isDefined(value) ? !!value : !tState.selection[key];

    if (tState.selection[key] !== newSelection) {
      tState.selection[key] = newSelection;
      deferred.resolve();
    } else {
      var args = {};
      args[key] = newSelection;
      deferred.reject(args);
    }

    return deferred.promise.then(function(result) {
      notify('selection', tState.selection);
      return result;
    });
  }

  /**
   * @ngdoc method
   * @name setActiveSelection
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to set the selection for the activate row.
   *
   * @returns {Promise} A table resource promise.
   */
  function setActiveSelection(value) {
    var deferred = $q.defer();

    if (tState.active !== null) {
      return setSelection(tRows[tState.active][tableConfig.selection], value);
    } else {
      deferred.reject(value);
    }
  }

  /**
   * @ngdoc method
   * @name clearSelection
   * @methodOf mindsmash-table.MsmTable
   *
   * @description
   * Shortcut method to clear the selection.
   *
   * @returns {Promise} A table resource promise.
   */
  function clearSelection() {
    var deferred = $q.defer();

    if (tState.selection !== {}) {
      tState.selection = {};
      deferred.resolve();
    } else {
      deferred.reject();
    }

    return deferred.promise.then(function(result) {
      notify('selection', tState.selection);
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

  function saveAndNotify(key, data) {
    notify(key, data);
    saveState();
  }
}
