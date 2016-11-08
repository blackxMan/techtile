(function (app) {
  'use strict';

  app.registerModule('projects', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('projects.backoffice', ['core.admin']);
  app.registerModule('projects.backoffice.routes', ['core.admin.routes']);
  app.registerModule('projects.services');
  app.registerModule('projects.routes', ['ui.router', 'core.routes', 'projects.services']);
}(ApplicationConfiguration));
