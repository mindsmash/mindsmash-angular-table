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
