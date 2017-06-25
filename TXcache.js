/**
 * StromDAO Business Object: Cache of Energy  Transaction
 * =========================================
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.txcache = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_TXCache"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_TXCache');			
				instance.test = {};				
				
				instance.length=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.length().then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				instance.txs=function(uint256_idx) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.txs(uint256_idx).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
				instance.from=function(uint256_idx) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.from(uint256_idx).then(function(o) {	
								console.log("FROM",o);	
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				instance.to=function(uint256_idx) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.to(uint256_idx).then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				instance.base=function(uint256_idx) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.base(uint256_idx).then(function(o) {		
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				instance.value=function(uint256_idx) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.value(uint256_idx).then(function(o) {		
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
