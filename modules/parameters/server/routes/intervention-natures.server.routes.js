'use strict';

/**
 * Module dependencies
 */
var interventionNaturesPolicy = require('../policies/intervention-natures.server.policy'),
  interventionNatures = require('../controllers/intervention-natures.server.controller');

module.exports = function (app) {
  // InterventionNatures collection routes
  app.route('/api/intervention-natures').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.list)
    .post(interventionNatures.create);

  // Single product routes
  app.route('/api/intervention-natures/:interventionNatureId').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.read)
    .put(interventionNatures.update)
    .delete(interventionNatures.delete);

  app.route('/api/ajax/intervention-natures/delete/all').all(interventionNaturesPolicy.isAllowed)
    .post(interventionNatures.deleteAll);

  app.route('/api/ajax/intervention-natures/startWith/:startWith').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.searchTokenInterventionNatures);


  app.route('/api/lazy/intervention-natures').all(interventionNaturesPolicy.isAllowed)
    .get(interventionNatures.lazy);

  // Finish by binding the interventionNature middleware
  app.param('interventionNatureId', interventionNatures.interventionNatureByID);
};
