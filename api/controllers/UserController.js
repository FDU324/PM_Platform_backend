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
			console.log(result);
			if (error==null) {
				var request = {
					Username : values.username
				}
				PlayFabClientAPI.GetAccountInfo(
					request,
					OnGetAccountResult
				);
				function OnGetAccountResult(error_getAccount,result_getAccount) {
					if (error_getAccount==null) {
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
			if (error==null) {
				res.send("success");
			} else {
				res.send("fail");
			}
			
		}
	}


};

