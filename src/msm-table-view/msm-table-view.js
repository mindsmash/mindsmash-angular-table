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

function ViewController($rootScope, $scope, $filter, hotkeys) {
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

  // ==========

  function getVisibleCols(columns, visibility) {
    return $filter('filter')(columns, function(col) {
      return visibility[col.key];
    });
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
      callback: replaceDefault(api.firstActive)
    }).add({
      combo: 'up',
      callback: replaceDefault(api.previousActive, true)
    }).add({
      combo: 'down',
      callback: replaceDefault(api.nextActive, true)
    }).add({
      combo: 'shift+down',
      callback: replaceDefault(api.lastActive)
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
      if (!iffActive || api.getActive() !== null) {
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
