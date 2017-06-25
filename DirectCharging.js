/**
 * StromDAO Business Object: DirectCharging
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
 
 
this.directcharging=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectCharging"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectCharging');	
									
				instance.addConnection=function(address_meterpoint)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addConnection(address_meterpoint).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.chargeAll=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.chargeAll().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				}
				instance.stromkonto=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.stromkonto().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.reader=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.reader().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}					
				resolve(instance);
			});
			return p1;
		};
