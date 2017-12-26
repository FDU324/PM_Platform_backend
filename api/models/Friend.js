/**
 * Friend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection : 'localMysql',
  tableName : 'friendApplication',

  attributes: {
  	myUsername: 'string',
  	friendUsername: 'string',
  	read: {
  		type:'integer',

  	},
  	id: {
  		type:'integer',
  		primaryKey : true,
  		autoIncrement: true
  	}
  }
};

