/**
 * StromDAO Business Object: MPSet 
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.mprdecorate=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPRDecorate"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPRDecorate');	
									
				instance.ChargeFix=function(_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.ChargeFix(_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
		
				instance.SplitWeighted=function(_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.SplitWeighted(_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
		
				instance.SplitEqual=function(_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.SplitEqual(_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.mpr=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.mpr(_meterpoint).then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
