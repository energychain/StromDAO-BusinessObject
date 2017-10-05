/*
 * StromDAO Business Object: Transferable
 * =========================================
 * Stable Balance and Transfer handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}
 
this.transferable = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_Transferable"];
			var p1 = new Promise(function(resolve, reject) { 					
						var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_Transferable');
						instance.addRx=function(address_to,address_msg,uint256_value,uint256_base,bool_is_liability) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addRx(address_to,address_msg,uint256_value,uint256_base,bool_is_liability).then(function(o) {
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
						instance.baseSoll=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.baseSoll(address_account).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
						};	
						instance.baseHaben=function(address_account) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.baseHaben(address_account).then(function(o) {
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
						instance.owner=function() {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.owner().then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};						
						instance.history=function(address_meterpoint,length) {
							var p2 = new Promise(function(resolve2, reject2) { 
								parent.rpcprovider.getBlockNumber().then(function(latest_block) {
									parent.wallet.provider.getLogs({address:obj_or_address,fromBlock:latest_block-length,toBlock:latest_block}).then(							
									function(logs) {															
											entries=[];
											for(var i=0;i<logs.length;i++) {
													var data = logs[i].data;
													if(data.length==386) {
														data=data.substr(2);
														_from ="0x"+ split64(data).substr(26);
														data=data.substr(64);
														_to ="0x"+split64(data).substr(26);
														data=data.substr(64);
														_msg ="0x"+split64(data).substr(26);
														data=data.substr(64);
															
														_value =(split64(data));
														data=data.substr(64);
														_base =(split64(data));
														data=data.substr(64);														
														if((_from.toLowerCase()==address_meterpoint.toLowerCase())||(_to.toLowerCase()==address_meterpoint.toLowerCase())) {
															var entry={};
															entry.sender=_from;
															entry.recipient=_to;
															entry.msg=_msg;
															entry.base=_base;
															entry.value=_value;
															entry.data=data;
															entry.blockNumber=logs[i].blockNumber;															
															entries.push(entry);
														}
													}
											}
											resolve2(entries);
									});
								});
							});
							return p2;
						};						
						resolve(instance);
			});
			return p1;
};
