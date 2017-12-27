/**
 * StoreController
 *
 * @description :: Server-side logic for managing stores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var PlayFabAPI = require("playfab-sdk/Scripts/PlayFab/PlayFab");
var PlayFabClientAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabClient");
var PlayFabServerAPI = require("playfab-sdk/Scripts/PlayFab/PlayFabServer");
PlayFabAPI.settings.developerSecretKey="SRXMXQ57OKNHI5Z6OAXD546RNEK8F95E3OYZQC3RWWS8GM7MFD";


module.exports = {
	getItemList: function (req,res) {
		var values = req.allParams();
/*		var request = {
			CatalogVersion:values.catalog_version
		}*/
		var request = {};
		PlayFabServerAPI.GetCatalogItems(
			request,
			OnGetCatalogItemsResult
		);
		function OnGetCatalogItemsResult(error,result) {
			if (error==null) {
				res.send(result.data.Catalog);
			} else {
				res.send("fail");
			}
		}
	},
	getInventory: function (req,res) {
		var values = req.allParams();
		console.log(req.session);
		var sessionTicket = null;
		//FA8795BB519212F8-0-0-8C4D-8D54B0B6CD41EF7-fwCp/INIj+DAOXHCW0RyofszYo5rH/xaw3Diee+Gfsw=
		for (var i=0;i<=req.session.num;i++) {
			console.log(req.session.playerMap[i].username);
			if (req.session.playerMap[i].username==values.username) {
				console.log(values.username);
				sessionTicket = req.session.playerMap[i].session_ticket;
			}	
		}
		PlayFabAPI._internalSettings.sessionTicket = sessionTicket;
		var request = {};
		PlayFabClientAPI.GetUserInventory(
			request,
			OnGetUserInventoryResult
		);
		function OnGetUserInventoryResult(error,result) {
			if (error==null) {
				res.send(result.data.Inventory);
			} else {
				res.send("fail");
			}
		}
	},
	PurchaseGoods: function (req,res) {
		var values = req.allParams();
		console.log(req.session);
		var sessionTicket = null;
		//FA8795BB519212F8-0-0-8C4D-8D54B0B6CD41EF7-fwCp/INIj+DAOXHCW0RyofszYo5rH/xaw3Diee+Gfsw=
		for (var i=0;i<=req.session.num;i++) {
			console.log(i);
			if (req.session.playerMap[i].username==values.username) {
				sessionTicket = req.session.playerMap[i].session_ticket;
			}	
		}
		PlayFabAPI._internalSettings.sessionTicket = sessionTicket;
		var request = {
			ItemId: values.id,
			VirtualCurrency: values.virtualCurrency,
			Price: values.price
		}
		//console.log(request);
		PlayFabClientAPI.PurchaseItem(
			request,
			OnPurchaseItemResult
		);
		function OnPurchaseItemResult(error,result) {
			if (error==null) {
				res.send(result.data.Items)
			} else {
				res.send("fail");
			}
		}
	}
};

