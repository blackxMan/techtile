'use strict';

/**
 * Module dependencies
 */
var activitiesPolicy = require('../policies/activities.server.policy'),
  activities = require('../controllers/activities.server.controller');

module.exports = function (app) {
  // Activities collection routes
  app.route('/api/activities').all(activitiesPolicy.isAllowed)
    .get(activities.list)
    .post(activities.create);

  // Single activity routes
  app.route('/api/activities/:activityId').all(activitiesPolicy.isAllowed)
    .get(activities.read)
    .put(activities.update)
    .delete(activities.delete);

  app.route('/api/ajax/activities/delete/all').all(activitiesPolicy.isAllowed)
    .post(activities.deleteAll);

  app.route('/api/ajax/activities/startWith/:startWith').all(activitiesPolicy.isAllowed)
    .get(activities.searchTokenActivities);

  app.route('/api/lazy/activities').all(activitiesPolicy.isAllowed)
    .get(activities.lazy);

  // Finish by binding the activity middleware
  app.param('activityId', activities.activityByID);
};
