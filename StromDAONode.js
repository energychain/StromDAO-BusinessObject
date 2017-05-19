/**
 * StromDAO Business Object
 * =========================================
 * [DE] Binding für den StromDAO Node zur Anbindung der Energy Blockchain und Arbeit mit den unterschiedlichen BC Objekten (SmartContracts)
 * [EN] Binding for StromDAO Node to the Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
const fs = require("fs");
var ethers = require('ethers');
var storage = require('node-persist');

module.exports = {
	
    Node:function(user_options) {
        parent = this;
        
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
			
			if(fs.existsSync("smart_contracts/"+contract_type+".abi")) {
					 abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
				} else {
					 abi = JSON.parse(fs.readFileSync("node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi"));
			}
			
			if(address!="0x0") {				
				contract = new ethers.Contract(address, abi, this.wallet);
				parent._keepObjRef(address,contract_type);
			} else {
				// Deploy new?
			}
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
					
				if(fs.existsSync("smart_contracts/"+contract_type+".abi")) {
					abi = JSON.parse(fs.readFileSync("smart_contracts/"+contract_type+".abi"));
				} else if(fs.existsSync("node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi")) {
					abi = JSON.parse(fs.readFileSync("node_modules/stromdao-businessobject/smart_contracts/"+contract_type+".abi"));
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
		
		/**
		 * Bridge to RoleLookup Smart Contract
		 */
		this.roleLookup = require("./RoleLookup").rolelookup;
		
						
		
		storage.initSync();
		this.storage=storage;
		
		var options=this._defaults(user_options);
        

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
		this.options=this._deployment(this.options);
    }
};
