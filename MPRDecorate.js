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
						
				instance.meterpoints=function(uint256_idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoints(uint256_idx).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				instance.mpr=function(address_mpr) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.mpr(address_mpr).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};	
				instance.mpr_base=function(address_mpr) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.mpr_base(address_mpr).then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};	
				instance.ChargeFix=function(uint256_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.ChargeFix(uint256_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.ChargeEnergy=function(uint256_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.ChargeEnergy(uint256_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
		
				instance.SplitWeighted=function(uint256_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.SplitWeighted(uint256_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
		
				instance.SplitEqual=function(uint256_amount)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.SplitEqual(uint256_amount).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.mpr=function(address_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.mpr(address_meterpoint).then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
