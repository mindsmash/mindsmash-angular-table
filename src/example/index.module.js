(function(angular) {
  'use strict';

  angular.module('app', [
        'mindsmash-table',
        'pascalprecht.translate'
      ])

      .config(function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('en');
        $translateProvider.translations('en', {
          'msmTable.pagination.previous': '«',
          'msmTable.pagination.next': '»',
          'msmTable.pager.previous': '« Previous',
          'msmTable.pager.next': 'Next »',
          'id': 'ID',
          'firstName': 'First Name',
          'lastName': 'Last Name',
          'age': 'Age',
          'birthday': 'Birthday',
          'address': 'Address',
          'city': 'City',
          'country': 'Country',
          'phone': 'Phone',
          'about': 'About'
        });
      })

      .run()

      .controller('AppController', function($filter, $q, $timeout, $log, msmTableFactory) {
        var vm = this;

        vm.api = msmTableFactory.get('table', {
          source: generate(55),
          onAction: function(data, event) {
            $log.debug("Action:", data);
          },
          onBeforeLoad: function(params) {
            $log.debug("Request:", params);
            return params;
          },
          onAfterLoad: function(data) {
            $log.debug("Response:", data);
            return data;
          },
          columns: [
            { key: 'id', name: 'id', show: false },
            { key: 'firstName', name: 'firstName', sticky: true, sort: false },
            { key: 'lastName', name: 'lastName', sticky: true },
            { key: 'age', name: 'age', template: '{{ row.age }} yrs' },
            { key: 'birthday', name: 'birthday', templateUrl: 'templates/cell.birthday.html' },
            { key: 'address', name: 'address', show: false },
            { key: 'city', name: 'city', show: false },
            { key: 'country', name: 'country', show: false },
            { key: 'phone', name: 'phone', show: false },
            { key: 'about', name: 'about', show: false }],
          mobileTemplateUrl: 'templates/row.mobile.html'
        });

        // ==========

        function generate(amount) {
          var result = [];
          for (var i = 0; i < amount; i++) {
            result.push({
              id: i + 1,
              firstName: chance.first(),
              lastName: chance.last(),
              age: chance.age(),
              birthday: chance.birthday(),
              address: chance.address(),
              city: chance.city(),
              country: chance.country({ full: true }),
              phone: chance.phone({ country: 'us' }),
              about: chance.paragraph({ sentences: 1 })
            });
          }
          return result;
        }
      });
})(angular);
