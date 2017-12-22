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
		var request = {
			CatalogVersion:values.catalog_version
		}
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
		PlayFabClientAPI.GetUserInventory(
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
	consumeGoods: function (req,res) {
		var values = req.allParams();
		var request = {
			ItemId: values.itemid,
			VirtualCurrency: values.virtual_currency,
			Price: values.price
		}
		PlayFabClientAPI.PurchaseItem(
			request,
			OnPurchaseItemResult
		);
		function OnPurchaseItemResult(error,result) {
			if (error==null) {
				var request = {
					ConsumeCount: 1,
					ItemInstanceId: result.data.Items
				}
				PlayFabClientAPI.ConsumeItem(
					request,
					OnConsumeItemResult
				);
				function OnConsumeItemResult(error_consumeItem,result_consumeItem) {
					if (error_consumeItem==null) {
						res.send(result_consumeItem.data);
					} else {
						res.send("fail");
					}
				}
			} else {
				res.send("fail");
			}
		}
	}
};

