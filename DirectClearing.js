/**
 * StromDAO Business Object: DirectClearing
 * =========================================
 * Directly charge for Energy delivery to an account within StromDAO Energy Blockchain.
 * 
 * DirectCharging gets used together with DirectConnections.
 * 
 * In theory account A and account B are exchanging energy metered by meter_point C
 * 
 * DirectCharging takes several DirectConnections and runs charging as soon as method chargeAll is called.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.directclearing=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectClearing"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectClearing');	
									
				instance.preSettle=function(address_meterpointset)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.preSettle(address_meterpointset).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.clear=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.clear().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.settle=function(address_mprset)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.settle(address_mprset).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.setSettlement=function(address_settlement)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setSettlement(address_settlement).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};

				resolve(instance);
			});
			return p1;
		};
