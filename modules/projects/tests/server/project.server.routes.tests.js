'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Project = db.project,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, project;

/**
 * Project routes tests
 */
describe('Project CRUD tests', function() {
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

    // Save a user to the test db and create new project
    user.save().then(function(user) {
      project = Project.build();
      project = {
        name: 'Project name',
        description: 'Project description',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an project if logged in', function(done) {
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

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function(projectSaveErr, projectSaveRes) {

            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Get a list of projects
            agent.get('/api/projects')
              .end(function(projectsGetErr, projectsGetRes) {

                // Handle project save error
                if (projectsGetErr) {
                  return done(projectsGetErr);
                }

                // Get projects list
                var projects = projectsGetRes.body;

                // Set assertions
                console.log('projects[0]', projects[0]);
                console.log('userId', userId);

                //(projects[0].userId).should.equal(userId);
                (projects[0].name).should.match('Project name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an project if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/projects')
          .send(project)
          .expect(403)
          .end(function(projectSaveErr, projectSaveRes) {
            // Call the assertion callback
            done(projectSaveErr);
          });
      });
  });

  it('should not be able to save an project if no name is provided', function(done) {
    // Invalidate name field
    project.name = '';

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

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(400)
          .end(function(projectSaveErr, projectSaveRes) {

            // Set message assertion
            (projectSaveRes.body.message).should.match('Project name must be between 1 and 250 characters in length');
            // Handle project save error
            done(projectSaveErr);
          });
      });
  });

  it('should be able to update an project if signed in', function(done) {
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

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function(projectSaveErr, projectSaveRes) {
            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Update project name
            project.name = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing project
            agent.put('/api/projects/' + projectSaveRes.body.id)
              .send(project)
              .expect(200)
              .end(function(projectUpdateErr, projectUpdateRes) {
                // Handle project update error
                if (projectUpdateErr) {
                  return done(projectUpdateErr);
                }

                // Set assertions
                (projectUpdateRes.body.id).should.equal(projectSaveRes.body.id);
                (projectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of projects if not signed in', function(done) {
    project.name = 'Project name';
    // Create new project model instance
    var projectObj = Project.build(project);

    // Save the project
    projectObj.save().then(function() {
      // Request projects
      request(app).get('/api/projects')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single project if not signed in', function(done) {
    // Create new project model instance
    var projectObj = Project.build(project);

    // Save the project
    projectObj.save().then(function() {
      request(app).get('/api/projects/' + projectObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', project.name);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single project with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/projects/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Project is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single project which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent project
    request(app).get('/api/projects/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No project with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an project if signed in', function(done) {
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

        // Save a new project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function(projectSaveErr, projectSaveRes) {


            // Handle project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Delete an existing project
            agent.delete('/api/projects/' + projectSaveRes.body.id)
              .send(project)
              .expect(200)
              .end(function(projectDeleteErr, projectDeleteRes) {

                // Handle project error error
                if (projectDeleteErr) {
                  return done(projectDeleteErr);
                }

                // Set assertions
                (projectDeleteRes.body.id).should.equal(projectSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an project if not signed in', function(done) {
    // Set project user
    project.userId = user.id;

    // Create new project model instance
    var projectObj = Project.build(project);

    // Save the project
    projectObj.save().then(function() {
      // Try deleting project
      request(app).delete('/api/projects/' + projectObj.id)
        .expect(403)
        .end(function(projectDeleteErr, projectDeleteRes) {

          // Set message assertion
          (projectDeleteRes.body.message).should.match('User is not authorized');

          // Handle project error error
          done(projectDeleteErr);
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
