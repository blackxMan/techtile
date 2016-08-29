'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;

/**
 * Update user details
 */
 exports.update = function(req, res, next) {
   var userInfo = req.body;

   delete req.body.roles;
   if (userInfo) {

     async.waterfall([
       function(done) {

         if (userInfo.email.toLowerCase() !== req.user.email.toLowerCase()) {
           User.findOne({
             where: {
               email: {
                 like: userInfo.email
               },
               id: {
                 '$ne': req.user.id
               }
             }
           }).then(function(user) {
             if (user && user.email.toLowerCase() === userInfo.email.toLowerCase()) {
               return res.status(400).send({
                 message: 'Email already exists'
               });
             }
             done(null);
           }).catch(function(err) {
             return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
             });
           });
         } else {
           done(null);
         }
       },
       function(done) {
         if (userInfo.username.toLowerCase() !== req.user.username.toLowerCase()) {
           User.findOne({
             where: {
               username: {
                 like: userInfo.username
               },
               id: {
                 '$ne': req.user.id
               }
             }
           }).then(function(user) {
             if (user && user.username.toLowerCase() === userInfo.username.toLowerCase()) {
               return res.status(400).send({
                 message: 'Username already exists'
               });
             }
             done(null);
           }).catch(function(err) {
             return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
             });
           });
           done(null);
         } else {
           done(null);
         }
       },
       function(done) {
         User.findOne({
           where: {
             id: req.user.id
           }
         }).then(function(user) {

           user.firstName = userInfo.firstName;
           user.lastName = userInfo.lastName;
           user.displayName = userInfo.firstName + ' ' + userInfo.lastName;
           user.username = userInfo.username;
           user.email = userInfo.email.toLowerCase();
           user.updatedAt = Date.now();

           user.save().then(function(user) {
             if (!user) {
               return res.status(400).send({
                 message: 'Unable to update'
               });
             } else {
               res.json(user);
             }
           }).catch(function(err) {
             return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
             });
           });

         });
         done(null);
       }
     ]);
   } else {
     res.status(401).send({
       message: 'User is not signed in'
     });
   }
 };

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {

        var oldImage = user.profileImageURL;

        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save().then(function(saved) {
          if (!saved) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saved)
            });
          } else {
            if (oldImage) {
              try {
                var stats = fs.lstatSync(oldImage);
                if (stats.isFile()) {
                  fs.unlinkSync(oldImage);
                }
              } catch (e) {
                console.log('Unable to delete the old image', e);
              }
            }

            req.user.profileImageURL = user.profileImageURL;
            res.json(user);
          }
        }).catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
