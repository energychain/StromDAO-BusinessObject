/**
 * StromDAO Business Object: DirectConnectionFactory
 * =========================================
 * Factory Contract to build direct connections handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.factory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectClearingFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectClearingFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function(address_stromkonto,address_settlementfactory) {	
							
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.onbuilt=function(cb) {						
									resolve2(cb);						
							};		
							instance.obj.build(address_stromkonto,address_settlementfactory).then(function(o) {	
										
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
