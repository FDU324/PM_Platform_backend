/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getGameInfo: function(req,res){
		Game.find({

		}).exec(function (err,result) {
			console.log(result);
			res.json(result/*.pop().toJSON()*/);
		});
	}
};

