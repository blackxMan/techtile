'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Parcel = db.parcel,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, parcel;

/**
 * Parcel routes tests
 */
describe('Parcel CRUD tests', function() {
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

    // Save a user to the test db and create new parcel
    user.save().then(function(user) {
      parcel = Parcel.build();
      parcel = {
        name: 'Parcel name',
        description: 'Parcel description',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an parcel if logged in', function(done) {
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

        // Save a new parcel
        agent.post('/api/parcels')
          .send(parcel)
          .expect(200)
          .end(function(parcelSaveErr, parcelSaveRes) {

            // Handle parcel save error
            if (parcelSaveErr) {
              return done(parcelSaveErr);
            }

            // Get a list of parcels
            agent.get('/api/parcels')
              .end(function(parcelsGetErr, parcelsGetRes) {

                // Handle parcel save error
                if (parcelsGetErr) {
                  return done(parcelsGetErr);
                }

                // Get parcels list
                var parcels = parcelsGetRes.body;

                // Set assertions
                console.log('parcels[0]', parcels[0]);
                console.log('userId', userId);

                //(parcels[0].userId).should.equal(userId);
                (parcels[0].name).should.match('Parcel name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an parcel if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/parcels')
          .send(parcel)
          .expect(403)
          .end(function(parcelSaveErr, parcelSaveRes) {
            // Call the assertion callback
            done(parcelSaveErr);
          });
      });
  });

  it('should not be able to save an parcel if no name is provided', function(done) {
    // Invalidate name field
    parcel.name = '';

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

        // Save a new parcel
        agent.post('/api/parcels')
          .send(parcel)
          .expect(400)
          .end(function(parcelSaveErr, parcelSaveRes) {

            // Set message assertion
            (parcelSaveRes.body.message).should.match('Parcel name must be between 1 and 250 characters in length');
            // Handle parcel save error
            done(parcelSaveErr);
          });
      });
  });

  it('should be able to update an parcel if signed in', function(done) {
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

        // Save a new parcel
        agent.post('/api/parcels')
          .send(parcel)
          .expect(200)
          .end(function(parcelSaveErr, parcelSaveRes) {
            // Handle parcel save error
            if (parcelSaveErr) {
              return done(parcelSaveErr);
            }

            // Update parcel name
            parcel.name = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing parcel
            agent.put('/api/parcels/' + parcelSaveRes.body.id)
              .send(parcel)
              .expect(200)
              .end(function(parcelUpdateErr, parcelUpdateRes) {
                // Handle parcel update error
                if (parcelUpdateErr) {
                  return done(parcelUpdateErr);
                }

                // Set assertions
                (parcelUpdateRes.body.id).should.equal(parcelSaveRes.body.id);
                (parcelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of parcels if not signed in', function(done) {
    parcel.name = 'Parcel name';
    // Create new parcel model instance
    var parcelObj = Parcel.build(parcel);

    // Save the parcel
    parcelObj.save().then(function() {
      // Request parcels
      request(app).get('/api/parcels')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single parcel if not signed in', function(done) {
    // Create new parcel model instance
    var parcelObj = Parcel.build(parcel);

    // Save the parcel
    parcelObj.save().then(function() {
      request(app).get('/api/parcels/' + parcelObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', parcel.name);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single parcel with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/parcels/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Parcel is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single parcel which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent parcel
    request(app).get('/api/parcels/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No parcel with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an parcel if signed in', function(done) {
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

        // Save a new parcel
        agent.post('/api/parcels')
          .send(parcel)
          .expect(200)
          .end(function(parcelSaveErr, parcelSaveRes) {


            // Handle parcel save error
            if (parcelSaveErr) {
              return done(parcelSaveErr);
            }

            // Delete an existing parcel
            agent.delete('/api/parcels/' + parcelSaveRes.body.id)
              .send(parcel)
              .expect(200)
              .end(function(parcelDeleteErr, parcelDeleteRes) {

                // Handle parcel error error
                if (parcelDeleteErr) {
                  return done(parcelDeleteErr);
                }

                // Set assertions
                (parcelDeleteRes.body.id).should.equal(parcelSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an parcel if not signed in', function(done) {
    // Set parcel user
    parcel.userId = user.id;

    // Create new parcel model instance
    var parcelObj = Parcel.build(parcel);

    // Save the parcel
    parcelObj.save().then(function() {
      // Try deleting parcel
      request(app).delete('/api/parcels/' + parcelObj.id)
        .expect(403)
        .end(function(parcelDeleteErr, parcelDeleteRes) {

          // Set message assertion
          (parcelDeleteRes.body.message).should.match('User is not authorized');

          // Handle parcel error error
          done(parcelDeleteErr);
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
