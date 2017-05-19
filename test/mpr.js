/**
  StromDAO Business Object - MPReading (IoT) testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Meter Point Reading (IoT) for Energy Blockchain	', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node = new StromDAONode.Node({external_id:external_id,testMode:true});

	var known_rolelookup = '0x0000000000000000000000000000000000000006';

	var my_reading_1=Math.round(Math.random()*10000000);
	var my_reading_2=Math.round(my_reading_1+(Math.random()*100+1));
	var my_reading_3=Math.round(my_reading_2-(Math.random()*100+1));	

    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - Reading#1:",my_reading_1);
    console.log("  - Reading#2:",my_reading_2);
    console.log("  - Reading#3:",my_reading_3);
    
	describe('Usecase: Connect new Meterpoint to Consensus System', function() {
	
		it('Set my reading #1 according to MPR contract', function(done) {
						node.mpr().then( function(mpr) {
							mpr.storeReading(my_reading_1).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Get my reading #1', function(done) {
						node.mpr().then( function(mpr) {
							mpr.readings(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result.power.toString(),my_reading_1);
									done();
							});
						});
		});	
		it('Set my reading #2 (higher than #1)', function(done) {
						node.mpr().then( function(mpr) {
							mpr.storeReading(my_reading_2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Get my reading #2', function(done) {
						node.mpr().then( function(mpr) {
							mpr.readings(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result.power.toString(),my_reading_2);
									done();
							});
						});
		});	
		it('Set my reading #3 (lower than #2)', function(done) {
						node.mpr().then( function(mpr) {
							mpr.storeReading(my_reading_2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Get my reading #3 (should stil be #2)', function(done) {
						node.mpr().then( function(mpr) {
							mpr.readings(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result.power.toString(),my_reading_2);
									done();
							});
						});
		});			
	});
});	
