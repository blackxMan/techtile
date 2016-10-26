'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Intervention = db.intervention;

/**
 * Create a intervention
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;


  Intervention.create(req.body).then(function(intervention) {
    if (!intervention) {
      return res.send('users/signup', {
        errors: 'Could not create the intervention'
      });
    } else {
      return res.jsonp(intervention);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current intervention
 */
exports.read = function(req, res) {
  res.json(req.intervention);
};

/**
 * Update a intervention
 */
exports.update = function(req, res) {
  var intervention = req.intervention;

  intervention.updateAttributes({
    name: req.body.name,
    description: req.body.description,
    startAt: req.body.startAt,
    endAt: req.body.endAt,
    paramsValue: req.body.paramsValue,
    prescriptionId: req.body.prescriptionId,
    prescriptionNature: req.body.prescriptionNature,
  }).then(function(intervention) {
    res.json(intervention);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an intervention
 */
exports.delete = function(req, res) {
  var intervention = req.intervention;
  // Find the intervention
  Intervention.findById(intervention.id).then(function(intervention) {
    if (intervention) {
      // Delete the intervention
      intervention.destroy().then(function() {
        return res.json(intervention);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the intervention'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Interventions
 */
exports.list = function(req, res) {
  Intervention.findAll({
    include: [db.user]
  }).then(function(interventions) {
    if (!interventions) {
      return res.status(404).send({
        message: 'No product found'
      });
    } else {
      res.json(interventions);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Intervention middleware
 */
exports.interventionByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Intervention is invalid'
    });
  }

  Intervention.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(intervention) {
    if (!intervention) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    } else {
      req.intervention = intervention;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
