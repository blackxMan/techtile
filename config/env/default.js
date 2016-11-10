'use strict';

module.exports = {
  app: {
    title: 'SEAN.JS',
    description: 'Full-Stack JavaScript with Sequelize, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, Sequelize, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'SEAN',
  // sessionKey is the cookie session name
  sessionKey: 'SMARTJSId',
  sessionCollection: 'sessions',

  jwtTokenSecret: 'b3fc1aedb94bc31469fac62e9e2938b94c978d32',
  // supported algo HS256, HS384, HS512 and RS256
  jwtHashMethod: 'HS512',
  jwtExpireTime: '8 hours, 30 minutes',
  jwtTokenName: 'token',
  jwtTokenSigninPath: '/api/security/auth/signin',
  maxTimePasswordReset: '1 hours',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './modules/users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
