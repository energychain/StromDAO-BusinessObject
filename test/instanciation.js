/**
  Core Test for StromDAO Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('Core', function() {
	this.timeout(60000);
	
	var known_gwalink = '0x119AA4A3C2C7287f99FCBB41C5a78a8Dc15d1338';
	
	describe('Instantiation', function() {
    it('Same external ID should provide same wallet address', function() {
			external_id = Math.random()*10000000; 
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			var address1 = node.options.address;
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			var address2 = node.options.address;
			
			assert.equal(address1,address2);
     
   });
    it('Different external ID should provide different wallet address', function(done) {
			external_id = Math.random()*10000000; 
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			var address1 = node.options.address;
			var pk1 = node.options.privateKey;
			
			external_id++; 
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			var address2 = node.options.address;
			var pk2 = node.options.privateKey;
						
			assert.notEqual(address1,address2);
			assert.notEqual(pk1,pk2);
			done();
   });   
   it('Blockchain Status available (Block#>0)', function(done) {
			external_id = Math.random()*10000000; 
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			node.provider.getBlockNumber().then(function(blockNumber) {
						assert.notEqual(blockNumber,0);	
						done();						
			});
   });
   it('Writing TX increases Block#', function(done) {
			external_id = Math.random()*10000000; 
			
			var node = new StromDAONode.Node({external_id:external_id});
			
			node.provider.getBlockNumber().then(function(blockNumber) {
				var block1=blockNumber;
				
				node.gwalink(known_gwalink).then(
					function(gwalink) {
							var reader_in = gwalink.reader_in;
							reader_in.pingReading(Math.round(external_id)).then(function(o) {
									var interval = setInterval(function() {
										node.provider.getBlockNumber().then(function(blockNumber) {
												var block2=blockNumber;													
												if(block1!=block2) {
												clearInterval(interval);
												done(); 
												}
										});
									}
									,1000);
							});
					});
			});
   });
  });
});
