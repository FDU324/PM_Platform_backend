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

module.exports = {
	getMoments: function (req,res) {
		var values = req.allParams();
		var request = {
			Username : values.username
			//PlayFabId:values.playfabid
		}
		PlayFabClientAPI.GetAccountInfo(
			request,
			OnGetAccountResult
		);	
		function OnGetAccountResult(error,result) {
			var list=[];
			var tag=0;
			if (error==null) {
				var user_PlayFabId = result.data.AccountInfo.PlayFabId;
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
   						var path = "120.25.238.161/PM/tank/record-images";
   						var filesList = [];
        				readFileList(path, filesList);
        				filesList.forEach((item) => {
       						var ms = image(fs.readFileSync(item.path + item.filename));
       	    				ms.mimeType && (imageList.push(item.filename))
				        });		
						//console.log(imageList);
       					function readFileList(path, filesList) {
    						var files = fs.readdirSync(path);
    						files.forEach(function (itm, index) {
        						var stat = fs.statSync(path + itm);
        						if (stat.isDirectory()) {
						            readFileList(path + itm + "/", filesList)
        						} else {

            						var obj = {};
            						obj.path = path;
            						obj.filename = itm
            						filesList.push(obj);
        						}

    						})

						}			
				        console.log(imageList);	
						process(values.username,result.data.AccountInfo.TitleInfo.DisplayName);
						//console.log(tag);
						var request = {
							PlayFabId : user_PlayFabId	
						}
						PlayFabServerAPI.GetFriendsList(
							request,
							OnGetFriendListResult
						);
						function OnGetFriendListResult(error_friendList,result_friendList) {
							if (error_friendList==null) {
								result_friendList.data.Friends.forEach(function(p) {
									if (error_friendList==null) {
										process(p.Username,p.TitleDisplayName);
										//console.log(tag);
										//console.log(list);
										res.json(list);	
									}						
								});
							} else {
								res.send('fail');
							}					
						}
					} else {
						res.send('fail');
					}
				}
				function process(username,displayname) {
					console.log(result);
					imageList.forEach(function(q) {
						var temp_noDots = q.split(".");
						var temp_splitUrl = temp_noDots[0].split("_");
						if (temp_splitUrl[1]==username) {
							var userRes = {
								username: username,
								email: '',
								nickname: displayname
							}
							var output = {
								user: userRes,
								time: temp_splitUrl[2],
								image: q
							}
							list[tag]=output;
							//res.json(output/*.pop().toJSON()*/);
							tag+=1;
						}
					});
					//console.log(tag);
					//res.json(list);
				}
				//console.log(list);
				//res.json(list);
			}
		}
	}
};

