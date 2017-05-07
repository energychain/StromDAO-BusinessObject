/*
 * StromDAO Business Object: MPO
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.mpo = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPO');						
				instance.approveMP=function(_meter,_role) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveMP(_meter,_role).then(function(o) {
								parent._waitForTransactionKeepRef(o,resolve2);											
							});									
					});
					return p2;
				};
				instance.storeReading=function(_reading) {
					_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.storeReading(_reading).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				instance.lastDelivery=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.lastDelivery(_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
				resolve(instance);
			});
			return p1;
		};
