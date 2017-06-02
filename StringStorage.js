/**
 * StromDAO Business Object: StringStorage
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.stringstorage = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:StringStorage"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:StringStorage');			
				instance.test = {};				
				
				instance.str=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.str().then(function(o) {													
								 resolve2(o[0]);									
							});									
					});
					return p2;
				};
	
				resolve(instance);
			});
			return p1;
		};
