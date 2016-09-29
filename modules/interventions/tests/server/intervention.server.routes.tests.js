'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Intervention = db.intervention,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, intervention;

/**
 * Intervention routes tests
 */
describe('Intervention CRUD tests', function() {
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

    // Save a user to the test db and create new intervention
    user.save().then(function(user) {
      intervention = Intervention.build();
      intervention = {
        name: 'Intervention name',
        description: 'Intervention description',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an Intervention if logged in', function(done) {
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

        // Save a new Intervention
        agent.post('/api/interventions')
          .send(intervention)
          .expect(200)
          .end(function(interventionSaveErr, interventionSaveRes) {

            // Handle Intervention save error
            if (interventionSaveErr) {
              return done(interventionSaveErr);
            }

            // Get a list of Interventions
            agent.get('/api/interventions')
              .end(function(interventionsGetErr, interventionsGetRes) {

                // Handle Intervention save error
                if (InterventionsGetErr) {
                  return done(interventionsGetErr);
                }

                // Get Interventions list
                var nterventions = interventionsGetRes.body;

                // Set assertions
                console.log('interventions[0]', interventions[0]);
                console.log('userId', userId);

                //(interventions[0].userId).should.equal(userId);
                (interventions[0].name).should.match('intervention name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Intervention if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/interventions')
          .send(intervention)
          .expect(403)
          .end(function(interventionSaveErr, interventionSaveRes) {
            // Call the assertion callback
            done(interventionSaveErr);
          });
      });
  });

  it('should not be able to save an Intervention if no name is provided', function(done) {
    // Invalidate name field
    intervention.name = '';

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

        // Save a new Intervention
        agent.post('/api/interventions')
          .send(intervention)
          .expect(400)
          .end(function(interventionSaveErr, interventionSaveRes) {

            // Set message assertion
            (interventionSaveRes.body.message).should.match('Intervention name must be between 1 and 250 characters in length');
            // Handle intervention save error
            done(interventionSaveErr);
          });
      });
  });

  it('should be able to update an intervention if signed in', function(done) {
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

        // Save a new intervention
        agent.post('/api/interventions')
          .send(intervention)
          .expect(200)
          .end(function(interventionSaveErr, interventionSaveRes) {
            // Handle intervention save error
            if (interventionSaveErr) {
              return done(interventionSaveErr);
            }

            // Update intervention name
            intervention.name = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing intervention
            agent.put('/api/interventions/' + interventionSaveRes.body.id)
              .send(intervention)
              .expect(200)
              .end(function(interventionUpdateErr, interventionUpdateRes) {
                // Handle intervention update error
                if (interventionUpdateErr) {
                  return done(interventionUpdateErr);
                }

                // Set assertions
                (interventionUpdateRes.body.id).should.equal(interventionSaveRes.body.id);
                (interventionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of interventions if not signed in', function(done) {
    intervention.name = 'Intervention name';
    // Create new intervention model instance
    var interventionObj = Intervention.build(intervention);

    // Save the intervention
    interventionObj.save().then(function() {
      // Request interventions
      request(app).get('/api/interventions')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single intervention if not signed in', function(done) {
    // Create new intervention model instance
    var interventionObj = Intervention.build(intervention);

    // Save the intervention
    interventionObj.save().then(function() {
      request(app).get('/api/interventions/' + interventionObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', intervention.name);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single intervention with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/interventions/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Intervention is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single intervention which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent intervention
    request(app).get('/api/interventions/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No intervention with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an intervention if signed in', function(done) {
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

        // Save a new intervention
        agent.post('/api/interventions')
          .send(intervention)
          .expect(200)
          .end(function(interventionSaveErr, interventionSaveRes) {


            // Handle intervention save error
            if (interventionSaveErr) {
              return done(interventionSaveErr);
            }

            // Delete an existing intervention
            agent.delete('/api/interventions/' + interventionSaveRes.body.id)
              .send(intervention)
              .expect(200)
              .end(function(interventionDeleteErr, interventionDeleteRes) {

                // Handle intervention error error
                if (interventionDeleteErr) {
                  return done(interventionDeleteErr);
                }

                // Set assertions
                (interventionDeleteRes.body.id).should.equal(interventionSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an intervention if not signed in', function(done) {
    // Set intervention user
    intervention.userId = user.id;

    // Create new intervention model instance
    var interventionObj = Intervention.build(intervention);

    // Save the intervention
    interventionObj.save().then(function() {
      // Try deleting intervention
      request(app).delete('/api/interventions/' + interventionObj.id)
        .expect(403)
        .end(function(interventionDeleteErr, interventionDeleteRes) {

          // Set message assertion
          (interventionDeleteRes.body.message).should.match('User is not authorized');

          // Handle intervention error error
          done(interventionDeleteErr);
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
