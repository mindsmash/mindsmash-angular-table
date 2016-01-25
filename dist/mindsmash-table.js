/**
 * @name mindsmash-table
 * @version v0.3.1
 * @author mindsmash GmbH
 * @license MIT
 */
(function(angular) {
'use strict';

/**
 * @ngdoc overview
 * @name mindsmash-table
 * @description
 *
 * # mindsmash Table
 * TODO
 *
 * ## Configuration
 * TODO
 *
 * ## Usage
 * TODO
 */
MsmTableFactoryProvider.$inject = ['msmTableConfig', '$translateProvider'];
ColumnSelectorController.$inject = ['$rootScope', '$scope'];
PagerController.$inject = ['$rootScope', '$scope'];
PaginationController.$inject = ['$rootScope', '$scope'];
PaginationSizeController.$inject = ['$rootScope', '$scope'];
ViewController.$inject = ['$rootScope', '$scope', '$filter', 'hotkeys', 'screenSize'];
msmTableViewCell.$inject = ['$compile', '$templateRequest'];
angular.module('mindsmash-table', [
  'ui.bootstrap.dropdown',
  'ui.bootstrap.pager',
  'ui.bootstrap.pagination',
  'ui.bootstrap.tpls',
  'angular-click-outside',
  'cfp.hotkeys',
  'matchMedia',
  'pascalprecht.translate'
]);


angular.module("mindsmash-table").run(['$templateCache', function($templateCache) {$templateCache.put("msm-table-column-selector/msm-table-column-selector.html","<div class=\"btn-group\" uib-dropdown auto-close=\"outsideClick\"><button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle ng-disabled=\"vm.isLoading\"><span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"msm-table-square\"></span> <span class=\"caret\"></span></button><ul uib-dropdown-menu role=\"menu\"><li ng-repeat=\"col in vm.cols\" role=\"menuitem\" ng-class=\"{ \'disabled\': col.isSticky, \'msm-table-isSelected\': vm.visibility[col.key] }\"><a href=\"#\" ng-click=\"!col.isSticky && vm.select(col.key, $event)\" translate=\"{{ col.name }}\"></a></li></ul></div>");
$templateCache.put("msm-table-pager/msm-table-pager.html","<uib-pager ng-model=\"vm.page\" total-items=\"vm.rowCount\" items-per-page=\"vm.pageSize\" ng-disabled=\"vm.isLoading\" previous-text=\"{{ \'msmTable.pager.previous\' | translate }}\" next-text=\"{{ \'msmTable.pager.next\' | translate }}\"></uib-pager>");
$templateCache.put("msm-table-pagination/msm-table-pagination.html","<uib-pagination ng-model=\"vm.page\" total-items=\"vm.rowCount\" items-per-page=\"vm.pageSize\" ng-disabled=\"vm.isLoading\" previous-text=\"{{ \'msmTable.pagination.previous\' | translate }}\" next-text=\"{{ \'msmTable.pagination.next\' | translate }}\" rotate=\"true\" max-size=\"5\"></uib-pagination>");
$templateCache.put("msm-table-pagination-size/msm-table-pagination-size.html","<div class=\"btn-group\" uib-dropdown><button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle ng-disabled=\"vm.isLoading\">{{ vm.pageSize }} <span class=\"caret\"></span></button><ul uib-dropdown-menu role=\"menu\"><li ng-repeat=\"pageSize in vm.pageSizes\" role=\"menuitem\" ng-class=\"{ \'msm-table-isSelected\': pageSize === vm.pageSize }\"><a href=\"#\" ng-click=\"vm.select(pageSize, $event)\">{{ pageSize }}</a></li></ul></div>");
$templateCache.put("msm-table-view/msm-table-view.html","<div><table id=\"{{ vm.name }}\" class=\"table msm-table-table-view\" ng-class=\"{ \'msm-table-isLoading\': vm.isLoading }\" ng-if=\"!vm.isMobile\" click-outside=\"vm.clearActive()\"><thead><tr><th class=\"msm-table-selector-all\" ng-show=\"vm.selectionEnabled\"></th><th ng-repeat=\"col in vm.cols | filter : vm.visibility[col.key]\" ng-class=\"{\'msm-table-isSortable\': vm.orderByEnabled && col.isSortable !== false,\'msm-table-isSortedAsc\': vm.orderBy.key === col.key && vm.orderBy.asc === true,\'msm-table-isSortedDesc\': vm.orderBy.key === col.key && vm.orderBy.asc === false }\" ng-click=\"vm.orderByEnabled && col.isSortable !== false && vm.setOrderBy(col.key)\" translate=\"{{ col.name }}\"></th></tr></thead><thead class=\"msm-table-loading-bar\"><tr><td colspan=\"{{ vm.cols.length + 1 }}\"><div class=\"msm-table-progress\"><div class=\"msm-table-container\"><div class=\"msm-table-bar msm-table-bar1\"></div><div class=\"msm-table-bar msm-table-bar2\"></div></div></div></td></tr></thead><tbody><tr ng-repeat=\"row in vm.rows\" ng-class=\"{ \'msm-table-isActive\': vm.active === $index, \'msm-table-isSelected\': vm.selection[row.id] }\" ng-click=\"vm.activeEnabled && vm.setActive($index)\"><td class=\"msm-table-selector\" ng-show=\"vm.selectionEnabled\" ng-click=\"vm.setSelection(row[vm.selectionKey])\"></td><td ng-repeat=\"col in vm.cols | filter : vm.visibility[col.key]\" data-label=\"{{ col.name }}\" msm-table-view-cell>{{ row[col.key] }}</td></tr></tbody></table><ol class=\"list-unstyled msm-table-list-view\" ng-if=\"vm.isMobile\"><li ng-repeat=\"row in vm.rows\" ng-include=\"vm.mobileTemplateUrl\"></li></ol></div>");}]);

angular
    .module('mindsmash-table')
    .provider('msmTableFactory', MsmTableFactoryProvider);

/**
 * @ngdoc service
 * @name mindsmash-table.msmTableFactoryProvider
 *
 * @description
 * TODO
 */
function MsmTableFactoryProvider(msmTableConfig, $translateProvider) {
  $get.$inject = ['$rootScope', '$filter', '$q', '$window'];
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

  function $get($rootScope, $filter, $q, $window) {
    return new MsmTableFactory($rootScope, $filter, $q, $window, tableConfig);
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.msmTableFactory
 *
 * @description
 * TODO
 */
function MsmTableFactory($rootScope, $filter, $q, $window, tableConfig) {

  /**
   * @ngdoc method
   * @name get
   * @methodOf mindsmash-table.msmTableFactory
   *
   * @description
   * Returns a new {@link mindsmash-table.msmTable MsmTable} API instance to be used with *msmTable*-directives.
   *
   * @param {string} name The table's unique identifier.
   * @param {Object} config The table's configuration.
   * @returns {Object} A {@link mindsmash-table.msmTable MsmTable} API instance.
   */
  return {
    get: get
  };

  // ==========

  function get(name, config) {
    return new MsmTable($rootScope, $filter, $q, $window, name, angular.merge(tableConfig, config));
  }
}

/**
 * @ngdoc service
 * @name mindsmash-table.msmTable
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
function MsmTable($rootScope, $filter, $q, $window, tableName, tableConfig) {
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
    page: tableConfig.page,
    pageSize: tableConfig.pageSizes[0],
    rowCount: 100, //TODO
    orderBy: tableConfig.orderBy,
    active: tableConfig.active,
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

  vm.getRowCount = getRowCount;

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

  function getRowCount() {
    return tState.rowCount;
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

  function getLocalData(params) {
    var data = tableConfig.source;
    return $q(function(resolve) {
      var from = params.page * params.pageSize;
      var to = from + params.pageSize;
      var items = params.orderBy ? $filter('orderBy')(data, params.orderBy, !params.orderAsc) : data;
      items = items.slice(from, to);
      resolve({
        content: items,
        number: params.page,
        numberOfElements: items.length,
        size: params.pageSize,
        sort: params.orderBy,
        totalElements: data.length,
        totalPages: Math.ceil(data.length / params.pageSize)
      });
    });
  }

  /**
   * @ngdoc method
   * @name reload
   * @methodOf mindsmash-table.msmTable
   *
   * @description
   * Reloads the data of the table.
   *
   * @returns {Promise} A table resource promise.
   */
  function reload() {
    var params = tableConfig.onBeforeLoad(getParams());
    var data = angular.isArray(tableConfig.source) ? getLocalData(params) : tableConfig.source(params);

    notify('loading', true);

    return data.then(function(response) {
      response = tableConfig.onAfterLoad(response);

      /* refresh content */
      tRows = response.content;
      notify('items');

      /* refresh state */
      var mappings = { //TODO: check mappings
        number: 'page',
        size: 'pageSize',
        totalElements: 'rowCount',
        orderBy: 'orderBy'
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
      var pageItemCount = getPageItemCount();
      if (tState.active !== null && tState.active >= pageItemCount) {
        tState.active = pageItemCount - 1;
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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

    var pageItemCount = getPageItemCount();
    if (active === null) {
      newActive = tState.active !== null ? null : tState.active;
    } else if (active < 0) {
      prev = tState.page > 0;
      newActive = prev ? tState.pageSize - 1 : (active !== null ? 0 : null);
    } else if (active >= pageItemCount) {
      next = tState.page < getPageCount() - 1;
      newActive = next ? 0 : (active !== null ? pageItemCount - 1 : null);
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
   * @methodOf mindsmash-table.msmTable
   *
   * @description
   * Shortcut method to activate the first row.
   *
   * @returns {Promise} A table resource promise.
   */
  function firstActive() {
    return setActive(0)
  }

  /**
   * @ngdoc method
   * @name previousActive
   * @methodOf mindsmash-table.msmTable
   *
   * @description
   * Shortcut method to activate the previous row.
   *
   * @returns {Promise} A table resource promise.
   */
  function previousActive() {
    return setActive(tState.active !== null ? tState.active - 1 : 0);
  }

  /**
   * @ngdoc method
   * @name nextActive
   * @methodOf mindsmash-table.msmTable
   *
   * @description
   * Shortcut method to activate the next row.
   *
   * @returns {Promise} A table resource promise.
   */
  function nextActive() {
    return setActive(tState.active !== null ? tState.active + 1 : 0);
  }

  /**
   * @ngdoc method
   * @name lastActive
   * @methodOf mindsmash-table.msmTable
   *
   * @description
   * Shortcut method to activate the last row.
   *
   * @returns {Promise} A table resource promise.
   */
  function lastActive() {
    return setActive(getPageItemCount() - 1);
  }

  /**
   * @ngdoc method
   * @name clearActive
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
   * @methodOf mindsmash-table.msmTable
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
    return Math.ceil(tState.rowCount / tState.pageSize);
  }

  function getPageItemCount() {
    return tState.page < getPageCount() - 1 ? tState.pageSize : tState.rowCount % tState.pageSize;
  }

  function notify(key, data) {
    $rootScope.$emit(tName + '.' + key, data);
  }

  function saveAndNotify(key, data) {
    notify(key, data);
    saveState();
  }
}


angular
    .module('mindsmash-table')
    .directive('msmTableColumnSelector', msmTableColumnSelector);

/**
 * @ngdoc directive
 * @name mindsmash-table.directive:msmTableColumnSelector
 * @restrict E
 * @scope
 *
 * @description
 * This directive renders a column selector.
 *
 * # Configuration
 * This directive is configured via the {@link mindsmash-table.msmTable MsmTable} API instance or the default parameters
 * set in the {@link mindsmash-table.msmTableFactoryProvider MsmTableFactoryProvider}. Valid configuration values are
 * described in the {@link mindsmash-table.msmTable MsmTable} configuration section.
 *
 * @param {expression} api A {@link mindsmash-table.msmTable MsmTable} API instance.
 */
function msmTableColumnSelector() {
  return {
    restrict: 'E',
    controller: ColumnSelectorController,
    controllerAs: 'vm',
    templateUrl: 'msm-table-column-selector/msm-table-column-selector.html',
    scope: {
      api: '&'
    }
  };
}

function ColumnSelectorController($rootScope, $scope) {
  var vm = this;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.cols = cfg.columns;
  vm.visibility = api.getVisibility();

  vm.select = select;

  // ==========

  function select(key, event) {
    event.preventDefault();

    var toggleable = !vm.visibility[key];
    if (!toggleable) {
      var vKeys = Object.keys(vm.visibility);
      while (!toggleable && vKeys.length > 0) {
        var vKey = vKeys.shift();
        toggleable = vKey !== key && vm.visibility[vKey];
      }
    }

    if (toggleable) {
      return api.setVisibility(key);
    }
  }

  var rmLoading = $rootScope.$on(api.getName() + '.loading', function(event, isLoading) {
    vm.isLoading = isLoading;
  });

  var rmVisibility = $rootScope.$on(api.getName() + '.visibility', function(event, visibility) {
    vm.visibility = visibility;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmVisibility);
}


angular
    .module('mindsmash-table')
    .constant('msmTableConfig', {
      namespace: 'msmTable',
      source: angular.noop,
      columns: [],
      onAction: angular.noop,
      onBeforeLoad: angular.identity,
      onAfterLoad: angular.identity,
      page: 0,
      pageSizes: [10, 25, 50, 100],
      orderBy: null,
      active: null,
      selection: 'id',
      storage: 'session',
      mobileSize: 'xs',
      mobileTemplateUrl: null
    });


angular
    .module('mindsmash-table')
    .directive('msmTablePager', msmTablePager);

/**
 * @ngdoc directive
 * @name mindsmash-table.directive:msmTablePager
 * @restrict E
 * @scope
 *
 * @description
 * This directive renders a lightweight pager that is focused on providing
 * previous/next paging functionality.
 *
 * # Configuration
 * This directive is configured via the {@link mindsmash-table.msmTable MsmTable} API instance or the default parameters
 * set in the {@link mindsmash-table.msmTableFactoryProvider MsmTableFactoryProvider}. Valid configuration values are
 * described in the {@link mindsmash-table.msmTable MsmTable} configuration section.
 *
 * @param {expression} api A {@link mindsmash-table.msmTable MsmTable} API instance.
 */
function msmTablePager() {
  return {
    restrict: 'E',
    controller: PagerController,
    controllerAs: 'vm',
    templateUrl: 'msm-table-pager/msm-table-pager.html',
    scope: {
      api: '&'
    }
  };
}

function PagerController($rootScope, $scope) {
  var vm = this;
  var OFFSET = 1;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.page = api.getPage() + OFFSET;
  vm.pageSize = api.getPageSize();
  vm.rowCount = api.getRowCount();

  // ==========

  $scope.$watch('vm.page', function(newVal, oldVal) {
    api.setPage(newVal - OFFSET);
  });

  // ----------

  var rmLoading = $rootScope.$on(api.getName() + '.loading', function(event, isLoading) {
    vm.isLoading = isLoading;
  });

  var rmPage = $rootScope.$on(api.getName() + '.page', function(event, page) {
    vm.page = page + OFFSET;
  });

  var rmPageSize = $rootScope.$on(api.getName() + '.pageSize', function(event, pageSize) {
    vm.pageSize = pageSize;
  });

  var rmRowCount = $rootScope.$on(api.getName() + '.rowCount', function(event, rowCount) {
    vm.rowCount = rowCount;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmPage);
  $scope.$on('$destroy', rmPageSize);
  $scope.$on('$destroy', rmRowCount);
}


angular
    .module('mindsmash-table')
    .directive('msmTablePagination', msmTablePagination);

/**
 * @ngdoc directive
 * @name mindsmash-table.directive:msmTablePagination
 * @restrict E
 * @scope
 *
 * @description
 * This directive renders a pagination component.
 *
 * # Configuration
 * This directive is configured via the {@link mindsmash-table.msmTable MsmTable} API instance or the default parameters
 * set in the {@link mindsmash-table.msmTableFactoryProvider MsmTableFactoryProvider}. Valid configuration values are
 * described in the {@link mindsmash-table.msmTable MsmTable} configuration section.
 *
 * @param {expression} api A {@link mindsmash-table.msmTable MsmTable} API instance.
 */
function msmTablePagination() {
  return {
    restrict: 'E',
    controller: PaginationController,
    controllerAs: 'vm',
    templateUrl: 'msm-table-pagination/msm-table-pagination.html',
    scope: {
      api: '&'
    }
  };
}

function PaginationController($rootScope, $scope) {
  var vm = this;
  var OFFSET = 1;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.page = api.getPage() + OFFSET;
  vm.pageSize = api.getPageSize();
  vm.rowCount = api.getRowCount();

  // ==========

  $scope.$watch('vm.page', function(newVal, oldVal) {
    api.setPage(newVal - OFFSET);
  });

  // ----------

  var rmLoading = $rootScope.$on(api.getName() + '.loading', function(event, isLoading) {
    vm.isLoading = isLoading;
  });

  var rmPage = $rootScope.$on(api.getName() + '.page', function(event, page) {
    vm.page = page + OFFSET;
  });

  var rmPageSize = $rootScope.$on(api.getName() + '.pageSize', function(event, pageSize) {
    vm.pageSize = pageSize;
  });

  var rmRowCount = $rootScope.$on(api.getName() + '.rowCount', function(event, rowCount) {
    vm.rowCount = rowCount;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmPage);
  $scope.$on('$destroy', rmPageSize);
  $scope.$on('$destroy', rmRowCount);
}


angular
    .module('mindsmash-table')
    .directive('msmTablePaginationSize', msmTablePaginationSize);

/**
 * @ngdoc directive
 * @name mindsmash-table.directive:msmTablePaginationSize
 * @restrict E
 * @scope
 *
 * @description
 * This directive renders a page size selector.
 *
 * # Configuration
 * This directive is configured via the {@link mindsmash-table.msmTable MsmTable} API instance or the default parameters
 * set in the {@link mindsmash-table.msmTableFactoryProvider MsmTableFactoryProvider}. Valid configuration values are
 * described in the {@link mindsmash-table.msmTable MsmTable} configuration section.
 *
 * @param {expression} api A {@link mindsmash-table.msmTable MsmTable} API instance.
 */
function msmTablePaginationSize() {
  return {
    restrict: 'E',
    controller: PaginationSizeController,
    controllerAs: 'vm',
    templateUrl: 'msm-table-pagination-size/msm-table-pagination-size.html',
    scope: {
      api: '&'
    }
  };
}

function PaginationSizeController($rootScope, $scope) {
  var vm = this;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.pageSize = api.getPageSize();
  vm.pageSizes = cfg.pageSizes;

  vm.select = select;

  // ==========

  function select(pageSize, event) {
    event.preventDefault();
    vm.pageSize = pageSize; // optimistic update
    api.setPageSize(pageSize);
  }

  // ----------

  var rmLoading = $rootScope.$on(api.getName() + '.loading', function(event, isLoading) {
    vm.isLoading = isLoading;
  });

  var rmPageSize = $rootScope.$on(api.getName() + '.pageSize', function(event, pageSize) {
    vm.pageSize = pageSize;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmPageSize);
}


angular
    .module('mindsmash-table')
    .directive('msmTableView', msmTableView);

/**
 * @ngdoc directive
 * @name mindsmash-table.directive:msmTableView
 * @restrict E
 * @scope
 *
 * @description
 * This directive renders the actual table view.
 *
 * # Configuration
 * This directive is configured via the {@link mindsmash-table.msmTable MsmTable} API instance or the default parameters
 * set in the {@link mindsmash-table.msmTableFactoryProvider MsmTableFactoryProvider}. Valid configuration values are
 * described in the {@link mindsmash-table.msmTable MsmTable} configuration section.
 *
 * @param {expression} api A {@link mindsmash-table.msmTable MsmTable} API instance.
 */
function msmTableView() {
  return {
    restrict: 'E',
    controller: ViewController,
    controllerAs: 'vm',
    templateUrl: 'msm-table-view/msm-table-view.html',
    scope: {
      api: '&'
    }
  };
}

function ViewController($rootScope, $scope, $filter, hotkeys, screenSize) {
  var vm = this;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.name = api.getName();
  vm.cols = getVisibleCols(cfg.columns, api.getVisibility());
  vm.rows = api.getRows();

  vm.orderByEnabled = cfg.orderBy !== false;
  if (vm.orderByEnabled) {
    vm.orderBy = api.getOrderBy();
    vm.setOrderBy = api.setOrderBy;
  }

  vm.activeEnabled = cfg.active !== false;
  if (vm.activeEnabled) {
    vm.active = api.getActive();
    vm.setActive = api.setActive;
    vm.clearActive = api.clearActive;
  }

  vm.selectionEnabled = cfg.selection !== false;
  if (vm.selectionEnabled) {
    vm.selectionKey = cfg.selection;
    vm.selection = api.getSelection();
    vm.setSelection = api.setSelection;
    vm.clearSelection = api.clearSelection;
  }

  vm.isMobile = false;
  vm.mobileSize = cfg.mobileSize;
  vm.mobileTemplateUrl = cfg.mobileTemplateUrl;
  if (vm.mobileSize && vm.mobileTemplateUrl) {
    vm.isMobile = screenSize.is(vm.mobileSize);
    screenSize.on(vm.mobileSize, function(isMobile) {
      if (vm.isMobile !== isMobile) {
        vm.isMobile = isMobile;
      }
    });
  }

  // ==========

  function getVisibleCols(columns, visibility) {
    return $filter('filter')(columns, function(col) {
      return visibility[col.key];
    });
  }

  function onFirstActive() {
    return vm.active === null ? api.lastActive() : api.firstActive();
  }

  function onLastActive() {
    return vm.active === null ? api.firstActive() : api.lastActive();
  }

  function onAction(event) {
    return cfg.onAction(vm.rows[api.getActive()], event);
  }

  hotkeys.bindTo($scope).add({
    combo: 'shift+left',
    callback: replaceDefault(api.firstPage)
  }).add({
    combo: 'left',
    callback: replaceDefault(api.previousPage)
  }).add({
    combo: 'right',
    callback: replaceDefault(api.nextPage)
  }).add({
    combo: 'shift+right',
    callback: replaceDefault(api.lastPage)
  });

  if (vm.activeEnabled) {
    hotkeys.bindTo($scope).add({
      combo: 'shift+up',
      callback: replaceDefault(onFirstActive)
    }).add({
      combo: 'up',
      callback: replaceDefault(api.previousActive, true)
    }).add({
      combo: 'down',
      callback: replaceDefault(api.nextActive, true)
    }).add({
      combo: 'shift+down',
      callback: replaceDefault(onLastActive)
    }).add({
      combo: 'esc',
      callback: api.clearActive
    }).add({
      combo: 'return',
      callback: replaceDefault(onAction, true)
    });
  }

  if (vm.selectionEnabled) {
    hotkeys.bindTo($scope).add({
      combo: 'shift+esc',
      callback: api.clearSelection
    });
  }

  if (vm.activeEnabled && vm.selectionEnabled) {
    hotkeys.bindTo($scope).add({
      combo: 'space',
      callback: replaceDefault(api.setActiveSelection)
    });
  }

  function replaceDefault(callback, iffActive) {
    return function(event) {
      if (!vm.isLoading && (!iffActive || api.getActive() !== null)) {
        event.preventDefault();
        callback();
      }
    };
  }

  // ----------

  var rmLoading = $rootScope.$on(api.getName() + '.loading', function(event, isLoading) {
    vm.isLoading = isLoading;
  });

  var rmItems = $rootScope.$on(api.getName() + '.items', function(event) {
    vm.rows = api.getRows();
  });

  var rmOrderBy = $rootScope.$on(api.getName() + '.orderBy', function(event, orderBy) {
    vm.orderBy = orderBy;
  });

  var rmActive = $rootScope.$on(api.getName() + '.active', function(event, active) {
    vm.active = active;
  });

  var rmVisibility = $rootScope.$on(api.getName() + '.visibility', function(event, visibility) {
    vm.cols = getVisibleCols(cfg.columns, visibility);
  });

  var rmSelection = $rootScope.$on(api.getName() + '.selection', function(event, selection) {
    vm.selection = selection;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmItems);
  $scope.$on('$destroy', rmOrderBy);
  $scope.$on('$destroy', rmActive);
  $scope.$on('$destroy', rmVisibility);
  $scope.$on('$destroy', rmSelection);
}


angular
    .module('mindsmash-table')
    .directive('msmTableViewCell', msmTableViewCell);

function msmTableViewCell($compile, $templateRequest) {
  return {
    restrict: 'A',
    require: '^msmTableView',
    scope: false,
    link: function(scope, elem, attrs) {
      var templateUrl = scope.col.templateUrl;
      var template = scope.col.template;
      if (angular.isDefined(templateUrl)) {
        $templateRequest(templateUrl).then(function(template) {
          elem[0].innerHTML = template;
          $compile(elem.contents())(scope);
        });
      } else if (angular.isDefined(template)) {
        elem[0].innerHTML = template;
        $compile(elem.contents())(scope);
      }
    }
  };
}

})(angular);