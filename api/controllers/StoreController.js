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
		PlayFabClientAPI.GetCatalogItems(
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

