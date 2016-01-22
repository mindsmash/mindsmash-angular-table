angular
    .module('mindsmash-table')
    .constant('msmTableConfig', {
      namespace: 'msmTable',
      source: angular.noop,
      columns: [],
      onAction: angular.noop,
      onBeforeLoad: angular.identity,
      onAfterLoad: angular.identity,
      page: 0,
      pageSizes: [10, 25, 50, 100],
      orderBy: null,
      active: null,
      selection: 'id',
      storage: 'session',
      mobileSize: 'xs',
      mobileTemplateUrl: null
    });
