'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
  Product = db.product;

/**
 * Create a activity
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  Product.create(req.body).then(function(product) {
    if (!product) {
      return res.send('users/signup', {
        errors: 'Could not create the product'
      });
    } else {
      return res.jsonp(product);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current product
 */
exports.read = function(req, res) {
  res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function(req, res) {
  var product = req.product;
  console.log('-----------> Before req:');
  console.log(JSON.stringify(product));
  var updatedAttr = _.clone(req.body);

  console.log('-----------> after req:');
  console.log(JSON.stringify(updatedAttr));

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  product.updateAttributes(updatedAttr).then(function(product) {
    res.json(product);
  }).catch(function(err) {
    console.log(JSON.stringify(err));
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an product
 */
exports.delete = function(req, res) {
  var product = req.product;
  // Find the product
  Product.findById(product.id).then(function(product) {
    if (product) {
      product.update({deletedAt: Date.now()}).then(function() {
        return res.json(product);
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
 * List of Products
 */
exports.list = function(req, res) {
  Product.findAll({
    include: []
  }).then(function(products) {
    if (!products) {
      return res.status(404).send({
        message: 'No product found'
      });
    } else {
      res.json(products);
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

  Product.findAndCountAll({
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

  Product.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenProducts = function(req,res){
  var startWith = req.params.startWith;
  Product.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(products){
      res.json(products);
    }).catch(function(err){
      res.json([]);
    });
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Product is invalid'
    });
  }

  Product.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    }
  ]
}).then(function(product) {
    if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    } else {
      req.product = product;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
