'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products collection routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  // Single product routes
  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/ajax/products/delete/all').all(productsPolicy.isAllowed)
    .post(products.deleteAll);

  app.route('/api/ajax/products/startWith/:startWith').all(productsPolicy.isAllowed)
    .get(products.searchTokenProducts);


  app.route('/api/lazy/products').all(productsPolicy.isAllowed)
    .get(products.lazy);

  // Finish by binding the product middleware
  app.param('productId', products.productByID);
};
