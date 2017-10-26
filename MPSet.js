/**
 * StromDAO Business Object: MPSet 
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.mpset=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPset"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPset');	
									
				instance.addMeterPoint=function(address_meterpoint)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addMeterPoint( parent._resolveName(address_meterpoint)).then(function(o) {	
								parent._waitForTransactionKeepRef(o,function() {									
									resolve2(o);							
								});									
							});									
					});
					return p2;
				};
		
				instance.meterpoints=function(uint256_idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoints(uint256_idx).then(function(o) {									
								resolve2(o[0]);											
							}).catch(function(e) {reject2();});									
					});
					return p2;
				};
				
				instance.length=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.length().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}
											
				resolve(instance);
			});
			return p1;
		};
