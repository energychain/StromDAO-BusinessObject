/*
 * StromDAO Business Object: Stromkonto
 * =========================================
 * Stable Balance handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
 
this.stromkonto = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 					
						var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Stromkonto');
						instance.addTx=function(address_from,address_to,uint256_value,uint256_base) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addTx(address_from,address_to,uint256_value,uint256_base).then(function(o) {
													parent._waitForTransactionKeepRef(o,resolve2);	
											});
								});
								return p2;
						};
						instance.balancesSoll=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceSoll(address_account).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};	
						instance.balancesHaben=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceHaben(address_account).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};		
						instance.balancesCachedSoll=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+address_account+"_soll");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceSoll(address_account).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+address_account+"_soll",o[0].toString()*1);
														resolve2(o[0].toString()*1);
												});
											} else {
												resolve2(stored);
												
											}
								});
								return p2;
						};	
						instance.balancesCachedHaben=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+address_account+"_haben");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceHaben(address_account).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+address_account+"_haben",o[0].toString()*1);
														resolve2(o[0].toString()*1);
												});
											} else {
												resolve2(stored);
												
											}
											
								});
								return p2;
						};							
						instance.sumBase=function() {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.sumBase().then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};		
						instance.sumTx=function() {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.sumTx().then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};	
						resolve(instance);
			});
			return p1;
};
