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
 * TODO
 *
 * @param {expression} api A {@link mindsmash-table.MsmTable MsmTable} API instance.
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
  vm.cols = getVisibleCols(cfg.columns, api.getVisibility());
  vm.rows = api.getRows();
  vm.orderBy = api.getOrderBy();
  vm.active = api.getActive();
  vm.selection = api.getSelection();
  vm.selectionKey = cfg.selection.key;

  vm.sort = api.setOrderBy;
  vm.activate = api.setActive;
  vm.select = api.setSelection;

  // ==========

  function getVisibleCols(columns, visibility) {
    return $filter('filter')(columns, function(col) {
      return visibility[col.key];
    });
  }

  // TODO: if hotkeys
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

  // TODO: if hotkeys && selection
  hotkeys.bindTo($scope).add({
    combo: 'shift+up',
    callback: replaceDefault(api.firstActive)
  }).add({
    combo: 'up',
    callback: replaceDefault(api.previousActive)
  }).add({
    combo: 'down',
    callback: replaceDefault(api.nextActive)
  }).add({
    combo: 'shift+down',
    callback: replaceDefault(api.lastActive)
  });

  function replaceDefault(callback) {
    return function(event) {
      event.preventDefault();
      callback();
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
