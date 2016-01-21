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

      .controller('AppController', function($filter, $q, $timeout, msmTableFactory) {
        var vm = this;

        vm.api = msmTableFactory.get('table', {
          source: source,
          columns: [
            { key: 'id', name: 'id', isHidden: true },
            { key: 'firstName', name: 'firstName', isSticky: true, isSortable: false },
            { key: 'lastName', name: 'lastName', isSticky: true },
            { key: 'age', name: 'age', template: '{{ row.age }} yrs' },
            { key: 'birthday', name: 'birthday', templateUrl: 'templates/cell.birthday.html' },
            { key: 'address', name: 'address', isHidden: true },
            { key: 'city', name: 'city', isHidden: true },
            { key: 'country', name: 'country', isHidden: true },
            { key: 'phone', name: 'phone', isHidden: true },
            { key: 'about', name: 'about', isHidden: true }]
        });
        vm.api.reload();

        // ==========

        var data = generate(155);
        var sort = $filter('orderBy');

        function source(params) {
          console.log('Requesting with params', params);
          return $q(function(resolve, reject) {
            $timeout(function() {
              var from = params.page * params.pageSize;
              var to = from + params.pageSize;
              var items = params.orderBy ? sort(data, params.orderBy, !params.orderAsc) : data;
              items = items.slice(from, to);
              resolve({
                content: items,
                number: params.page,
                numberOfElements: items.length,
                size: params.pageSize,
                sort: params.orderBy,
                totalElements: data.length,
                totalPages: Math.ceil(data.length / params.pageSize)
              });
            }, 100);
          });
        }

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