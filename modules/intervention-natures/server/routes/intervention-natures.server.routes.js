'use strict';

/**
 * Module dependencies
 */
var interventionNaturesPolicy = require('../policies/intervention-natures.server.policy'),
  interventionNatures = require('../controllers/intervention-natures.server.controller');

module.exports = function (app) {
  // Interventions collection routes
  app.route('/api/intervention-natures').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.list)
    .post(interventionNatures.create);

  // Single intervention routes
  app.route('/api/interventionNatures/:interventionNatureId').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.read)
    .put(interventionNatures.update)
    .delete(interventionNatures.delete);

  // Finish by binding the interventionNature middleware
  app.param('interventionNatureId', interventionNatures.interventionNatureByID);
};
