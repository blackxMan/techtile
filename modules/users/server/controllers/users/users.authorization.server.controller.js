'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!id) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }
  User.findOne({
    where: {
      id: id
    }
  }).then(function(user) {
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};
