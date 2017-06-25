/*
 * StromDAO Business Object: RoleLookup
 * =========================================
 * Handling of Consensus Frame in Energy Blockchain / Context provider
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
this.rolelookup=function(obj_or_address) {
	       if(typeof obj_or_address == "undefined") obj_or_address=parent.options.rolelookup;
	      
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:RoleLookup');		
				
				instance.owner=function() {return parent._owner_promise(instance);};					
			
				instance.roles=function(i) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.roles(i).then(function(o) {																											
												resolve2(o[0]);
										});																		
							});									
				
					return p2;
				};
				instance.setRelation=function(uint256_role,address_target) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setRelation(uint256_role,address_target).then(function(o) {
								parent._waitForTransaction(o.hash).then(function() {										
												 resolve2(parent._keepHashRef(o));						
												});																														
										});																		
							});													
					return p2;
				};
				instance.setRelationFrom=function(uint256_role,address_target) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setRelationFrom(uint256_role,address_target).then(function(o) {
								parent._waitForTransaction(o.hash).then(function() {										
												 resolve2(parent._keepHashRef(o));						
												});																														
										});																		
							});													
					return p2;
				};
				instance.relations=function(address_target,uint256_role) {
						var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.relations(address_target,uint256_role).then(function(o) {
								resolve2(o[0]);																	
							});
						});													
						return p2;
				};
				instance.defaults=function(uint256_role) {
						var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.defaults(uint256_role).then(function(o) {
								resolve2(o[0]);																	
							});
						});													
						return p2;
				}							
				resolve(instance);
			});
			return p1;
		};
