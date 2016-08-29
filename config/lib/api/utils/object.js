'use strick';

/**
 * package dependencies
 * @author fayssal tahtoub
 * @email <fayssal.tahtoub@gmail.com>
 */
var _ = require('lodash');

var ObjectUtils= function(){

};

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
ObjectUtils._instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
ObjectUtils.getInstance = function(){
    if(this._instance === null){
        this._instance = new ObjectUtils();
    }
    return this._instance;
}

ObjectUtils.prototype.mongooseToJSONObject= function(value){
  return JSON.parse(JSON.stringify(value));
};

ObjectUtils.prototype.deleteProperties= function(obj, stack){

  for(var i= 0;i < stack.length;i++)
    obj = _.omit(obj,stack[i]);

  return obj;
};

module.exports = ObjectUtils.getInstance();
