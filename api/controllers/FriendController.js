/**
 * FriendController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var PlayFabAPI = require("playfab-sdk/Scripts/PlayFab/PlayFab");
var PlayFabClientAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabClient");
var PlayFabServerAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabServer");
PlayFabAPI.settings.developerSecretKey="SRXMXQ57OKNHI5Z6OAXD546RNEK8F95E3OYZQC3RWWS8GM7MFD";

module.exports = {
	sendRequest: function(req,res) {
	},
	getFriendList: function (req,res) {
		var values = req.allParams();
		var request = {
			Username : values.myUsername
			//PlayFabId:values.playfabid
		}
		PlayFabClientAPI.GetAccountInfo(
			request,
			OnGetAccountResult
		);
		function OnGetAccountResult(error,result) {
			if (error==null) {
				//res.send(result.data);
				var user_PlayFabId = result.data.AccountInfo.PlayFabId;
				var request = {
					PlayFabId : user_PlayFabId
				}
				PlayFabServerAPI.GetFriendsList(
					request,
					OnGetFriendListResult
				);
				function OnGetFriendListResult(error_getFriendList,result_getFriendList) {
					if (error_getFriendList==null) {
						res.send(result_getFriendList.data.Friends);
					} else {
						res.send("fail");
					}
				}

			} else {
				console.log(error);
				res.send("fail");
			}
		}
	},
	addFriend: function(req,res) {
		var values=req.allParams();
		var request = {
			Username : values.myUsername			
		}
		PlayFabClientAPI.GetAccountInfo(
			request,
			OnGetAccountResult
		);
		function OnGetAccountResult(error,result) {
			if (error==null) {
				//res.send(result.data);
				var user_PlayFabId = result.data.AccountInfo.PlayFabId;
				var request = {
					PlayFabId : user_PlayFabId,
					FriendUsername : values.friendUsername
				}
				PlayFabServerAPI.AddFriend(
					request,
					OnAddFriendResult
				);
				function OnAddFriendResult(error_addFriend,result_addFriend) {
					if (error_addFriend==null) {
						res.send("success");
					} else {
						res.send("fail");
					}
				}

			} else {
				console.log(error);
				res.send("fail");
			}
		}
	},
	removeFriend: function(req,res) {
		var values = req.allParams();
		var request = {
			Username : values.myUsername
			//PlayFabId:values.playfabid
		}
		PlayFabClientAPI.GetAccountInfo(
			request,
			OnGetAccountResult
		);
		function OnGetAccountResult(error,result) {
			if (error==null) {
				//res.send(result.data);
				var user_PlayFabId = result.data.AccountInfo.PlayFabId;
				var request = {
					PlayFabId : user_PlayFabId
				}
				PlayFabServerAPI.GetFriendsList(
					request,
					OnGetFriendListResult
				);
				function OnGetFriendListResult(error_getFriendList,result_getFriendList) {
					if (error_getFriendList==null) {
						result_getFriendList.data.Friends.forEach(function(o){
							console.log(o.FriendPlayFabId);
							if (o.Username==values.friendUsername) {
								var request={
									PlayFabId : user_PlayFabId,
									FriendPlayFabId : o.FriendPlayFabId
								}
								PlayFabServerAPI.RemoveFriend(
									request,
									OnRemoveFriendResult
								);
								function OnRemoveFriendResult(error_removeFriend,result_removeFriend) {
									if (error_removeFriend==null) {
										console.log(result_removeFriend);
										res.send("success");
									} else {
										console.log(error_removeFriend);
										res.send("fail");
									}
								}
							}
						});
						//res.send(result_getFriendList.data.Friends);
					} else {
						res.send("fail");
					}
				}

			} else {
				console.log(error);
				res.send("fail");
			}
		}
	}	
};

