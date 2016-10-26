'use strict';

/**
 * Module dependencies
 */
var interventionsPolicy = require('../policies/interventions.server.policy'),
  interventions = require('../controllers/interventions.server.controller');

module.exports = function (app) {
  // Products collection routes
  app.route('/api/interventions').all(interventionsPolicy.isAllowed)
    .get(interventions.list)
    .post(interventions.create);

  // Single product routes
  app.route('/api/interventions/:interventionId').all(interventionsPolicy.isAllowed)
    .get(interventions.read)
    .put(interventions.update)
    .delete(interventions.delete);

  app.route('/api/ajax/interventions/delete/all').all(interventionsPolicy.isAllowed)
    .post(interventions.deleteAll);

  app.route('/api/ajax/interventions/startWith/:startWith').all(interventionsPolicy.isAllowed)
    .get(interventions.searchTokenInterventions);

  app.route('/api/ajax/prescriptions/startWith/:startWith').all(interventionsPolicy.isAllowed)
    .get(interventions.searchTokenInterventions);

  app.route('/api/lazy/interventions').all(interventionsPolicy.isAllowed)
    .get(interventions.lazy);

  // Finish by binding the product middleware
  app.param('interventionId', interventions.interventionByID);
};
