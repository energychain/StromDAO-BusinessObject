/*
 * StromDAO Business Object: Delivery MUX
 * =========================================
 * MUX for Deliveries (=settlement and clearing) handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.provider = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DeliveryMux"];	
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DeliveryMux');
					
					instance.settleBaseDeliveries=function() {
							var p2 = new Promise(function(resolve2, reject2) {							
								instance.obj.settleBaseDeliveries().then(function(o) {
										parent._waitForTransactionKeepRef(o,resolve2);	
								});
							});
							return p2;
					};
					resolve(instance);
			});
			return p1;
		};
