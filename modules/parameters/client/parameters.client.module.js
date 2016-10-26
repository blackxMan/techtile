(function (app) {
  'use strict';

  app.registerModule('parameters', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('parameters.backoffice', ['core.admin','mdColorPicker']);
  app.registerModule('parameters.backoffice.routes', ['core.admin.routes']);
  app.registerModule('parameters.services');
  app.registerModule('parameters.routes', ['ui.router', 'core.routes', 'parameters.services']);
}(ApplicationConfiguration));
