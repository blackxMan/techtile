'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
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
  var updatedAttr = _.clone(req.body);

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  intervention.updateAttributes(updatedAttr).then(function(intervention) {
    res.json(intervention);
  }).catch(function(err) {
    console.log(JSON.stringify(err));
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
      product.update({deletedAt: Date.now()}).then(function() {
        return res.json(intervention);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the activity'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of interventions
 */
exports.list = function(req, res) {
  Intervention.findAll({
    include: []
  }).then(function(interventions) {
    if (!interventions) {
      return res.status(404).send({
        message: 'No product found'
      });
    } else {
      res.json(interventions);
    }
  })
  .catch(function(err) {
    res.status(404).send({message:'Error fetching data'});
  });
};

/**
* lazy load from client
*/
exports.lazy= function(req,res){
  var limit= req.query.limit;
  var offset= (req.query.page-1)*limit;
  var column = req.query.order;
  var orderType='ASC';

  if(column.indexOf('-') != -1){
    orderType= 'DESC';
    column= column.replace('-','');
  }

  Intervention.findAndCountAll({
     order: column+' '+orderType,
     offset: offset,
     limit: limit,
     where:{deletedAt:{$eq: null}},
     include:[]
  })
  .then(function(result) {
    res.json(result);
  }).catch(function(err){
    console.log(err);
    if(err)
      res.json({count:0,rows:[]});
  });

};

/**
* delete all item
*/
exports.deleteAll= function(req,res){
  var itemsToDelete= req.body.itemsToDelete;

  Intervention.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenInterventions = function(req,res){
  var startWith = req.params.startWith;
  Intervention.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(interventions){
      res.json(interventions);
    }).catch(function(err){
      res.json([]);
    });
};

exports.searchTokenPrescriptions = function(req,res){
  // var startWith = req.params.startWith;
  // Intervention.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
  //   .then(function(interventions){
  //     res.json(interventions);
  //   }).catch(function(err){
  //     res.json([]);
  //   });
  res.json([
    {id: 1,name: 'Observation 1'},
    {id: 2,name: 'Observation 2'},
    {id: 3,name: 'Observation 3'},
    {id: 4,name: 'Observation 4'}
  ]);
};

/**
 * Intervention middleware
 */
exports.interventionByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Product is invalid'
    });
  }

  Intervention.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    }
  ]
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
