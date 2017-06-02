/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: StringStorag for OffChain Data', function() {
	var external_id = Math.random()*10000000; 
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var my_str = "C"+external_id;
	var imutable="";
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - RandomString#1:",my_str);
    
    
	describe('Storage an retrieve String', function() {
	
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
});
