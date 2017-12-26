/**
 * Userdata.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection : 'localMysql',
  tableName : 'userData',

  attributes: {
  	username:{
  		type:'string',
  		//primaryKey: true
  	},
  	//time: 'string',
  	image: 'string',
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    }
  }
};

