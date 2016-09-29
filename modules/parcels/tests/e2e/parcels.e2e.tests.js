'use strict';

describe('Parcels E2E Tests:', function () {
  describe('Test parcels page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/parcels');
      expect(element.all(by.repeater('parcel in parcels')).count()).toEqual(0);
    });
  });
});
