'use strict';

/**
 * Module dependencies
 */
var interventionsPolicy = require('../policies/interventions.server.policy'),
  interventions = require('../controllers/interventions.server.controller');

module.exports = function (app) {
  // Interventions collection routes
  app.route('/api/interventions').all(interventionsPolicy.isAllowed)
    .get(interventions.list)
    .post(interventions.create);

  // Single intervention routes
  app.route('/api/interventions/:interventionId').all(interventionsPolicy.isAllowed)
    .get(interventions.read)
    .put(interventions.update)
    .delete(interventions.delete);

  // Finish by binding the intervention middleware
  app.param('interventionId', interventions.interventionByID);
};
