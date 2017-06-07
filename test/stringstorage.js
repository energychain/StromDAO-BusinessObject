/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: StringStorage	 for OffChain Data', function() {
	var external_id = Math.random()*10000000; 
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var my_str = "C"+external_id;
	var imutable="";
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - RandomString#1:",my_str);
    
 
	describe('Store and retrieve String', function() {
	
		it('Save String and get Address', function(done) {
						node.stringstoragefactory().then( function(ssf) {
							ssf.build(my_str).then( function(tx_result) {	
									assert.equal(tx_result.length,42);
									imutable=tx_result;
									console.log("   - StringStorage",imutable); 
									done();
							});
						});
		});	
		it('Check value at Address', function(done) {
						node.stringstorage(imutable).then( function(stringstorage) {
							stringstorage.str().then( function(tx_result) {										
									assert.equal(tx_result.length,my_str.length);								
									done();
							});
						});
		});			
	});

	describe('Let String become Role 99', function() {
	
		it('Save String and get Address', function(done) {
						node.metaset(99).then( function(metaset) {
							var obj = {};
							obj.my_str = my_str;
							metaset.put(obj).then( function(tx_result) {								
									//console.log(tx_result);
									assert.equal(tx_result.length,42);
									done();
								
							});							
						});
		});	
		it('Check if String for Role 99 equals', function(done) {
						node.metaset(99).then( function(metaset) {
							var obj = {};
							obj.my_str = my_str;
							metaset.get(node.wallet.address).then( function(tx_result) {								
									var o=JSON.parse(tx_result);
									assert.equal(o.my_str,my_str);
									done();
								
							});							
						});
		});		
	});
});
