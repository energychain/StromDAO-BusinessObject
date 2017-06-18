/**
 * StromDAO Business Object
 * =========================================
 * [DE] Binding für den StromDAO Node zur Anbindung der Energy Blockchain und Arbeit mit den unterschiedlichen BC Objekten (SmartContracts)
 * [EN] Binding for StromDAO Node to the Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
const fs = require("fs");
//const sync = require("sync");
var ethers = require('ethers');
var srequest = require('sync-request');

if(typeof window == "undefined") {
var storage = require('node-persist');
} else {
var storage = {	
		initSync:function() {},
		getItemSync:function(key) {
				return window.localStorage.getItem(key);
		},
		setItemSync:function(key,value) {
				return window.localStorage.setItem(key,value);
		}
	};	
}
module.exports = {	
    Node:function(user_options) {
        parent = this;
        this._memcach=[];
        this._utils=ethers.utils;
		this._defaults = require("./Defaults.js").deployment;
		this._deployment = require("./Defaults.js").loadDefaults;
		/**
		 * Core Function to create a new key-pair.  
		 */
		this._createNewPK = function() {		
		    var getRandomValues = require('get-random-values'); 
			var array = new Uint8Array(32);	
			
			var pk = ethers.utils.keccak256(getRandomValues(array));	
			
			return pk;
		};
		
		/**
		 * Core Function to wait for a transaction to be processed
		 * @param Transaction hash to wait for 
		 */
		this._waitForTransaction = function(tx) {		
			return parent.rpcprovider.waitForTransaction(tx);
		};
		this._waitForTransactionKeepRef = function(o,resolve2) {		
			this._waitForTransaction(o.hash).then(function() {								
									resolve2(parent._keepHashRef(o));					
			});				
		};
		
		/**
		 * Core Function - Get latest Block Number in Energy Blockchain
		 */
		this._getBlockNumber=function() {
			return parent.rpcprovider.getBlockNumber();
		}
		this._waitNextBlock = function(cb) {
			var block1=0;
			var interval = setInterval(function() {					
					parent.rpcprovider.getBlockNumber().then(function(blockNumber) {
													if(block1 === 0) block1=blockNumber;
													var block2=blockNumber;														
													if(block1!=block2) {
															clearInterval(interval);
															cb();
													}
											});
					},1000);				
		};
		
		/**
		 * Keeps a reference of the object in local persitance store
		 */
		this._keepObjRef=function(address,contract_type) {
			if(typeof parent.objRef[contract_type]=="undefined") {
					parent.objRef[contract_type] = {};
			}
			if(typeof parent.objRef[address] == "undefined") {
				parent.objRef[address] = {type: contract_type };
				parent.objRef[contract_type][address]={ type: contract_type};
				storage.setItemSync("objRef",parent.objRef); 
			}					
		};	
		
		/** Stores Simple Labels for addresses
		 */
		 
		this._saveLabel=function(address_type,address) {				
				if(address_type.length<2) {address_type=address_type+" "+address.substring(5,10);}
				storage.setItemSync("label_"+address.toLowerCase(),address_type);
		} 
		this._label=function(address) {
				address=address.toLowerCase();
				var label = storage.getItemSync("label_"+address);
				if((typeof label =="undefined")||(label==null)) {
						label = "tbd "+address.substring(5,10);
				}				
				return label;
		}
		/**
		 * Keeps transaction receipt for in local persistance store (Key=Hash, Value=Receipt)
		 */
		this._keepHashRef=function(transaction) {
				storage.setItemSync(transaction.hash,transaction);
				return transaction.hash;
		};
		
		/**
		 * Retrieves a value fromm local persistance store (Key=>Value)
		 */
		this.getRef=function(ref) {
				return storage.getItemSync(ref);
		};
		
		/**
		 * Load a contract to be used in BO Instance
		 */
        this._loadContract=function(address,contract_type,roles_address) {
			
			var abi="";
			contract_type=contract_type.replace(":","_");
			if((typeof this._memcach[contract_type] != "undefined")&&(this._memcach[contract_type].length>10)) {
			 abi = 	JSON.parse(this._memcach[contract_type]);
			} else {
				if(typeof window == "undefined") {
					if(fs.existsSync("smart_contracts/"+contract_type+".abi")) {
							 abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
						} else {
							 abi = JSON.parse(fs.readFileSync("node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi"));
					}
				} else {
						console.log("Fetch","js/node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi");
						var raw = srequest('GET',"js/node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi");				   
						abi =JSON.parse(raw.body);
				}
				this._memcach[contract_type]=JSON.stringify(abi);
			}
			if(address!="0x0") {				
				contract = new ethers.Contract(address, abi, this.wallet);
				parent._keepObjRef(address,contract_type);
			} else {
				// Deploy new?
			}
			contract.abi=abi;
            return contract;
        };
        
        /**
         * Promise to retrieve general Owner() Function of SmartContracts
         */
        this._owner_promise = function(instance) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.owner().then(function(o) {										
										resolve2(o);
								});
							});
							return p2;
					};
					
		/**
		 * Deploy a new contract to the Energy Blockchain
		 */
        this._deployContract=function(contract_type,roles_address) {
				// if we are in a test situation we will simply use a test deployment.
				var abi="";
					contract_type=contract_type.replace(":","_");
					
				if(typeof window == "undefined") {
					if(fs.existsSync("smart_contracts/"+contract_type+".abi")) {
							 abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
						} else {
							 abi = JSON.parse(fs.readFileSync("node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi"));
					}
				} else {
					console.log("Fetch","js/node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi");
					var raw = srequest('GET',"js/node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi");				   
					abi =JSON.parse(raw.body);
				}
				
				var p1 = new Promise(function(resolve, reject) { 	
					if(parent.options.testMode===true) { 
						
						resolve(parent.options.contracts[contract_type]);						
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
		};
		
		/**
		 * Get generic instance of a smart contract as object
		 */
		this._objInstance=function(obj_or_address,type_of_object) {
				var instance = {};
				instance.obj=obj_or_address;
				if(typeof obj != "object") {
					instance.obj = parent._loadContract(instance.obj,type_of_object);
				} 
				return instance;
		};
		/**
		 * Binding for Log Cache from BC
		 */		
		this._txlog = function(address,blockNumber) {
			var p1 = new Promise(function(resolve, reject) { 	
					var stored = parent.storage.getItemSync("log_"+address+"_"+blockNumber);
					if((typeof stored == "undefined")||(stored==null)) {		
						parent.wallet.provider.getLogs({address:address,fromBlock:blockNumber,toBlock:blockNumber}).then(function(logs) {		
								parent.storage.setItemSync("log_"+address+"_"+blockNumber,JSON.stringify(logs));				
								resolve(logs);
						});										
					} else {
							resolve(JSON.parse(stored));
					}			
			});
			return p1;	
		}

		/**
		 * Bridge to DSO Smart Contract
		 */
		this.dso = require("./DSO.js").dso;
		
		/**
		 * Bridge to MPO Smart Contract
		 */
		this.mpo = require("./MPO.js").mpo;
		
		/**
		 * Bridge to MPR Smart Contract
		 */
		this.mpr = require("./MPR.js").mpr;
		
		/**
		 * Bridge to MP Clearing (Mieterstrom, Kostenverrechnung..)
		 */
		 
		
		this.mpset = require("./MPSet.js").mpset;
		this.mprset = require("./MPRSet.js").mprset;
		this.mpsetfactory = require("./MPSetFactory.js").factory;
		this.mprsetfactory = require("./MPRSetFactory.js").factory;
		this.mprdecoratefactory = require("./MPRDecorateFactory.js").factory;
		this.settlementfactory = require("./SettlementFactory.js").factory;
		this.stromkontoproxyfactory = require("./StromkontoProxyFactory.js").factory;
		this.clearingfactory = require("./ClearingFactory.js").factory;
		this.clearing = require("./Clearing.js").clearing;
		this.settlement = require("./Settlement.js").settlement;
		this.txcache = require("./TXcache.js").txcache;
		this.mprdecorate = require("./MPRDecorate.js").mprdecorate;
		this.directclearing=require("./DirectClearing.js").directclearing;
		
		/**
		 * Bridge to DirectConnectionFactory Smart Contract
		 */
		this.directconnectionfactory = require("./DirectConnectionFactory.js").directconnectionfactory;
		
		/**
		 * Bridge to DirectChargingFactory Smart Contract
		 */
		this.directchargingfactory = require("./DirectChargingFactory.js").directchargingfactory;
		
		/**
		 * Bridge to DirectChargingFactory Smart Contract
		 */
		this.directbalancinggroupfactory = require("./DirectBalancingGroupFactory.js").blgfactory;
		
		/**
		 * Bridge to DirectCharging Smart Contract
		 */
		this.directcharging = require("./DirectCharging.js").directcharging;
		
		/**
		 * Bridge to DirectCharging Smart Contract
		 */
		this.directconnection = require("./DirectConnection.js").directconnection;
		/**
		 * Bridge to DirectBalancigGroup Smart Contract
		 */
		this.blg = require("./BLG.js").blg;
		
		/**
		 * Bridge to Provider Smart Contract
		 */
		this.provider = require("./Provider.js").provider;
		
		/**
		 * Bridge to DeliveryMux Smart Contract
		 */
		this.deliverymux = require("./DeliveryMux.js").provider;
		
		/**
		 * Bridge to Billing Smart Contract
		 */
		this.billing = require("./Billing.js").billing;
		
		/**
		 * Bridge to Delivery Smart Contract
		 */
		this.delivery = require("./Delivery.js").delivery;
		
		/**
		 * Bridge to Stromkonto Smart Contract
		 */
		this.stromkonto = require("./Stromkonto.js").stromkonto;		
		this.stromkontoproxy = require("./StromkontoProxy.js").stromkontoproxy;	
		/**
		 * Bridge to RoleLookup Smart Contract
		 */
		this.roleLookup = require("./RoleLookup").rolelookup;
		
		/**
		 * Bridge to String Storage (Reader)
		 */
		 this.stringstorage = require("./StringStorage").stringstorage;		
		 
		 /**
		  * Bridge to Meta Data Publish
		  */
		  
		 this.metaset = require("./MetaPublish").metaset;
		 
		 /**
		 * Bridge to String Storage (Factory)
		 */
		 this.stringstoragefactory = require("./StringStorageFactory").stringstoragefactory;		
		
		 storage.initSync();
		
		this.storage=storage;
		
		var options=this._defaults(user_options);
        
		if(typeof web3 != "undefined") {
			// set default provider to same host as we are comming from (if available)
			var rpcprovider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8080/rpc", 42);
			if(typeof window != "undefined") {
					var rpcprovider = new ethers.providers.JsonRpcProvider(location.origin+"/rpc", 42);
			}
		} else { 
			var rpcprovider = new ethers.providers.JsonRpcProvider(options.rpc, 42);        
		}
        if(typeof options.external_id !="undefined") {
			if(typeof options.privateKey !="undefined") {
			} else {
              options.privateKey=storage.getItemSync("ext:"+options.external_id);
			}
              if((typeof options.privateKey=="undefined")||(options.privateKey==null)) {
				  
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
        this._saveLabel('EXT '+options.external_id,this.wallet.address);		
		
        this.objRef = storage.getItemSync("objRef");
		if((typeof this.objRef == "undefined")||(typeof this.options.clearRefCache != "undefined")||(typeof window != "undefined")) {
				storage.setItemSync("objRef",{}); 
				this.objRef={};
		}
		this.rpcprovider=rpcprovider;
		this.options=this._deployment(this.options);
		if(typeof sync != "undefined") {
			sync(function() {
				var provider = ethers.providers.getDefaultProvider();
				provider.getBlockNumber();
				
			});
		}
    }
};
