/**
 * StromDAO Business Object: StringStorage
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.coldstorage = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:StringStorage"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance={};
				
				instance.setObj=function(bucket,str) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							parent.storage.setItemSync("cold_"+bucket,str);													
							resolve2();																
					});
					return p2;
				};
				instance.getObj=function(bucket) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							var str=parent.storage.getItemSync("cold_"+bucket);													
							resolve2(str);																
					});
					return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
