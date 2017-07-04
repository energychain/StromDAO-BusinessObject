/**
 * StromDAO Business Object: MPToken
 * =========================================
 * Meter Point Token handling for StromDAO Energy Blockchain.
 * 
 * In General a MPToken consists of two ERC-20 Tokens: Time and Power
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.mptoken = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:MPToken"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPToken');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.issue=function() {
					//_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.issue().then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
		
				
				instance.power_token=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.power_token().then(function(o) {		
													
								 resolve2(o[0]);									
							});									
					});
					return p2;
				};
								
				instance.time_token=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.time_token().then(function(o) {														
								 resolve2(o[0]);									
							});									
					});
					return p2;
				};
				
				instance.meterpoint=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.meterpoint().then(function(o) {		
													
								 resolve2(o[0]);									
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
