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
									
				instance.approveConnection=function(address_meterpoint,uint256_powerlimit)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveConnection(address_meterpoint,uint256_powerlimit).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.approvedConnections=function(address_meterpoint) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approvedConnections(address_meterpoint).then(function(o) {									
								 resolve2(o);												
							});									
					});
					return p2;
				}
				resolve(instance);
			});
			return p1;
		};
