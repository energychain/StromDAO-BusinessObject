/*
 * StromDAO Business Object: DSO
 * =========================================
 * Distribution Service Operator / logistical handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.dso=function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:DSO');						
				instance.approveConnection=function(_address,_power_limit)  {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveConnection(_address,_power_limit).then(function(o) {									
								parent._waitForTransaction(o.hash).then(function() {										
								 resolve2(parent._keepHashRef(o));						
								});												
							});									
					});
					return p2;
				};
				resolve(instance);
			});
			return p1;
		};
