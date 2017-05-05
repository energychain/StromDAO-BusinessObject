/**
 * StromDAO Business Object
 * =========================================
 * Binding für den StromDAO Node zur Anbindung der Energy Blockchain und Arbeit mit den unterschiedlichen BC Objekten (SmartContracts)
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
const fs = require("fs");
var ethers = require('ethers');
var storage = require('node-persist');

module.exports = {
    Node:function(options) {
        parent = this;
		
		this._createNewPK = function() {		
		    var getRandomValues = require('get-random-values'); 
			var array = new Uint8Array(32);	
			
			var pk = ethers.utils.keccak256(getRandomValues(array));	
			
			return pk;
		}
		this._waitForTransaction = function(tx) {		
			return parent.rpcprovider.waitForTransaction(tx);
		}
		this._waitNextBlock = function(cb) {
			var block1=0;
			var interval = setInterval(function() {					
					parent.provider.getBlockNumber().then(function(blockNumber) {
													if(block1 == 0) block1=blockNumber;
													var block2=blockNumber;														
													if(block1!=block2) {
															clearInterval(interval);
															cb();
													}
											});
					}
			,1000);				
		}
		this._keepObjRef=function(address,contract_type) {
			if(typeof parent.objRef[contract_type]=="undefined") {
					parent.objRef[contract_type] = {};
			}
			if(typeof parent.objRef[address] == "undefined") {
				parent.objRef[address] = {type: contract_type };
				parent.objRef[contract_type][address]={ type: contract_type};
				storage.setItemSync("objRef",parent.objRef); 
			}					
		}
		
		this._keepHashRef=function(transaction) {
				storage.setItemSync(transaction.hash,transaction);
				return transaction.hash;
		}
		this.getRef=function(ref) {
				return storage.getItemSync(ref);
		}
        this._loadContract=function(address,contract_type,roles_address) {
			var abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
			if(address!="0x0") {				
				contract = new ethers.Contract(address, abi, this.wallet);
				parent._keepObjRef(address,contract_type);
			} else {
				// Deploy new?
			}
            return contract;
        }  
        
        this._deployContract=function(contract_type,roles_address) {
				// if we are in a test situation we will simply use a test deployment.
				
				var abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
			
				var p1 = new Promise(function(resolve, reject) { 	
					if(parent.options.testMode==true) { 
						if(contract_type=="StromDAO-BO.sol:DSO") resolve("0x0513f2B6E0a0a3A79288dC31a3dF714f7C8c4BA1");
						if(contract_type=="StromDAO-BO.sol:MPO") resolve("0xd5C3B4f181F20d4288877df1196882f23DE22098");
						if(contract_type=="StromDAO-BO.sol:Provider") resolve("0x6D0BC1446E8eA18D03A1b5122F59419339ED7D8b");
					} else {
					var bin = fs.readFileSync("smart_contracts/"+contract_type+".bin");
					var deployTransaction = ethers.Contract.getDeployTransaction("0x"+	bin, abi, roles_address);
					var sendPromise = parent.wallet.sendTransaction(deployTransaction);
					sendPromise.then(function(transaction) {
						parent._waitForTransaction(transaction.hash).then(function() {
								var address = ethers.utils.getContractAddress(transaction);																
									resolve(address);	
								});
						});
					}	
					
				});
				return p1;
		}  
		
		this._objInstance=function(obj_or_address,type_of_object) {
				var instance = {};
				instance.obj=obj_or_address;
				if(typeof obj != "object") {
					instance.obj = parent._loadContract(instance.obj,type_of_object);
				} 
				return instance;
		}
        
		this.reader = function(obj_or_address) {
			var instance=parent._objInstance(obj_or_address,'StromDAOReader');
			instance.pingReading = function(reading) {
					var p1 = new Promise(function(resolve, reject) { 
						instance.obj.pingReading(reading).then(function(o) {
							resolve(parent._keepHashRef(o));
						});
					});
					return p1;
			}
			return instance;
		}
		
        this.gwalink = function(obj_or_address) {			
			var gwalink=parent._objInstance(obj_or_address,'gwalink');
			
			var p1 = new Promise(function(resolve, reject) { 
					gwalink.obj.reader_in().then(
							function(o) { 
									gwalink.reader_in=parent.reader(o[0]);	
									
									gwalink.obj.reader_out().then(
										function(o) { 
												gwalink.reader_out=parent.reader(o[0]);
												resolve(gwalink);
										});
							});
			});
			return p1;
		}
		
		this.pdclearing = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'PDClearingStub');				
				instance.factory=function(_link,_mpid,_from,_to,_wh_microcent,_min_tx_microcent,_endure) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.PDfactory(_link,_mpid,_from,_to,_wh_microcent,_min_tx_microcent,_endure).then(function(o) {									
									parent._waitNextBlock(function() {											
										instance.obj.pds(parent.wallet.address).then(function(x) {												
												resolve2(x[0]);
										});										
									});
							});									
					});
					return p2;
				};
				resolve(instance);
			});
			return p1;
		}
		
		this.dso = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:DSO');						
				instance.approveConnection=function(_address,_base_from_time,_base_to_time,_base_powerIn,_base_powerOut)  {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveConnection(_address,_base_from_time,_base_to_time,_base_powerIn,_base_powerOut).then(function(o) {									
								parent._waitForTransaction(o.hash).then(function() {										
								 resolve2(parent._keepHashRef(o));						
								});												
							});									
					});
					return p2;
				};
				resolve(instance);
			});
			return p1;
		}
		
		this.mpo = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:MPO');						
				instance.approveMP=function(_meter,_role) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.approveMP(_meter,_role).then(function(o) {
								parent._waitForTransaction(o.hash).then(function() {										
								 resolve2(parent._keepHashRef(o));						
								});			
							});									
					});
					return p2;
				};
				instance.storeReading=function(_reading) {
					_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							
							instance.obj.storeReading(_reading).then(function(o) {	
								parent._waitForTransaction(o.hash).then(function() {								
								 resolve2(parent._keepHashRef(o));					
								});				
							});									
					});
					return p2;
				}
				instance.lastDelivery=function(_meterpoint) {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.lastDelivery(_meterpoint).then(function(o) {									
								 resolve2(o);									
							});									
					});
					return p2;
				}
				resolve(instance);
			});
			return p1;
		}
		
		this.provider = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Provider');
					instance.handleDelivery=function(_delivery) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.handleDelivery(_delivery).then(function(o) {
										parent._waitForTransaction(o.hash).then(function() {										
												 resolve2(parent._keepHashRef(o));						
												});	
								});
							});
							return p2;
					}
					instance.stromkonto=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.stromkonto().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					}
					resolve(instance);
			});
			return p1;
		}
		
		this.delivery = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Delivery');
					instance.owner=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.owner().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					}
					instance.power=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.deliverable_power().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					}
					instance.transferOwnership=function(owner) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.transferOwnership(owner).then(function(o) {
									parent._waitForTransaction(o.hash).then(function() {								
										resolve2(parent._keepHashRef(o));					
									});				
								});
							});
							return p2;
					}
					instance.includeDelivery=function(delivery) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.includeDelivery(delivery).then(function(o) {
									parent._waitForTransaction(o.hash).then(function() {								
										resolve2(parent._keepHashRef(o));					
									});				
								});
							});
							return p2;
					}					
					resolve(instance);
			});
			return p1;
		}
		

				
		this.roleLookup = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:RoleLookup');				
				instance.owner=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.owner().then(function(o) {									
																		
												resolve2(o);
										});																		
							});									
				
					return p2;
				};
				instance.roles=function(i) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.roles(i).then(function(o) {																											
												resolve2(o[0]);
										});																		
							});									
				
					return p2;
				};
				instance.setRelation=function(_role,_target) {					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setRelation(_role,_target).then(function(o) {
								parent._waitForTransaction(o.hash).then(function() {										
												 resolve2(parent._keepHashRef(o));						
												});																														
										});																		
							});													
					return p2;
				};
				resolve(instance);
			});
			return p1;
		}
		
		this.stromkonto = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 					
						var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Stromkonto');
						instance.addTx=function(_from,_to,_value,_base) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addTx(_from,_to,_value,_base).then(function(o) {
													parent._waitForTransaction(o.hash).then(function() {										
														resolve2(parent._keepHashRef(o));						
													});	
											});
								});
								return p2;
						}
						instance.balancesSoll=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceSoll(_address).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						}						
						resolve(instance);
			});
			return p1;
		}
		
		this.pdcontract = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 					
					var instance=parent._objInstance(obj_or_address,'PrivatePDcontract');
					instance.check = function() {
						var p1 = new Promise(function(resolve, reject) { 
								instance.obj.check().then(function(o) {
									resolve(parent._keepHashRef(o));	
								});
						});
						return p1;
					};
					instance.costSum = function() {
							
							var p1 = new Promise(function(resolve, reject) { 
									instance.obj.cost_sum().then(function(o) {
										resolve(o);	
									});
							});
							
							return p1;
							
							//return instance.obj.cost_sum();
					}
					resolve(instance);
			});
			return p1;
		}
		
		storage.initSync();
		
        if(typeof options.rpc == "undefined") options.rpc='http://app.stromdao.de:8081/rpc';
        
        
        
        var rpcprovider = new ethers.providers.JsonRpcProvider(options.rpc, 42);        
        
        if(typeof options.external_id !="undefined") {
              options.privateKey=storage.getItemSync("ext:"+options.external_id);      
              if(typeof options.privateKey=="undefined") {
                  this.options=options;
                  //this.wallet = new ethers.Wallet.createRandom(this.options);				  
                  options.privateKey=this._createNewPK();					  			  
                  storage.setItemSync("ext:"+options.external_id,options.privateKey);
              }
        } else
        if(typeof options.privateKey == "undefined") options.privateKey='0x1471693ac4ae1646256c6a96edf2d808ad2dc6b75df69aa2709c4140e16bc7c4';
        this.options=options;
        this.wallet = new ethers.Wallet(options.privateKey,rpcprovider);
        this.options.address = this.wallet.address;
        
        this.objRef = storage.getItemSync("objRef");
		if((typeof this.objRef == "undefined")||(typeof this.options.clearRefCache != "undefined")) {
				storage.setItemSync("objRef",{}); 
				this.objRef=storage.getItemSync("objRef");
		}
		this.rpcprovider=rpcprovider;
    }
};
