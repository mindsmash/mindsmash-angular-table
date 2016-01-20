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

function ViewController($rootScope, $scope, hotkeys) {
  var vm = this;

  var api = $scope.api();
  var cfg = api.getConfig();

  // ==========

  vm.isLoading = false;
  vm.cols = cfg.columns;
  vm.rows = api.getRows();
  //vm.cols = getColumnVisibility(cfg.columns, api.getVisibility());
  //vm.rows = getRowSelection(api.getRows(), api.getSelection());
  vm.orderBy = api.getOrderBy();
  vm.active = api.getActive();
  vm.selection = api.getSelection();
  vm.selectionKey = cfg.selection.key;

  vm.sort = api.setOrderBy;
  vm.activate = api.setActive;
  vm.select = select;
  vm.isVisible = isVisible;

  // ==========

  function isVisible(key) {
    return //XXXXXXX
  }

  function select(key, $event) {
    //$event.preventDefault();
    return api.setSelection(key);
  }

  /*
   function getRowSelection(rows, selection) {
   var result = rows.slice(0);
   for (var i = 0; i < result.length; i++) {
   var row = result[i];
   row.isSelected = selection.indexOf([selectionKey];
   }
   }


   function getColumnVisibility(columns, visibility) {
   var result = [];
   for (var i = 0; i < columns.length; i++) {
   var column = columns[i];
   column.isVisible = visibility[column.key];
   result.push(column);
   }
   return result;
   }

   function updateColumnVisibility(visibility) {
   for (var key in visibility) {
   for (var i = 0; i < vm.cols.length; i++) {
   if (vm.cols[i].key === key) {
   vm.cols[i].isVisible = visibility[key];
   break;
   }
   }
   }
   }
   */

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
    console.log(visibility);
    //updateColumnVisibility(visibility);
  });

  var rmSelection = $rootScope.$on(api.getName() + '.selection', function(event, selection) {
    console.log(selection)
  });

  $scope.$on('$destroy', rmLoading);
  $scope.$on('$destroy', rmItems);
  $scope.$on('$destroy', rmOrderBy);
  $scope.$on('$destroy', rmActive);
  $scope.$on('$destroy', rmVisibility);
  $scope.$on('$destroy', rmSelection);
}
