/**
 * StromDAO Business Object: DirectBalancingGroupFactory
 * =========================================
 * Factory Contract to build balancing groupd for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.blgfactory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectBalancingGroupFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectBalancingGroupFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function() {
					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.onbuilt=function(cb) {						
									resolve2(cb);						
							};	
							
							instance.obj.build({value:"0x0",gasPrice:"0x0"}).then(function(o) {	
								console.log(o);
								//{value:"0x0",gasPrice:"0x0",gas:"2974441329"}
								//parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
