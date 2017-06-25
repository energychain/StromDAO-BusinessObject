/**
 * StromDAO Business Object: DirectConnectionFactory
 * =========================================
 * Factory Contract to build direct connections handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.factory = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPRDecorateFactory"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPRDecorateFactory');			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.build= function(address_mpset,address_mprset_start,address_mprset_end) {	
							
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
							instance.obj.build(address_mpset,address_mprset_start,address_mprset_end,{value:"0x0",gasPrice:"0x0",gasLimit:3903918}).then(function(o) {									
									bdx=o;	
									//{value:"0x0",gasPrice:"0x0",gasLimit:3803918}
									
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
