angular
    .module('mindsmash-table')
    .directive('msmTableViewCell', msmTableViewCell);

function msmTableViewCell($compile, $templateRequest) {
  return {
    restrict: 'A',
    require: '^msmTableView',
    scope: false,
    link: function(scope, elem, attrs) {
      var templateUrl = scope.col.templateUrl;
      var template = scope.col.template;
      if (angular.isDefined(templateUrl)) {
        $templateRequest(templateUrl).then(function(template) {
          elem[0].innerHTML = template;
          $compile(elem.contents())(scope);
        });
      } else if (angular.isDefined(template)) {
        elem[0].innerHTML = template;
        $compile(elem.contents())(scope);
      }
    }
  };
}
