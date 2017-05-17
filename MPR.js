/**
 * StromDAO Business Object: MPR
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * In general a Meter Point Operating (Contract) handles meter readings and issues Deliverables as soon as a new reading is received.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.mpr = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:MPR"];

			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPR');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.storeReading=function(_reading) {
					_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.storeReading(_reading).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				/**
				 * Allows a test commit to check if it fails. Promise that might be used to validate a Meter-Point is fully connected.
				 */
				instance.test.storeReading=function(_reading) {
					_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.estimate.storeReading(_reading).then(function(cost) {									
								resolve2(cost.toString());								
							}).catch(function() { reject2(-1); });
					});
					return p2;
				};
				
				
				/**
				 * Returns last reading for a Meter-Point 
				 */
				instance.readings=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.readings(_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
	
				resolve(instance);
			});
			return p1;
		};
