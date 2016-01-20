angular
    .module('mindsmash-table')
    .directive('msmTableRowSelector', msmTableRowSelector);

function msmTableRowSelector($timeout) {
  return {
    restrict: 'A',
    require: '^msmTableView',
    scope: {
      rows: '=msmTableRowSelector',
      selection: '=',
      selectionKey: '&'
    },
    link: function(scope, elem, attrs, ctrl) {
      var api = ctrl.api;
      var selectionKey = scope.selectionKey();

      // ==========

      function count() {
        var result = 0;
        for (var i = 0; i < scope.rows.length; i++) {
          if (scope.selection.indexOf(scope.rows[i][selectionKey]) !== -1) {
            result += 1;
          }
        }
        return result;
      }

      function update() {
        switch (count()) {
          case 0:
            return elem.prop('checked', false).prop('indeterminate', false);
          case scope.rows.length:
            return elem.prop('checked', true).prop('indeterminate', false);
          default:
            return elem.prop('checked', false).prop('indeterminate', true);
        }
      }

      function updateWatch(newVal, oldVal) {
        if (newVal !== oldVal) {
          update();
        }
      }

      // ----------

      scope.$watch('data', updateWatch, true);
      scope.$watch('selection', updateWatch, true);

      elem.bind('change', function() {
        $timeout(function() {
          if (elem.prop('checked')) {
            console.log("all");
            //api.setPageSelection(true);
          } else {
            console.log("none");
            //api.setPageSelection(false);
          }
        });
      });
    }
  };
}
