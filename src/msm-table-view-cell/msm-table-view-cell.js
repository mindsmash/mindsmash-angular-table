angular
    .module('mindsmash-table')
    .directive('msmTableViewCell', msmTableViewCell);

function msmTableViewCell($compile) {
  return {
    restrict: 'A',
    require: '^msmTableView',
    scope: false,
    link: function(scope, elem, attrs) {
      var template = scope.col.template;
      if (angular.isDefined(template)) {
        elem[0].innerHTML = template;
        $compile(elem.contents())(scope);
      }
    }
  };
}
