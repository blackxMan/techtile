'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Activity = db.activity;

/**
 * Create a activity
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;


  Activity.create(req.body).then(function(activity) {
    if (!activity) {
      return res.send('users/signup', {
        errors: 'Could not create the activity'
      });
    } else {
      return res.jsonp(activity);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current activity
 */
exports.read = function(req, res) {
  console.log('----------- > > > call here !!!');
  res.json(req.activity);
};

/**
 * Update a activity
 */
exports.update = function(req, res) {
  var activity = req.activity;

  activity.updateAttributes({
    name: req.body.name,
    description: req.body.description,

  }).then(function(activity) {
    res.json(activity);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an activity
 */
exports.delete = function(req, res) {
  var activity = req.activity;
  // Find the activity
  Activity.findById(activity.id).then(function(activity) {
    if (activity) {
      console.log(activity);
      // Delete the activity
      activity.destroy().then(function() {
        return res.json(activity);
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
 * List of Activities
 */
exports.list = function(req, res) {
  Activity.findAll({
    include: []
  }).then(function(activities) {
    if (!activities) {
      return res.status(404).send({
        message: 'No activity found'
      });
    } else {
      res.json(activities);
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

  Activity.findAndCountAll({
     order: column+' '+orderType,
     offset: offset,
     limit: limit,
     include:[{model: db.product, as: 'Product', attributes:['name']},{model: db.user, as: 'Manager', attributes:['displayName']}]
  })
  .then(function(result) {
    res.json(result);
  }).catch(function(err){
    console.log(err);
    if(err)
      res.json({count:0,rows:[]});
  });

};

exports.deleteAll

/**
 * Activity middleware
 */
exports.activityByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Activity is invalid'
    });
  }

  Activity.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(activity) {
    if (!activity) {
      return res.status(404).send({
        message: 'No activity with that identifier has been found'
      });
    } else {
      req.activity = activity;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
