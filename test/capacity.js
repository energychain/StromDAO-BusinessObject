/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO:Capacity Utilization Test', function() {
	var external_id = Math.random()*10000000; 
	var external_id="TEST";	
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var cut="0x3CC3Ed2001e1938498591164E3B1d9Cc268ae5e7";
	var imutable="";
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);    
   

    it('Create Capacity Utilization', function(done) {
						node.cutokenfactory("0xf0AF273DA2aBdFac56B3760F527d4Dd515968bab").then( function(ssf) {							
							ssf.build("0x0000000000000000000000000000000000000008",node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result.length,42);									
									console.log("   - CUToken",tx_result); 
									cut=tx_result;
									done();
							});
						});
	});
	/*
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
	*/
});
