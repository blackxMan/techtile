'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Product = db.product;

/**
 * Create a product
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
  console.log('----------- > > > call here !!!');
  res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function(req, res) {
  var product = req.product;

  product.updateAttributes({
    name: req.body.name,
    description: req.body.description,
    picture: req.body.picture,
    bornAt: req.body.bornAt,
    deathAt: req.body.deathAt,
    geo: req.body.geo,
    maxWeight: req.body.maxWeight,
    minWeight: req.body.minWeight,
    maxHeight: req.body.maxHeight,
    minHeight: req.body.minHeight,
    heightMeasureUnit: req.body.heightMeasureUnit,
    heightMeasureValue: req.body.heightMeasureValue,
    weightMeasureValue: req.body.weightMeasureUnit,
    weightMeasureUnit: req.body.weightMeasureUnit,
    plantDensityWeightUnit: req.body.plantDensityWeightUnit,
    plantDensityWeightValue: req.body.plantDensityWeightValue,
    plantDensitySurfaceUnit: req.body.plantDensitySurfaceUnit,
    plantDensitySurfaceValue: req.body.plantDensitySurfaceValue,
  }).then(function(product) {
    res.json(product);
  }).catch(function(err) {
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
  console.log('delete --------------- product : ');
  console.log(product);
  // Find the product
  Product.findById(product.id).then(function(product) {
    if (product) {
      console.log('product exist ----------->>>> ');
      console.log(product);
      // Delete the product
      product.destroy().then(function() {
        console.log('destory!!!!!!!------------');
        return res.json(product);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the product'
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
    include: [db.user]
  }).then(function(products) {
    if (!products) {
      return res.status(404).send({
        message: 'No product found'
      });
    } else {
      res.json(products);
    }
  }).catch(function(err) {
    res.jsonp(err);
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
      model: db.user
    }]
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
