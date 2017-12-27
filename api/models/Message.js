/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection : 'localMysql',
  tableName : 'Message',

  attributes: {
  	from: 'string',
  	to: 'string',
  	message: 'text',
  	time : 'datetime',
  	id: {
  		type: 'integer',
  		autoIncrement : true,
  		primaryKey : true,
  	}
  }
};

