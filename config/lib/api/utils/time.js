'use strick';

/**
 * package dependencies
 * @author fayssal tahtoub
 * @email <fayssal.tahtoub@gmail.com>
 */
var _ = require('lodash'),
    moment = require('moment');

var TimeUtils= function(){

};

/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
TimeUtils._instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
TimeUtils.getInstance = function(){
    if(this._instance === null){
        this._instance = new TimeUtils();
    }
    return this._instance;
};

TimeUtils.prototype.addSerialDate= function(serialDate){
  var tokens= serialDate.split(',');

	var momentFormatObj= {};

	_.each(tokens,function(token){
		var entries= token.trim().split(' ');
		momentFormatObj[entries[1]] = entries[0];
	});

	return moment().add(momentFormatObj);
};


module.exports.TimeUtils = TimeUtils.getInstance();
