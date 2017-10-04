/*
 * StromDAO Business Object: Stromkonto
 * =========================================
 * Stable Balance handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
 
this.assetsliabilities = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 					
						var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:StromkontoProxy');
						instance.addTx=function(address_from,address_to,uint256_value,uint256_base) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addTx(address_from,address_to,uint256_value,uint256_base).then(function(o) {
													parent._waitForTransactionKeepRef(o,resolve2);	
											});
								});
								return p2;
						};
						instance.modifySender=function(address_account,bool_allow) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.modifySender(address_account,bool_allow).then(function(o) {
													parent._waitForTransactionKeepRef(o,resolve2);	
											});
								});
								return p2;
						};
						instance.balancesSoll=function(address_acount) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceSoll(address_acount).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};							
						instance.allowedSenders=function(address_acount) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.allowedSenders(address_acount).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};	
						instance.setReceiptAsset=function(address_receipt) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.setReceiptAsset(address_receipt).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};	
						instance.setReceiptLiablity=function(address_receipt) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.setReceiptLiablity(address_receipt).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};													
						instance.owner=function() {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.owner().then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};							
						instance.balancesHaben=function(address_acount) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceHaben(address_acount).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};		
						instance.balancesCachedSoll=function(address_acount) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+address_acount+"_soll");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceSoll(address_acount).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+address_acount+"_soll",o[0].toString()*1);
														resolve2(o[0].toString()*1);
												});
											} else {
												resolve2(stored);
												
											}
								});
								return p2;
						};	
						instance.balancesCachedHaben=function(address_acount) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											var stored = parent.storage.getItemSync(obj_or_address+"_"+address_acount+"_haben");
											if((typeof stored == "undefined")||(stored==null)) {
												instance.obj.balanceHaben(address_acount).then(function(o) {
														parent.storage.setItemSync(obj_or_address+"_"+address_acount+"_haben",o[0].toString()*1);
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
