/**
 * StromDAO Business Object: DirectConnection
 * =========================================
 * Directly connect for Energy delivery to an account within StromDAO Energy Blockchain.
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
 
 
this.directconnection=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectConnection"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectConnection');	
									
				instance.from=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.from().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.to=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.to().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.cost_per_day=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.cost_per_day().then(function(o) {									
								resolve2(o[0].toString()*1);											
							});									
					});
					return p2;
				}	
				instance.cost_per_energy=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.cost_per_energy().then(function(o) {								
								resolve2(o[0].toString()*1);											
							});									
					});
					return p2;
				}	
				instance.owner=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.owner().then(function(o) {								
								resolve2(o[0]);											
							});									
					});
					return p2;
				}
				resolve(instance);
			});
			return p1;
		};
