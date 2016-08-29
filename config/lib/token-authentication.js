var config= require('../config'),
    moment= require('moment'),
    _ = require('lodash'),
    ObjectUtils = require('./api/utils/object'),
    TimeUtils = require('./api/utils/time').TimeUtils;


var TokenAuthentication= function(){

};

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
TokenAuthentication._instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
TokenAuthentication.getInstance = function(){
    if(this._instance === null){
        this._instance = new TokenAuthentication();
    }
    return this._instance;
}


/**
* Get jwt Expire Date
*/
TokenAuthentication.prototype.getExpireTokenTime= function(){
	return TimeUtils.addSerialDate(config.jwtExpireTime);
};


/**
* Get Max time reset password
*/
TokenAuthentication.prototype.getMaxTimePasswordReset= function(){

	return Time.addSerialDate(config.maxTimePasswordReset);
};

TokenAuthentication.prototype.getJWTokenSecret= function(){
  return config.jwtTokenSecret;
};

TokenAuthentication.prototype.getJWTHashMethod= function(){
  return config.jwtHashMethod;
};


/**
 * Retrive the token from the request
 */
TokenAuthentication.prototype.getToken= function(req){
  var token = req.headers["authorization"];

	if (typeof token !== 'undefined') {
    var items= token.split(' ');
      return items[1];
  }

	return undefined;
};

/**
* Delete sensible user data
*/
TokenAuthentication.prototype.deleteCredentials= function(obj,stack){

  stack = ((typeof stack) !== 'undefined') ? stack : ['password', 'salt', 'provider', 'context', 'deleted', 'token', 'roles', 'expires'] ;


  var safeObject = ObjectUtils.deleteProperties(ObjectUtils.mongooseToJSONObject(obj),stack);

  return safeObject;

};

module.exports= TokenAuthentication.getInstance();
