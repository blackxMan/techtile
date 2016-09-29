(function (app) {
  'use strict';

  app.registerModule('interventionNatures', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('interventionNatures.admin', ['core.admin']);
  app.registerModule('interventionNatures.admin.routes', ['core.admin.routes']);
  app.registerModule('interventionNatures.services');
  app.registerModule('interventionNatures.routes', ['ui.router', 'core.routes', 'interventionNatures.services']);
}(ApplicationConfiguration));
