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
 * TODO
 *
 * @param {expression} api A {@link mindsmash-table.MsmTable MsmTable} API instance.
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
  vm.itemCount = api.getItemCount();

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

  var rmItemCount = $rootScope.$on(api.getName() + '.itemCount', function(event, itemCount) {
    vm.itemCount = itemCount;
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmPage);
  $scope.$on('$destroy', rmPageSize);
  $scope.$on('$destroy', rmItemCount);
}
