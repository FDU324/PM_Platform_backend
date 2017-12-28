/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var PlayFabAPI = require("playfab-sdk/Scripts/PlayFab/PlayFab");
var PlayFabClientAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabClient");
PlayFabAPI.settings.developerSecretKey="SRXMXQ57OKNHI5Z6OAXD546RNEK8F95E3OYZQC3RWWS8GM7MFD";
PlayFabAPI.settings.titleId="8C4D";

//var io = require('socket.io')/*.listen(8081)*/;



//var io = require('socket.io').listen(8081);

//var sails = require("sails");
//var io = require('socket.io')();
/*io.on('confirmConnect',(data,func) => {
	func({
		success:true,
		data: 'success'
	});
});
*/

//console.log(sails.sockets);
/*sails.on('login',function (data) {
  console.log(data.username);
  Friend.find({
    friendUsername:data.username,
    read:0
  }).exec(function (error_receiveMsg,reqMsg) {
    if (error_receiveMsg==null) {
      reqMsg.forEach(function(o) {
        var request = {
          Username : o.myUsername
        }
        PlayFabClientAPI.GetAccountInfo(
          request,
          OnGetAccountResult
        );
        function OnGetAccountResult(error,result) {
          if (error==null) {
            var user = {
              username: data.username,
              email: result.data.AccountInfo.PrivateInfo.Email,
              nickname: result.data.AccountInfo.DisplayName
            };
            sails.sockets.broadcast('test',{name:'test'});
            sails.sockets.broadcast('acceptFriendReq',JSON.stringify(user));
          }
        }
      });
      
    }
  });
});
*//*sails.on('confirmConnect',function(data,func) {
	func({
		success: true,
		data: 'success'
	});
});*/
module.exports = {
	login: function (req,res) {
		var values=req.allParams();
		var request={
			Username: values.username,
			Password: values.password,
			TitleId:PlayFabAPI.settings.titleId
		}
		PlayFabClientAPI.LoginWithPlayFab(
			request,
			OnLoginResult
		);
		function OnLoginResult(error,result) {
/*			console.log(result);
*/			if (error==null) {
				//res.send(result);
				var request = {
					Username : values.username
				}
				PlayFabClientAPI.GetAccountInfo(
					request,
					OnGetAccountResult
				);
				function OnGetAccountResult(error_getAccount,result_getAccount) {
					if (error_getAccount==null) {
						console.log(req.session);
						if (req.session.num==null) {
							req.session.num=0;
						} else {
							req.session.num+=1;
						}
/*						var playerInfo = new Map();
						playerInfo.set(values.username,result.data.SessionTicket);
						console.log(playerInfo);
						req.session.playerInfo = playerInfo;
						console.log(req.session.playerInfo);
*/						if (req.session.playerMap==null) {
							//var playerInfo = new Map();
							//playerInfo.set(values.username,result.data.SessionTicket);
/*							console.log(req.session);
*/							//req.session.playerMap = new Map();
							req.session.playerMap = [];
							req.session.playerMap[0]={
								username: values.username,
								session_ticket: result.data.SessionTicket
							}
							//console.log(result.data);
/*							console.log(req.session);
*/							//res.send(result);
						} else {
/*							console.log(req.session);
							console.log("test");
*/							var v=false;
							for (var i=0;i<req.session.num;i++) {
								if (req.session.playerMap[i].username==values.username) {
									v=true;
								}
							}
							if (!v) {
								req.session.playerMap[req.session.num]={
									username: values.username,
									session_ticket: result.data.SessionTicket
								}
							} else {
								req.session.num-=1;
							}
/*							console.log(req.session);
*/						}
			/*			console.log(sails.io.sockets.on);
						sails.sockets.broadcast('test',{username:'billy191'});
						sails.io.sockets.on('test', function (data) {
							console.log(data);
						});
						console.log(sails.io.sockets.on('test',function(data){}));
			*/			//io.broadcast('login',{username:'billy191'});
						//console.log(io);
						//console.log(sails.sockets);
						//sails.sockets.broadcast('test',{username:'billy191'});
						//io.listen(8081);
/*						sails.sockets.emit('test','test');
						sails.io.on('test',function(data) {
							console.log('test');
						});
						//var io=require('socket.io').listen(8081);
						console.log(sails.io.sockets._events);
*/						//sails.sockets.emit('test','test');
						
						res.send(result_getAccount.data.AccountInfo);
					} else {
						res.send("fail");
					}
				}
			}
			if (result==null) res.send("fail");
		}
	},
	reg: function (req,res) {
		var values=req.allParams();
		//console.log(req.param("email"));
		var request={
			Email:values.email,
			Username:values.username,
			Password:values.password,
			RequiredBothUsernameAndEmail:true,
			DisplayName:values.nickname,
			Titleid:PlayFabAPI.settings.titleId
		}
		PlayFabClientAPI.RegisterPlayFabUser(
			request,
			OnRegisterResult	
		);
		function OnRegisterResult(error,result) {
			console.log(result);
			console.log(error);
			if (error==null) {
				var request = {
					ItemId: 'NormalCannon',
					VirtualCurrency: 'JB',
					Price: 0
				}
				PlayFabClientAPI.PurchaseItem(
					request,
					OnPurchaseItemResult
				);
				function OnPurchaseItemResult(error_purchase,result_purchase) {
					if (error_purchase==null) {
						console.log(result_purchase.data.Items)
					} else {
						console.log("fail");
					}
				}
				res.send("success");
			} else {
				res.send("fail");
			}
			
		}
	}


};
