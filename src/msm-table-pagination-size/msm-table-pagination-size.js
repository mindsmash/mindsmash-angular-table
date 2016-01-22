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
