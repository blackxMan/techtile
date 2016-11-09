'use strict';

/**
 * Module dependencies
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function (app) {
  // Projects collection routes
  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projects.create);

  // Single project routes
  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  app.route('/api/ajax/projects/delete/all').all(projectsPolicy.isAllowed)
    .post(projects.deleteAll);

  app.route('/api/ajax/projects/startWith/:startWith').all(projectsPolicy.isAllowed)
    .get(projects.searchTokenProjects);

  app.route('/api/lazy/projects').all(projectsPolicy.isAllowed)
    .get(projects.lazy);

  // Finish by binding the project middleware
  app.param('projectId', projects.projectByID);
};
