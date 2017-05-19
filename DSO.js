/*
 * StromDAO Business Object: DSO
 * =========================================
 * Distribution Service Operator / logistical handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.dso=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DSO"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DSO');	
									
				instance.approveConnection=function(_address,_power_limit)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveConnection(_address,_power_limit).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.approvedConnections=function(_address) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approvedConnections(_address).then(function(o) {									
								 resolve2(o);												
							});									
					});
					return p2;
				}
				resolve(instance);
			});
			return p1;
		};
