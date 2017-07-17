/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: RSA Cryption', function() {
	var external_id = Math.random()*10000000; 
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var my_str = "C"+external_id;
	var imutable="";
	var encoded="";
    var stringstorage = "";
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - RandomString#1:",my_str);
    console.log("  - Public Node Key",node.nodeRSAPublicKey);
    console.log("  - Public EXTid Key",node.RSAPublicKey);
    console.log("  - Private Node Key",node.nodeRSAPrivateKey);
    console.log("  - Private EXTid Key",node.RSAPrivateKey);
    
    
	describe('Work with Exitid Key', function() {
	
		it('Encrypt to Extid', function(done) {
				var extkey = node._key(node.RSAPublicKey);
				console.log("MaxMessage Size",extkey.getMaxMessageSize());
				encoded = extkey.encrypt(my_str);				
				done();
		});	
		it('Decrypt with Extid', function(done) {				
				var extkey = node._key(node.RSAPrivateKey);
				console.log("Empty",extkey.isEmpty());			
				console.log("Public",extkey.isPublic());
				var decoded = extkey.decrypt(encoded);
				assert.equal(decoded,my_str);	
				done();
		});	
		it('Store Pubkey in StringStorage', function(done) {	
				node.stringstoragefactory().then( function(ssf) {
							ssf.build(node.RSAPublicKey).then( function(tx_result) {	
									assert.equal(tx_result.length,42);									
									console.log("   - StringStorage",tx_result); 
									stringstorage=tx_result;
									done();
							});
				});								
		});	
		it('Assign Pubkey in RoleLookup', function(done) {	
				node.roleLookup().then( function(roleLookup) {
					roleLookup.setRelation(101,stringstorage).then( function(tx_result) {	
							assert.equal(tx_result.length,66);
							done();
					});
				});						
		});	
		it('Lookup Stringstorage', function(done) {	
				node.roleLookup().then( function(roleLookup) {
					roleLookup.relations(node.wallet.address,101).then( function(tx_result) {	
							assert.equal(tx_result,stringstorage);
							done();
					});
				});						
		});		
		it('Retrieve Pubkey from Stringstorage', function(done) {	
						node.stringstorage(stringstorage).then( function(ss) {
							ss.str().then( function(tx_result) {										
									assert.equal(node.RSAPublicKey,tx_result);								
									done();
							});
						});				
		});		 
	});

});
