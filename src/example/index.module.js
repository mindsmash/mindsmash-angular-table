(function(angular) {
  'use strict';

  angular.module('app', [
        'mindsmash-table'
      ])

      .run()

      .controller('AppController', function($filter, $q, $timeout, msmTableFactory) {
        var vm = this;

        vm.api = msmTableFactory.get('table', {
          source: source,
          columns: [
            { key: 'id', name: 'ID' },
            { key: 'firstName', name: 'First Name' },
            { key: 'lastName', name: 'Last Name' },
            { key: 'age', name: 'Age' },
            { key: 'birthday', name: 'Birthday', template: '{{ row.birthday | date }}' }
            /* { key: 'address', name: 'Address' },
             { key: 'city', name: 'City' },
             { key: 'country', name: 'Country' },
             { key: 'phone', name: 'Phone' },
             { key: 'about', name: 'About' }*/]
        });
        vm.api.reload();

        // ==========

        var data = generate(55);
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