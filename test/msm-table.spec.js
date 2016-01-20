(function() {
  'use strict';

  var moduleName = 'mindsmash-table';
  var targetName = 'msmTableFactory';

  describe('service: ' + targetName, function() {
    var $rootScope, $q;
    var msmTableFactory,
        msmTable;

    beforeEach(module('mindsmash-table'));
    //beforeEach(module(moduleName, function($provide) {
    //  //$window = {localStorage: {}, sessionStorage/*: {}};
    //  //$provide.value('$window', $window);
    //  //$provide.value('$modal', {});
    //  //$provide.value('userModel', {});*/
    //}));

    beforeEach(inject(function(_msmTableFactory_, _$rootScope_, _$q_) {
      $rootScope = _$rootScope_;
      $q = _$q_;
      msmTableFactory = _msmTableFactory_;
      msmTable = msmTableFactory.get('table', {
        columns: [
          { key: 'one', name: 'One' },
          { key: 'two', name: 'Two' }],
        source: function(params) {
          return $q(function(resolve, reject) {
            resolve({
              content: 0,
              number: params.page,
              numberOfElements: 0,
              size: params.pageSize,
              sort: params.orderBy,
              totalElements: 0,
              totalPages: 0
            });
          });
        }
      });
    }));

    describe('Sorting', function() {

      it('should not have an initial sort order', function() {
        expect(msmTable.getOrderBy()).to.be.null;
      });

      it('should set the sort order correctly: ()', function() {
        msmTable.setOrderBy();
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should set the sort order correctly: ("one")', function() {
        msmTable.setOrderBy('one');
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should set the sort order correctly: ("one", false)', function() {
        msmTable.setOrderBy('one', false);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });

      it('should toggle the sort order correctly: -> ("one")', function() {
        msmTable.setOrderBy('one');
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should toggle the sort order correctly: ("one", true) -> ("one")', function() {
        msmTable.setOrderBy('one', true);
        msmTable.setOrderBy('one');
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });
      it('should toggle the sort order correctly: ("one", false) -> ("one")', function() {
        msmTable.setOrderBy('one', false);
        msmTable.setOrderBy('one');
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.be.null;
      });

      it('should overwrite the sort order correctly: ("one") -> ("one", false)', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy('one', false);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });
      it('should overwrite the sort order correctly: ("one", false) -> ("one", true)', function() {
        msmTable.setOrderBy('one', false);
        msmTable.setOrderBy('one', true);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two")', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy('two');
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two", true)', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy('two', true);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two", false)', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy('two', false);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: false });
      });

      it('should delete the sort order correctly: ("one") -> ()', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy();
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should delete the sort order correctly: ("one") -> (null)', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy(null);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should delete the sort order correctly: ("one") -> ("one", null)', function() {
        msmTable.setOrderBy('one');
        msmTable.setOrderBy('one', null);
        $rootScope.$apply();
        expect(msmTable.getOrderBy()).to.be.null;
      });
    });
  });

})();