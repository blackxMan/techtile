'use strict';

describe('Interventions E2E Tests:', function () {
  describe('Test Interventions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/interventions');
      expect(element.all(by.repeater('intervention in interventions')).count()).toEqual(0);
    });
  });
});
