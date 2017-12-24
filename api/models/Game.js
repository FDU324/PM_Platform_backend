/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection : 'localMysql',
  tableName : 'game',

  attributes: {
  	id : {
  		type : 'integer',
  		autoIncrement : true,
  		primaryKey : true,
  	},
  	name : 'string',
  	icon : 'string',
  	image : 'string',
  	description : 'string',
  	category : 'string',
  	downloadLink : 'string',
  	packageName : 'string',
  	uri : 'string',
  }
};

