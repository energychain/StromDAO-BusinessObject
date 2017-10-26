/**
 * StromDAO Business Object: MPR
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * In general a Meter Point Operating (Contract) handles meter readings and issues Deliverables as soon as a new reading is received.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}

this.mpr = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:MPReading"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPReading');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.storeReading=function(uint256_reading) {
					//_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.storeReading(uint256_reading).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				/**
				 * Allows a test commit to check if it fails. Prominse that might be used to validate a Meter-Point is fully connected.
				 */
				instance.test.storeReading=function(uint256_reading) {
					_reading=Math.round(uint256_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.estimate.storeReading(uint256_reading).then(function(cost) {									
								resolve2(cost.toString());		
								// We now know  that this is a meter point ... remember it (localy)
														
							}).catch(function() { reject2(-1); });
					});
					return p2;
				};
				
				
				/**
				 * Returns last reading for a Meter-Point 
				 */
				instance.readings=function(address_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.readings( parent._resolveName(address_meterpoint)).then(function(o) {		
													
								 resolve2(o);									
							});									
					});
					return p2;
				};
	
				instance.history=function(address_meterpoint,length) {
					var p2 = new Promise(function(resolve2, reject2) { 
						parent.rpcprovider.getBlockNumber().then(function(latest_block) {
							parent.wallet.provider.getLogs({address:obj_or_address,fromBlock:latest_block-length,toBlock:latest_block}).then(							
							function(logs) {															
									entries=[];
									for(var i=0;i<logs.length;i++) {
											var data = logs[i].data;
											if(data.length>64) {
												data=data.substr(2);
												_meter_point ="0x"+ split64(data).substr(26);								
												data=data.substr(64);
												_power =split64(data);								
												if(address_meterpoint.toLowerCase()==_meter_point.toLowerCase()) {
													var entry = {};
													entry.blockNumber=logs[i].blockNumber;
													entry.power=_power;
													entry.meterpoint=_meter_point;
													entries.push(entry);
												}
											}
									}
									resolve2(entries);
							});
						});
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
