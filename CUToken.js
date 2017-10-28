/**
 * StromDAO Business Object: DirectConnectionFactory
 * =========================================
 * Factory Contract to build direct connections handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.cutoken = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_CUToken"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_CUToken');			
				instance.test = {};				
				
				
				
				instance.totalSupply=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.totalSupply().then(function(o) {														
								 resolve2(o[0].toString()*1);									
							});									
					});
					return p2;
				};
				
				instance.owner=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.owner().then(function(o) {														
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				
				instance.balanceOf=function(address_account) {					
						var p2 = new Promise(function(resolve2, reject2) { 											
											instance.obj.balanceOf( parent._resolveName(address_account)).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
				};
				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.issue= function() {	
							
					var p2 = new Promise(function(resolve2, reject2) { 
							var bdx="";
							
							instance.obj.issue({value:"0x0",gasPrice:"0x0",gasLimit:3903918}).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);									
							});									
					});
					return p2;
				};
				
				instance.addMeterpoint= function(address_meterpoint) {	
							
					var p2 = new Promise(function(resolve2, reject2) { 
							var bdx="";
							
							instance.obj.addMeterpoint( parent._resolveName(address_meterpoint),{value:"0x0",gasPrice:"0x0",gasLimit:3903918}).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);									
							});									
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
