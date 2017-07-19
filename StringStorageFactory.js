/**
 * StromDAO Business Object: MPR
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * In general a Meter Point Operating (Contract) handles meter readings and issues Deliverables as soon as a new reading is received.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 this.stringstoragefactory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_StringStorageFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_StringStorageFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function(string_str) {
					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.onbuilt=function(cb) {						
									resolve2(cb);						
							};	
							
							instance.obj.build(string_str,{value:"0x0",gasPrice:"0x0"}).then(function(o) {	
								
								//{value:"0x0",gasPrice:"0x0",gas:"2974441329"}
								//parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				instance.buildAndAssign=function(uint_role,string_str) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.build(string_str).then(function(address_string) {
								parent.roleLookup().then(function(rl) {
										rl.setRelation(uint_role,address_string).then(function(d) {
												resolve2(d);
										});
								});
							});
					});	
					return p2;			
				}
				
				resolve(instance);
			});
			return p1;
		};
