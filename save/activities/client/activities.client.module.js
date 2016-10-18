(function (app) {
  'use strict';

  app.registerModule('activities', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('activities.admin', ['core.admin']);
  app.registerModule('activities.admin.routes', ['core.admin.routes']);
  app.registerModule('activities.services');
  app.registerModule('activities.routes', ['ui.router', 'core.routes', 'activities.services']);
}(ApplicationConfiguration));
