'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
  Project = db.project;

/**
 * Create a project
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;


  Project.create(req.body).then(function(project) {
    if (!project) {
      return res.send('users/signup', {
        errors: 'Could not create the project'
      });
    } else {
      return res.jsonp(project);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current project
 */
exports.read = function(req, res) {
  res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
  var project = req.project;
  var updatedAttr = _.clone(req.body);

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  project.updateAttributes(updatedAttr).then(function(project) {
    res.json(project);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
  var project = req.project;
  // Find the project
  Project.findById(project.id).then(function(project) {
    if (project) {
      project.update({deletedAt: Date.now()}).then(function() {
        return res.json(project);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the project'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Projects
 */
exports.list = function(req, res) {
  Project.findAll({
    include: []
  }).then(function(projects) {
    if (!projects) {
      return res.status(404).send({
        message: 'No project found'
      });
    } else {
      res.json(projects);
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

  Project.findAndCountAll({
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

  Project.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenProjects = function(req,res){
  var startWith = req.params.startWith;
  Project.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(projects){
      res.json(projects);
    }).catch(function(err){
      res.json([]);
    });
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Project is invalid'
    });
  }

  Project.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    }
  ]
}).then(function(project) {
    if (!project) {
      return res.status(404).send({
        message: 'No project with that identifier has been found'
      });
    } else {
      req.project = project;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
