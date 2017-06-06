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
						instance.addTx=function(_from,_to,_value,_base) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addTx(_from,_to,_value,_base).then(function(o) {
													parent._waitForTransactionKeepRef(o,resolve2);	
											});
								});
								return p2;
						};
						instance.balancesSoll=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceSoll(_address).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};	
						instance.balancesHaben=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceHaben(_address).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};		
						instance.balancesCachedSoll=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+_address+"_soll");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceSoll(_address).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+_address+"_soll",o[0].toString()*1);
														resolve2(o[0].toString()*1);
												});
											} else {
												resolve2(stored);
												
											}
								});
								return p2;
						};	
						instance.balancesCachedHaben=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+_address+"_haben");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceHaben(_address).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+_address+"_haben",o[0].toString()*1);
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
