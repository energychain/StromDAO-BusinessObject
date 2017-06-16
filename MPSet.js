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
									
				instance.addMeterPoint=function(_address)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addMeterPoint(_address).then(function(o) {	
								parent._waitForTransactionKeepRef(o,function() {console.log("MP Added"); });		
								resolve2(o);							
																			
							});									
					});
					return p2;
				};
		
				instance.meterpoints=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoints(idx).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				
				instance.length=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.length().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}
											
				resolve(instance);
			});
			return p1;
		};
