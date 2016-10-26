(function (app) {
  'use strict';

  app.registerModule('interventions', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('interventions.backoffice', ['core.admin','mdColorPicker']);
  app.registerModule('interventions.backoffice.routes', ['core.admin.routes']);
  app.registerModule('interventions.services');
  app.registerModule('interventions.routes', ['ui.router', 'core.routes', 'interventions.services']);
}(ApplicationConfiguration));
