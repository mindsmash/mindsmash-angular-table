angular
    .module('mindsmash-table')
    .constant('msmTableConfig', {
      namespace: 'msmTable',
      source: angular.noop,
      columns: [],
      active: null,
      page: 0,
      pageSizes: [10, 25, 50, 100],
      onAction: angular.noop,
      onBeforeLoad: angular.identity,
      onAfterLoad: angular.identity,
      selection: 'id',
      orderBy: null,
      storage: 'session'
    });
