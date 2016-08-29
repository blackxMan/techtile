'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user,
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findById(id).then(function(user) {
      if(user)
        done(null,user);
      else {
        done({err:'cant fetch user'},user)
      }
    })
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
