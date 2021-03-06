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
