'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Products Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/interventions',
      permissions: '*'
    }, {
      resources: '/api/interventions/:interventionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/interventions',
      permissions: ['get']
    }, {
      resources: '/api/interventions/:interventionId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/interventions',
      permissions: ['get']
    }, {
      resources: '/api/interventions/:interventionId',
      permissions: ['get']
    }]
  },
  {
    roles: ['user','admin','guest'],
    allows: [{
      resources: '/api/lazy/interventions',
      permissions: ['get']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/api/ajax/interventions/delete/all',
      permissions: ['post']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/api/ajax/interventions/startWith/:startWith',
      permissions: ['get']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/api/ajax/prescriptions/startWith/:startWith',
      permissions: ['get']
    }]
  }
]);
};

/**
 * Check If Interventions Policy Allows
 */
exports.isAllowed = function (req, res, next) {

  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an product is being processed and the current user created it then allow any manipulation
  if (req.intervention && req.user && req.intervention.user && req.intervention.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
