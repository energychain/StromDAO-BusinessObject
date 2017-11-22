/**
 * StromDAO Business Object: MPR
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * In general a Meter Point Operating (Contract) handles meter readings and issues Deliverables as soon as a new reading is received.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 this.furyuser = function(obj_or_address) {
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance={};			
				instance.test = {};				
				
				/**
				 * Stores a reading to this contract instance. Requires sender to be approved Meter-Point 
				 * @see approveMP()
				 */
				instance.setRole= function(role,address) {					
					var p2 = new Promise(function(resolve2, reject2) { 
						parent.roleLookup().then(function(rl) {
							rl.setRelation(role,address).then(function(tx) {
								resolve2(tx);
							});
						});
					});
					return p2;
				};
				instance.setRoleValue=function(role,value) {
					var p2 = new Promise(function(resolve2, reject2) { 						
						parent.stringstoragefactory().then(function(ssf)  {						
							ssf.build(value).then(function(address) {
								parent.furyuser().then(function(furyuser) {
									furyuser.setRole(role,address).then(function(tx) {
										resolve2(tx);
									});
								});
							});
						});
					});
					return p2;					
				};
				instance.getRole=function(role) {					
					var p2 = new Promise(function(resolve2, reject2) { 
						parent.roleLookup().then(function(rl) {
							rl.relations(parent.wallet.address,role).then(function(tx) {
								resolve2(tx);
							});
						});
					});
					return p2;
				};
				instance.getRoleValue= function(role) {					
					var p2 = new Promise(function(resolve2, reject2) { 
						parent.furyuser().then(function(furyuser) {
								furyuser.getRole(role).then(function(tx) {
									if(tx=="0x0000000000000000000000000000000000000000") {	
										console.log("Nothing linked to role",role);								
										resolve2();
									} else {
										parent.stringstorage(tx).then(function(ss) {
											ss.str().then(function(str) {
												resolve2(str);
											});
										});
									}										
								});
							
						});						
					});
					return p2;
				};
				instance.setUserKeys = function(account_obj) {
					var p2 = new Promise(function(resolve2, reject2) { 
						account_obj.encrypt(parent.wallet.privateKey).then(function(enc) {
							account_obj.encrypt(parent.RSAPrivateKey).then(function(enc_rsa) {
								parent.stringstoragefactory().then(function(ssf)  {						
									ssf.build(enc).then(function(ss) {										
										ssf.build(enc_rsa).then(function(ss_rsa) {											
											ssf.build(parent.RSAPublicKey).then(function(ss_pub) {
												parent.roleLookup().then(function(rl) {
													rl.setRelation(224,ss_pub).then(function() {													
														rl.setRelation(223,ss_rsa).then(function() {
															rl.setRelation(222,ss).then(function(tx) {
																resolve2(tx);
															});
														});
													});													
												});
											});
										});
									});
								});
							});
						});
					});
					return p2;
				}
				instance.getRSAKeys = function(account_obj) {
					var p2 = new Promise(function(resolve2, reject2) {
						parent.furyuser().then(function(furyuser) {
							furyuser.getRoleValue(224).then(function(rsa_pub) {
								account_obj.RSAPublicKey=rsa_pub;
								furyuser.getRoleValue(223).then(function(rsa_priv_enc) {
									account_obj.decrypt(rsa_priv_enc).then(function(rsa_priv) {
											account_obj.RSAPrivateKey=rsa_priv;
											resolve2();
									});
								});
							});
						});
					});
					return p2;
				};				
				resolve(instance);
			});
			return p1;
};
