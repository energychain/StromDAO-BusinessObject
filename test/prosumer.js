/**
  StromDAO Business Object - MPReading/DirectConnection (IoT) testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Prosumer Info', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node_in = new StromDAONode.Node({external_id:external_id,testMode:true});
	var node_out = new StromDAONode.Node({external_id:external_id+1,testMode:true});
	
	var known_rolelookup = '0x0000000000000000000000000000000000000006';

    var my_connection = "";
    var my_charging = "";
    var my_stromkonto = "";
    
    
	describe('Retrieve Info Array', function() {
	
		it('Fixed Prosumer Konto Info', function(done) {
						node_out.prosumer('0xDF8F234f81A27A22694229B32B11432Ea62893E7').then( function(prosumer) {
							prosumer.konto().then(function(t) {								
									//console.log(t);
									assert.notEqual(t.soll,0);
									assert.notEqual(t.history.length,0);										
									done();
							});
						});
		});		
		it('Fixed Connection Info', function(done) {
						node_out.prosumer('0xDF8F234f81A27A22694229B32B11432Ea62893E7').then( function(prosumer) {
							prosumer.smpc().then(function(t) {																	
									assert.equal(t.meterpoint.length,42);
									assert.equal(t.account.length,42);
									assert.notEqual(t.last_reading,0);	
									assert.notEqual(t.energyCost,0);										
									assert.notEqual(t.state,0);
									done();
							});
						});
		});	
	});	
});	
