(function() {
  'use strict';

  var moduleName = 'mindsmash-table';
  var targetName = 'msmTable';

  describe('service: ' + targetName, function() {
    var $rootScope, $q;
    var msmTableFactory,
        msmTable;

    beforeEach(module(moduleName));
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
        storage: false,
        columns: [
          { key: 'one', name: 'One' },
          { key: 'two', name: 'Two' }],
        source: function(params) {
          return $q(function(resolve, reject) {
            resolve({
              content: generate(55),
              number: params.page,
              numberOfElements: params.pageSize,
              size: params.pageSize,
              sort: params.orderBy,
              totalElements: 55,
              totalPages: 6
            });
          });
        }
      });

      apply(msmTable.reload());
    }));

    // ----------

    describe('Pagination', function() {
      it('should init with the first page', function() {
        expect(msmTable.getPage()).to.equal(0);
      });
      it('should set the page', function() {
        apply(msmTable.setPage(3));
        expect(msmTable.getPage()).to.equal(3);
      });
      it('should not set an invalid page', function() {
        apply(msmTable.setPage(-1));
        expect(msmTable.getPage()).to.equal(0);
        apply(msmTable.setPage(6));
        expect(msmTable.getPage()).to.equal(5);
      });
      it('should move to the first page', function() {
        apply(msmTable.firstPage());
        expect(msmTable.getPage()).to.equal(0);
      });
      it('should move to the previous page', function() {
        apply(msmTable.setPage(3));
        apply(msmTable.previousPage());
        expect(msmTable.getPage()).to.equal(2);
      });
      it('should not move to the page preceeding the first page', function() {
        apply(msmTable.firstPage());
        apply(msmTable.previousPage());
        expect(msmTable.getPage()).to.equal(0);
      });
      it('should move to the next page', function() {
        apply(msmTable.setPage(3));
        apply(msmTable.nextPage());
        expect(msmTable.getPage()).to.equal(4);
      });
      it('should not move to the page succeeding the last page', function() {
        apply(msmTable.lastPage());
        apply(msmTable.nextPage());
        expect(msmTable.getPage()).to.equal(5);
      });
      it('should move to the last page', function() {
        apply(msmTable.lastPage());
        expect(msmTable.getPage()).to.equal(5);
      });
    });

    // ----------

    describe('Pagination Size', function() {
      it('should init with the first page size', function() {
        expect(msmTable.getPageSize()).to.equal(10);
      });
      it('should set the page size', function() {
        apply(msmTable.setPageSize(25));
        expect(msmTable.getPageSize()).to.equal(25);
      });
      it('should not set an invalid page size', function() {
        apply(msmTable.setPageSize(-10));
        expect(msmTable.getPageSize()).to.equal(1);
      });
    });

    // ----------

    describe('Sorting', function() {
      it('should not have an initial sort order', function() {
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should set the sort order correctly: ()', function() {
        apply(msmTable.setOrderBy());
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should set the sort order correctly: ("one")', function() {
        apply(msmTable.setOrderBy('one'));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should set the sort order correctly: ("one", false)', function() {
        apply(msmTable.setOrderBy('one', false));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });
      it('should toggle the sort order correctly: -> ("one")', function() {
        apply(msmTable.setOrderBy('one'));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should toggle the sort order correctly: ("one", true) -> ("one")', function() {
        apply(msmTable.setOrderBy('one', true));
        apply(msmTable.setOrderBy('one'));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });
      it('should toggle the sort order correctly: ("one", false) -> ("one")', function() {
        apply(msmTable.setOrderBy('one', false));
        apply(msmTable.setOrderBy('one'));
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should overwrite the sort order correctly: ("one") -> ("one", false)', function() {
        apply(msmTable.setOrderBy('one', false));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: false });
      });
      it('should overwrite the sort order correctly: ("one", false) -> ("one", true)', function() {
        apply(msmTable.setOrderBy('one', false));
        apply(msmTable.setOrderBy('one', true));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'one', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two")', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy('two'));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two", true)', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy('two', true));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: true });
      });
      it('should overwrite the sort order correctly: ("one") -> ("two", false)', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy('two', false));
        expect(msmTable.getOrderBy()).to.deep.equal({ key: 'two', asc: false });
      });
      it('should delete the sort order correctly: ("one") -> ()', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy());
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should delete the sort order correctly: ("one") -> (null)', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy(null));
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should delete the sort order correctly: ("one") -> ("one", null)', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.setOrderBy('one', null));
        expect(msmTable.getOrderBy()).to.be.null;
      });
      it('should clear the sort order', function() {
        apply(msmTable.setOrderBy('one'));
        apply(msmTable.clearOrderBy());
        expect(msmTable.getOrderBy()).to.be.null;
      });
    });

    // ----------

    describe('Active Row', function() {
      it('should init with the no active row', function() {
        expect(msmTable.getActive()).to.equal(null);
      });
      it('should set the active row', function() {
        apply(msmTable.setActive(1));
        expect(msmTable.getActive()).to.equal(1);
      });
      it('should not set an invalid active row', function() {
        apply(msmTable.setActive(-1));
        expect(msmTable.getActive()).to.equal(0);
        apply(msmTable.lastPage());
        expect(msmTable.getPage()).to.equal(5);
        apply(msmTable.setActive(7));
        expect(msmTable.getActive()).to.equal(4);
      });
      it('should move to the first row', function() {
        apply(msmTable.firstActive());
        expect(msmTable.getActive()).to.equal(0);
      });
      it('should move to the previous row', function() {
        apply(msmTable.setActive(3));
        apply(msmTable.previousActive());
        expect(msmTable.getActive()).to.equal(2);
      });
      it('should move to the previous row on another page', function() {
        apply(msmTable.setPage(2));
        apply(msmTable.setActive(0));
        apply(msmTable.previousActive());
        expect(msmTable.getPage()).to.equal(1);
        expect(msmTable.getActive()).to.equal(9);
      });
      it('should not move to the previous row on the first page', function() {
        apply(msmTable.setActive(0));
        apply(msmTable.previousActive());
        expect(msmTable.getPage()).to.equal(0);
        expect(msmTable.getActive()).to.equal(0);
      });
      it('should move to the next row', function() {
        apply(msmTable.setActive(3));
        apply(msmTable.nextActive());
        expect(msmTable.getActive()).to.equal(4);
      });
      it('should move to the next row on another page', function() {
        apply(msmTable.setPage(2));
        apply(msmTable.setActive(9));
        apply(msmTable.nextActive());
        expect(msmTable.getPage()).to.equal(3);
        expect(msmTable.getActive()).to.equal(0);
      });
      it('should not move to the next row on the last page', function() {
        apply(msmTable.setPage(5));
        apply(msmTable.setActive(4));
        apply(msmTable.nextActive());
        expect(msmTable.getPage()).to.equal(5);
        expect(msmTable.getActive()).to.equal(4);
      });
      it('should move to the last row', function() {
        apply(msmTable.lastActive());
        expect(msmTable.getActive()).to.equal(9);
      });
      it('should move to the last row on the last page', function() {
        apply(msmTable.lastPage());
        apply(msmTable.lastActive());
        expect(msmTable.getActive()).to.equal(4);
      });
      it('should satisfy boundaries after page change', function() {
        apply(msmTable.setActive(9));
        apply(msmTable.lastPage());
        expect(msmTable.getActive()).to.equal(4);
      });
      it('should clear the active row', function() {
        apply(msmTable.setActive(5));
        apply(msmTable.clearActive());
        expect(msmTable.getActive()).to.be.null;
      });
    });

    // ----------

    function generate(amount) {
      var result = [];
      for (var i = 0; i < amount; i++) {
        result.push({ id: i, one: 'one.' + i, two: 'two.' + i });
      }
      return result;
    }

    function apply(value) {
      $rootScope.$apply();
    }
  });
})();
