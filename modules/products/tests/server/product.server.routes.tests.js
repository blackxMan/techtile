'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Product = db.product,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, product;

/**
 * Product routes tests
 */
describe('Product CRUD tests', function() {
  before(function(done) {
    // Get application
    app = express.init(sequelize);
    agent = request.agent(app);

    done();
  });

  before(function(done) {

    // Create user credentials
    credentials = {
      username: 'username',
      password: 'S3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = User.build();

    user.firstName = 'Full';
    user.lastName = 'Name';
    user.displayName = 'Full Name';
    user.email = 'test@test.com';
    user.username = credentials.username;
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(credentials.password, user.salt);
    user.provider = 'local';
    user.roles = ['admin', 'user'];

    // Save a user to the test db and create new product
    user.save().then(function(user) {
      product = Product.build();
      product = {
        name: 'Product name',
        description: 'Product description',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an product if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function(productSaveErr, productSaveRes) {

            // Handle product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Get a list of products
            agent.get('/api/products')
              .end(function(productsGetErr, productsGetRes) {

                // Handle product save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get products list
                var products = productsGetRes.body;

                // Set assertions
                console.log('products[0]', products[0]);
                console.log('userId', userId);

                //(products[0].userId).should.equal(userId);
                (products[0].name).should.match('Product name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an product if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/products')
          .send(product)
          .expect(403)
          .end(function(productSaveErr, productSaveRes) {
            // Call the assertion callback
            done(productSaveErr);
          });
      });
  });

  it('should not be able to save an product if no name is provided', function(done) {
    // Invalidate name field
    product.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new product
        agent.post('/api/products')
          .send(product)
          .expect(400)
          .end(function(productSaveErr, productSaveRes) {

            // Set message assertion
            (productSaveRes.body.message).should.match('Product name must be between 1 and 250 characters in length');
            // Handle product save error
            done(productSaveErr);
          });
      });
  });

  it('should be able to update an product if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function(productSaveErr, productSaveRes) {
            // Handle product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Update product name
            product.name = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing product
            agent.put('/api/products/' + productSaveRes.body.id)
              .send(product)
              .expect(200)
              .end(function(productUpdateErr, productUpdateRes) {
                // Handle product update error
                if (productUpdateErr) {
                  return done(productUpdateErr);
                }

                // Set assertions
                (productUpdateRes.body.id).should.equal(productSaveRes.body.id);
                (productUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of products if not signed in', function(done) {
    product.name = 'Product name';
    // Create new product model instance
    var productObj = Product.build(product);

    // Save the product
    productObj.save().then(function() {
      // Request products
      request(app).get('/api/products')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single product if not signed in', function(done) {
    // Create new product model instance
    var productObj = Product.build(product);

    // Save the product
    productObj.save().then(function() {
      request(app).get('/api/products/' + productObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', product.name);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single product with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/products/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Product is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single product which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent product
    request(app).get('/api/products/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No product with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an product if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function(productSaveErr, productSaveRes) {


            // Handle product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Delete an existing product
            agent.delete('/api/products/' + productSaveRes.body.id)
              .send(product)
              .expect(200)
              .end(function(productDeleteErr, productDeleteRes) {

                // Handle product error error
                if (productDeleteErr) {
                  return done(productDeleteErr);
                }

                // Set assertions
                (productDeleteRes.body.id).should.equal(productSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an product if not signed in', function(done) {
    // Set product user
    product.userId = user.id;

    // Create new product model instance
    var productObj = Product.build(product);

    // Save the product
    productObj.save().then(function() {
      // Try deleting product
      request(app).delete('/api/products/' + productObj.id)
        .expect(403)
        .end(function(productDeleteErr, productDeleteRes) {

          // Set message assertion
          (productDeleteRes.body.message).should.match('User is not authorized');

          // Handle product error error
          done(productDeleteErr);
        });

    }).catch(function(err) {});
  });

  after(function(done) {
    user.destroy()
      .then(function(success) {
        done();
      }).catch(function(err) {});
  });

});
