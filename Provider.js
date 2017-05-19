/*
 * StromDAO Business Object: Provider
 * =========================================
 * Liquidity Provider (=classical utility) handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.provider = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_Provider"];	
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_Provider');
					instance.handleDelivery=function(_delivery) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.handleDelivery(_delivery).then(function(o) {
									parent._waitForTransactionKeepRef(o,resolve2);	
								});
							});
							return p2;
					};
					instance.approveSender=function(_sender,_approve,_cost_per_day,_cost_per_energy) {
							var p2 = new Promise(function(resolve2, reject2) {							
								instance.obj.approveSender(_sender,_approve,_cost_per_day,_cost_per_energy).then(function(o) {
										parent._waitForTransactionKeepRef(o,resolve2);	
								});
							});
							return p2;
					};
					instance.deliveryMux=function() {
							var p2 = new Promise(function(resolve2, reject2) {							
								instance.obj.deliveryMux().then(function(o) {										
										resolve2(o[0]);
								});
							});
							return p2;
					};										
					instance.stromkonto=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.stromkonto().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.billings=function(_address) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.billings(_address).then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					resolve(instance);
			});
			return p1;
		};
