'use strict';

/**
 * Module dependencies.
 */
var
  path = require('path'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  TokenAuthentication = require(path.resolve('./config/lib/token-authentication')),
  jwt = require('jwt-simple'),
  db = require(path.resolve('./config/lib/sequelize')).models,
  winston= require('winston'),
  User = db.user;

module.exports = function() {
  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      console.log('username: '+username+' password: '+password);
      User.findAll().then(function(users){
        //console.log(JSON.stringify(users));
      });
      User.findOne({
        where: {
          email: username.toLowerCase()
        }
      }).then(function(user) {
        if (!user) {
          winston.info('Invalid credentils');
          return done('Invalid credentials', null, null);
        }
        if (!user || !user.authenticate(password)) {
          winston.info('Invalid credentils');
          return done('Invalid credentials', null, null);
        }

        // Token Expire time
        var expireTime = TokenAuthentication.getExpireTokenTime();

        //Generate token
        var tokenPayload = {
          username: user.username,
          expires: expireTime
        };

        var token = jwt.encode(tokenPayload,TokenAuthentication.getJWTokenSecret(),TokenAuthentication.getJWTHashMethod());

        // add Token and expireTime to user object
        user.token = token;
        user.expires = expireTime;


        user.save().then(function(user){

          winston.info('User Authenticated succesfully!!');
          return done(null, user, null);

        }).catch(function(err){

          winston.info('Error saving token : '+err);
          return done('Can\'t generate token');

        });

      });
    }
  ));
};
