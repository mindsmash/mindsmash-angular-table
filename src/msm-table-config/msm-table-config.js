angular
    .module('mindsmash-table')
    .constant('msmTableConfig', {

      /* The table' namespace: events, storage, etc. */
      namespace: 'msmTable',

      /* The table's data source: function(params) | Array */
      source: angular.noop,

      /* The table's columns: */
      columns: [],

      /* Callback - executes after the table has been initialized: function(api) */
      onInit: angular.noop,

      /* Callback - executes on Enter for the active row: function(row) */
      onAction: angular.noop,

      /* Callback - executes before new table data is loaded: function(params, api) */
      onBeforeLoad: angular.identity,

      /* Callback - executes after new table data has been loaded: function(data, api) */
      onAfterLoad: angular.identity,

      /* The table's initial page number */
      page: 0,

      /* The table's page sizes: the first page size will be selected on first load */
      pageSizes: [10, 25, 50, 100],

      /* The table's initial sort order: can be disabled if set to false */
      orderBy: null,

      /* The table's initial active row: can be disabled if set to false */
      active: null,

      /* The table's selection key: can be disabled if set to false */
      selection: 'id',

      /* The table's storage: can be 'session', 'local' or disabled if set to false */
      storage: 'session',

      /* The table's mobile template breakpoint */
      mobileSize: 'xs',

      /* An optional mobile template for table rows */
      mobileTemplateUrl: null
    });
