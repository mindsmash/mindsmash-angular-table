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
 * TODO
 *
 * @param {expression} api A {@link mindsmash-table.MsmTable MsmTable} API instance.
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

  function select(columnKey, event) {
    event.preventDefault();
    api.setVisibility(columnKey);
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
