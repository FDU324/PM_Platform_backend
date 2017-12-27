/**
 * UserdataController
 *
 * @description :: Server-side logic for managing Userdatas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var PlayFabAPI = require("playfab-sdk/Scripts/PlayFab/PlayFab");
var PlayFabClientAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabClient");
var PlayFabServerAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabServer");
PlayFabAPI.settings.developerSecretKey="SRXMXQ57OKNHI5Z6OAXD546RNEK8F95E3OYZQC3RWWS8GM7MFD";
var image = require("imageinfo");
var fs = require("fs");
//var async = require('async');

module.exports = {
	updateRecord: function(req,res) {
		var values = req.allParams();
		Userdata.create({
			username: values.username,
			image: values.url,
			time: values.time
		}).exec(function (err, records) {
			if (err==null) {
				//sails.sockets.emit('moments','');
				res.send('success');
			} else {
				res.send('fail');
			}
		});
	},
	getMoments: function (req,res) {
		list=[];
		list1=[];
		list2=[];
		list3=[];
		tag=0;
		var values = req.allParams();
		var request = {
			Username : values.username
		}
		PlayFabClientAPI.GetAccountInfo(
			request,
			OnGetAccountResult
		);	

		function OnGetAccountResult(error,result) {
			var max=0;
			if (error==null) {
				var user_PlayFabId = result.data.AccountInfo.PlayFabId;
				var request = {
					PlayFabId : user_PlayFabId	
				}
				PlayFabServerAPI.GetFriendsList(
					request,
					OnGetFriendListResult
				);
				function OnGetFriendListResult(error_friendList,result_friendList) {
					if (error_friendList==null) {
						//console.log(result_friendList.data.Friends);
						result_friendList.data.Friends.forEach(function(p) {
							Userdata.find({
								username: p.Username
							}).exec(function (err_list,result_list) {
								//console.log(tag);
								console.log(p);
								if (err_list==null) {
									result_list.forEach(function (q) {
										list.push(process(p.Username,p.TitleDisplayName,q.image,q.time));
									})
									//console.log(list);
									//console.log('1');
									//list2=list
								} else {
									res.send('fail');
								}
							});
						});
						//console.log(list);
						//console.log('2');
						//res.json(list);
						//list3=list;	
					} else {
						res.send('fail');					
					}
				}				
				var request = {
					PlayFabId : user_PlayFabId
				}
				PlayFabClientAPI.GetUserData(
					request,
					OnGetUserDataResult
				);
				var imageList = [];
				function OnGetUserDataResult(error_data,result_data) {
					if (error_data==null) {
						Userdata.find({
							username: values.username
						}).exec(function(err_user,result_user) {
							if (err_user==null) {
								result_user.forEach(function(o) {
									console.log(result.data);
									list.push(process(values.username,result.data.AccountInfo.TitleInfo.DisplayName,o.image,o.time));
								});
								//console.log(tag);
								console.log(list);
								res.json(list);
							} else {
								res.send('fail');
							}
						});
					} else {
						res.send('fail');
					}
				}


				function process(username,displayname,image,time) {
					console.log(username);
					console.log(tag);
					var userRes = {
						username: username,
						email: '',
						nickname: displayname
					}
					var output = {
						user: userRes,
						time: time,
						image: image
					}
					if (max<tag) max=tag;
					tag+=1;
					return output
				}
			}
		}
	}
};

