/**
  StromDAO Business Object - Sign and Verify using Private Key and Ethereum Address
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Prosumer Info', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node_in = new StromDAONode.Node({external_id:external_id,testMode:true});
	var node_out = new StromDAONode.Node({external_id:external_id+1,testMode:true});
	
	var known_rolelookup = '0x0000000000000000000000000000000000000006';

    var message = "";
    var signed_message = "";
    var my_stromkonto = "";
    
    
	describe('Sign Message', function() {	
		it('Sign Message', function(done) {
			signed_message=node_in.sign(message);		
			done();
		});		
		it('Verify Message', function(done) {
			verify_from=node_in.verify(signed_message);			
			assert.equal(verify_from,node_in.wallet.address);
			done();
		});					
		it('Verify Different Account', function(done) {
			verify_from=node_out.verify(signed_message);			
			assert.equal(verify_from,node_in.wallet.address);
			done();
		});					
		it('Sign Message', function(done) {
			signed_message=node_out.sign(message);		
			done();
		});		
		it('Verify Message', function(done) {
			verify_from=node_in.verify(signed_message);			
			assert.equal(verify_from,node_out.wallet.address);
			done();
		});					
		it('Verify Different Account', function(done) {
			verify_from=node_out.verify(signed_message);			
			assert.equal(verify_from,node_out.wallet.address);
			done();
		});					
	});	
});	
