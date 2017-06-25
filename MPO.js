/**
 * StromDAO Business Object: MPO
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * In general a Meter Point Operating (Contract) handles meter readings and issues Deliverables as soon as a new reading is received.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.mpo = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPO"];

			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPO');			
				instance.test = {};				
				
				/**
				 * Approve a new Blockchain Address to this contract instance. Limit: Only-Owner
				 * @param _meter address
				 * @param _role Eq. to 4= Consumer or 5= Producer
				 */
				instance.approveMP=function(address_meterpoint,uint256_role) {								
					var p2 = new Promise(function(resolve2, reject2) { 						
							instance.obj.approveMP(address_meterpoint,uint256_role).then(function(o) {
								parent._waitForTransactionKeepRef(o,resolve2);											
							});									
					});
					return p2;
				};
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.storeReading=function(uint256_reading) {
					uint256_reading=Math.round(uint256_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.storeReading(uint256_reading).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				/**
				 * Allows a test commit to check if it fails. Promise that might be used to validate a Meter-Point is fully connected.
				 */
				instance.test.storeReading=function(uint256_reading) {
					uint256_reading=Math.round(uint256_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.estimate.storeReading(uint256_reading).then(function(cost) {									
								resolve2(cost.toString());								
							}).catch(function() { reject2(-1); });
					});
					return p2;
				};
				
				/**
				 * Returns last delivery issued for a Meter-Point 
				 */
				instance.lastDelivery=function(address_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.lastDelivery(address_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
				
				/**
				 * Returns last reading for a Meter-Point 
				 */
				instance.readings=function(address_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.readings(address_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
			
				resolve(instance);
			});
			return p1;
		};
