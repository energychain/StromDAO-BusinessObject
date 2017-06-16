/**
 * StromDAO Business Object: Settlement
 * =========================================
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.clearing = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_Clearing"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_Clearing');			
				instance.test = {};				
				
				instance.clear= function(cache) {		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.clear(cache,{value:"0x0",gasPrice:"0x0",gasLimit:4595290}).then(function(o) {	
									parent._waitForTransactionKeepRef(o,resolve2);	
							});									
					});
					return p2;
				};				
				resolve(instance);
			});
			return p1;
		};
