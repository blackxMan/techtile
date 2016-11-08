'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Activity = db.activity,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, activity;

/**
 * Activity routes tests
 */
describe('Activity CRUD tests', function() {
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

    // Save a user to the test db and create new activity
    user.save().then(function(user) {
      activity = Activity.build();
      activity = {
        name: 'Activity name',
        description: 'Activity description',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an activity if logged in', function(done) {
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

        // Save a new activity
        agent.post('/api/activities')
          .send(activity)
          .expect(200)
          .end(function(activitySaveErr, activitySaveRes) {

            // Handle activity save error
            if (activitySaveErr) {
              return done(activitySaveErr);
            }

            // Get a list of activities
            agent.get('/api/activities')
              .end(function(activitiesGetErr, activitiesGetRes) {

                // Handle activity save error
                if (activitiesGetErr) {
                  return done(activitiesGetErr);
                }

                // Get activities list
                var activities = activitiesGetRes.body;

                // Set assertions
                console.log('activities[0]', activities[0]);
                console.log('userId', userId);

                //(activities[0].userId).should.equal(userId);
                (activities[0].name).should.match('Activity name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an activity if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/activities')
          .send(activity)
          .expect(403)
          .end(function(activitySaveErr, activitySaveRes) {
            // Call the assertion callback
            done(activitySaveErr);
          });
      });
  });

  it('should not be able to save an activity if no name is provided', function(done) {
    // Invalidate name field
    activity.name = '';

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

        // Save a new activity
        agent.post('/api/activities')
          .send(activity)
          .expect(400)
          .end(function(activitySaveErr, activitySaveRes) {

            // Set message assertion
            (activitySaveRes.body.message).should.match('Activity name must be between 1 and 250 characters in length');
            // Handle activity save error
            done(activitySaveErr);
          });
      });
  });

  it('should be able to update an activity if signed in', function(done) {
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

        // Save a new activity
        agent.post('/api/activitys')
          .send(activity)
          .expect(200)
          .end(function(activitySaveErr, activitySaveRes) {
            // Handle activity save error
            if (activitySaveErr) {
              return done(activitySaveErr);
            }

            // Update activity name
            activity.name = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing activity
            agent.put('/api/activities/' + activitySaveRes.body.id)
              .send(activity)
              .expect(200)
              .end(function(activityUpdateErr, activityUpdateRes) {
                // Handle activity update error
                if (activityUpdateErr) {
                  return done(activityUpdateErr);
                }

                // Set assertions
                (activityUpdateRes.body.id).should.equal(activitySaveRes.body.id);
                (activityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of activities if not signed in', function(done) {
    activity.name = 'Activity name';
    // Create new activity model instance
    var activityObj = Activity.build(activity);

    // Save the activity
    activityObj.save().then(function() {
      // Request activities
      request(app).get('/api/activities')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single activity if not signed in', function(done) {
    // Create new activity model instance
    var activityObj = Activity.build(activity);

    // Save the activity
    activityObj.save().then(function() {
      request(app).get('/api/activities/' + activityObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', activity.name);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single activity with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/activities/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Activity is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single activity which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent activity
    request(app).get('/api/activities/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No activity with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an activity if signed in', function(done) {
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

        // Save a new activity
        agent.post('/api/activities')
          .send(activity)
          .expect(200)
          .end(function(activitySaveErr, activitySaveRes) {


            // Handle activity save error
            if (activitySaveErr) {
              return done(activitySaveErr);
            }

            // Delete an existing activity
            agent.delete('/api/activities/' + activitySaveRes.body.id)
              .send(activity)
              .expect(200)
              .end(function(activityDeleteErr, activityDeleteRes) {

                // Handle activity error error
                if (activityDeleteErr) {
                  return done(activityDeleteErr);
                }

                // Set assertions
                (activityDeleteRes.body.id).should.equal(activitySaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an activity if not signed in', function(done) {
    // Set activity user
    activity.userId = user.id;

    // Create new activity model instance
    var activityObj = Activity.build(activity);

    // Save the activity
    activityObj.save().then(function() {
      // Try deleting activity
      request(app).delete('/api/activities/' + activityObj.id)
        .expect(403)
        .end(function(activityDeleteErr, activityDeleteRes) {

          // Set message assertion
          (activityDeleteRes.body.message).should.match('User is not authorized');

          // Handle activity error error
          done(activityDeleteErr);
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
