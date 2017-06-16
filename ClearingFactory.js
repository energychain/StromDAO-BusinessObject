/**
 * StromDAO Business Object: DirectConnectionFactory
 * =========================================
 * Factory Contract to build direct connections handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.factory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_ClearingFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_ClearingFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function(_stromkonto) {	
							
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.onbuilt=function(cb) {						
									resolve2(cb);						
							};		
							instance.obj.build(_stromkonto,{value:"0x0",gasPrice:"0x0",gasLimit:3795290}).then(function(o) {	
										
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
