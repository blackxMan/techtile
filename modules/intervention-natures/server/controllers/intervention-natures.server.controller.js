'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  InterventionNature = db.interventionNature;

/**
 * Create a interventionNature
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;


  InterventionNature.create(req.body).then(function(interventionNature) {
    if (!interventionNature) {
      return res.send('users/signup', {
        errors: 'Could not create the interventionNature'
      });
    } else {
      return res.jsonp(interventionNature);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current interventionNature
 */
exports.read = function(req, res) {
  res.json(req.interventionNature);
};

/**
 * Update a interventionNature
 */
exports.update = function(req, res) {
  var interventionNature = req.interventionNature;

  interventionNature.updateAttributes({
    name: req.body.name,
    description: req.body.description,
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    paramsValue: req.body.paramsValue,
    prescriptionId: req.body.prescriptionId,
    prescriptionNature: req.body.prescriptionNature,
  }).then(function(interventionNature) {
    res.json(interventionNature);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an interventionNature
 */
exports.delete = function(req, res) {
  var interventionNature = req.interventionNature;
  // Find the interventionNature
  InterventionNature.findById(interventionNature.id).then(function(interventionNature) {
    if (interventionNature) {
      // Delete the interventionNature
      interventionNature.destroy().then(function() {
        return res.json(interventionNature);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the interventionNature'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of InterventionNatures
 */
exports.list = function(req, res) {
  InterventionNature.findAll({
    include: [db.user]
  }).then(function(interventionNatures) {
    if (!interventionNatures) {
      return res.status(404).send({
        message: 'No interventionNature found'
      });
    } else {
      res.json(interventionNatures);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * InterventionNature middleware
 */
exports.interventionNatureByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'InterventionNature is invalid'
    });
  }

  InterventionNature.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(interventionNature) {
    if (!interventionNature) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    } else {
      req.interventionNature = interventionNature;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
