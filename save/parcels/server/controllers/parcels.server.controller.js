'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Parcel = db.parcel;

/**
 * Create a parcel
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  console.log('parcel data : ');
  console.log(req.body);

  Parcel.create(req.body).then(function(parcel) {
    if (!parcel) {
      return res.send('users/signup', {
        errors: 'Could not create the parcel'
      });
    } else {
      return res.jsonp(parcel);
    }
  }).catch(function(err) {
    console.log('----------------------- err : ');
    console.log(err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current parcel
 */
exports.read = function(req, res) {
  res.json(req.parcel);
};

/**
 * Update a parcel
 */
exports.update = function(req, res) {
  var parcel = req.parcel;

  parcel.updateAttributes({
    name: req.body.name,
    description: req.body.description,
    bornAt: req.body.bornAt,
    deathAt: req.body.deathAt,
    geo: req.body.geo,
    shapeForm: req.body.shapeForm,
    color: req.body.color,
    state: req.body.state,
    surfaceUnit: req.body.surfaceUnit,
    surfaceValue: req.body.surfaceValue,
  }).then(function(parcel) {
    res.json(parcel);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an parcel
 */
exports.delete = function(req, res) {
  var parcel = req.parcel;

  // Find the parcel
  Parcel.findById(parcel.id).then(function(parcel) {
    if (parcel) {

      // Delete the parcel
      parcel.destroy().then(function() {
        return res.json(parcel);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the parcel'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Parcels
 */
exports.list = function(req, res) {
  Parcel.findAll({
    include: [db.user]
  }).then(function(parcels) {
    if (!parcels) {
      return res.status(404).send({
        message: 'No parcel found'
      });
    } else {
      res.json(parcels);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Parcel middleware
 */
exports.parcelByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Parcel is invalid'
    });
  }

  Parcel.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(parcel) {
    if (!parcel) {
      return res.status(404).send({
        message: 'No parcel with that identifier has been found'
      });
    } else {
      req.parcel = parcel;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
