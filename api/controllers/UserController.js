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
				//console.log(request);
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

