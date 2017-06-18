/**
 * StromDAO Business Object: MPSet 
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.mprset=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPRset"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPRset');	
											
				instance.meterpoints=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoints(idx).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				
				instance.mpr=function(address) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.mpr(address).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}
											
				resolve(instance);
			});
			return p1;
		};
