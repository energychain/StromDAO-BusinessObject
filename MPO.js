/*
 * StromDAO Business Object: MPO
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.mpo = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:MPO"];
			
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPO');						
				instance.approveMP=function(_meter,_role) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveMP(_meter,_role).then(function(o) {
								parent._waitForTransactionKeepRef(o,resolve2);											
							});									
					});
					return p2;
				};
				instance.storeReading=function(_reading) {
					_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.storeReading(_reading).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				instance.lastDelivery=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.lastDelivery(_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};
				instance.readings=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.readings(_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				};		
				if(parent.options.testMode) {
							// In Testmode we do a full "Self-Register" if not registered.
							parent.roleLookup().then( function(roleLookup) {
								roleLookup.relations(parent.wallet.address,parent.options.roles[1]).then( function(tx_result) {						
									if(tx_result=="0x0000000000000000000000000000000000000000") {
										roleLookup.setRelation(parent.options.roles[1],parent.options.contracts["StromDAO-BO.sol:MPO"]).then( 
										        function() {
													return new Promise(function(resolve2, reject2) { resolve2(instance.approveMP(parent.wallet.address,4));	});
												}
										 )
										 .then( function() {
											  return new Promise(function(resolve2, reject2) { 
													resolve2(parent.dso(parent.options.contracts["StromDAO-BO.sol:DSO"]));
													})})
										 .then(function(dso) {
											   return new Promise(function(resolve2, reject2) { 
													resolve2(dso.approveConnection(parent.wallet.address,100000000));
													})})
										 .then(function() {
											  return new Promise(function(resolve2, reject2) { 
													resolve2(roleLookup.setRelation(parent.options.roles[2],parent.options.contracts["StromDAO-BO.sol:DSO"]));
												})})
										 .then(function() {
											  return new Promise(function(resolve2, reject2) { 
												  resolve2(roleLookup.setRelation(parent.options.roles[2],parent.options.contracts["StromDAO-BO.sol:DSO"])); 
											  })})										  	 
										 .then(function() {
											 resolve(instance);
									     });
									} else {
										resolve(instance);
									}
								});
							});
				} else {	
					resolve(instance);
				}
			});
			return p1;
		};
