/**
 * StromDAO Business Object: Settlement
 * =========================================
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.settlement = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_Settlement"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_Settlement');			
				instance.test = {};				
				
				instance.settle= function(address_txcache) {		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.settle(address_txcache,{value:"0x0",gasPrice:"0x0",gasLimit:4195290}).then(function(o) {										
									parent._waitForTransactionKeepRef(o,resolve2);	
							});									
					});
					return p2;
				};
				instance.mpr=function(address_mprset) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.mpr(address_mprset).then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				instance.txcache=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.txcache().then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};				
				//
				resolve(instance);
			});
			return p1;
		};
