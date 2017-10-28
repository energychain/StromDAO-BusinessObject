/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Bulk/QuickLoad Test', function() {
	var external_id = Math.random()*10000000; 
	var external_id="TEST";	
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var sko="0x3CC3Ed2001e1938498591164E3B1d9Cc268ae5e7";
	var imutable="";
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);    
   
   /* 
    it('Create StromkontoProxy', function(done) {
						node.stromkontoproxyfactory().then( function(ssf) {
							ssf.build().then( function(tx_result) {	
									assert.equal(tx_result.length,42);									
									console.log("   - Stromkonto",tx_result); 
									sko=tx_result;
									done();
							});
						});
	});
	*/	
     it('Build Batch', function(done) {
						node.stromkontoproxy(sko).then( function(instance) {
							var ps = [];
							var i=0;
							var f1=instance.obj.addTx(node.wallet.address,node.wallet.address,i++,i+1);
							var f2=instance.obj.addTx(node.wallet.address,node.wallet.address,i++,i+1);
						
							setInterval(function() {
							console.log(f1,f2);
							},1000);
							
						});
	});	
});
