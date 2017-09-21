/**
 * StromDAO Business Object: MPTokenFactory
 * =========================================
 * Create a Time/Power Token Contract using factory class for a Meter Point Token.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.factory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPTokenFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPTokenFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function(address_reading,address_meterpoint) {	
							
					var p2 = new Promise(function(resolve2, reject2) { 
							var bdx="";
						  
							instance.obj.onbuilt=function(cb) {	
									var p3=new Promise(function(resolve3, reject3) {															
										parent._waitForTransaction(bdx.hash).then(resolve3(cb));
									});
									p3.then(function() {
											resolve2(cb);
									});								
							};								
							instance.obj.build(address_reading,address_meterpoint,{value:"0x0",gasPrice:"0x0",gasLimit:3795290}).then(function(o) {	
								bdx=0;		
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
