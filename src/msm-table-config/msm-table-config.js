angular
    .module('mindsmash-table')
    .constant('msmTableConfig', {
      namespace: 'msmTable',
      source: angular.noop,
      columns: [],
      pageSizes: [10, 25, 50, 100],
      onBeforeLoad: angular.identity,
      onAfterLoad: angular.identity,
      selection: {
        key: 'id'
      }
    });
