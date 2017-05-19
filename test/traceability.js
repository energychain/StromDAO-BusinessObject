/**
  StromDAO Business Object - MPReading (IoT) testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Traceability of Generation', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node_in = new StromDAONode.Node({external_id:external_id,testMode:true});
	var node_out = new StromDAONode.Node({external_id:external_id+1,testMode:true});
	
	var known_rolelookup = '0x7B4B8A73f08cc85De6e183deC814077347e26dAF';

	var reading_in_1=Math.round(Math.random()*10000000);
	var reading_in_2=Math.round(reading_in_1+(Math.random()*100+1));
	var reading_in_3=Math.round(reading_in_2-(Math.random()*100+1));	

    var reading_out_1=Math.round(Math.random()*10000000);
	var reading_out_2=Math.round(reading_out_1+(Math.random()*100+1));
	var reading_out_3=Math.round(reading_out_2-(Math.random()*100+1));	

    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress Feed In :",node_in.wallet.address);
	console.log("  - MyAddress Feed Out :",node_out.wallet.address);

    console.log("  - Reading In #1:",reading_in_1);
    console.log("  - Reading In #2:",reading_in_2);
    console.log("  - Reading In #3:",reading_in_3);
    
    console.log("  - Reading Out #1:",reading_out_1);
    console.log("  - Reading Out #2:",reading_out_2);
    console.log("  - Reading Out #3:",reading_out_3);
    
	describe('Scenario setup', function() {
	
		it('@MPO: Approve Node_Out as MeterPoint (Role 5)', function(done) {
						node_out.mpo().then( function(mpo) {
							mpo.approveMP(node_out.wallet.address,5).then( function(tx_result) {									
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		

		it('@MPO: Approve Node_IN as MeterPoint (Role 4)', function(done) {
						node_in.mpo().then( function(mpo) {
							mpo.approveMP(node_in.wallet.address,4).then( function(tx_result) {									
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		
		
		it('@DSO: Approve Node_Out as Connection', function(done) {
						node_out.dso().then( function(dso) {
							dso.approveConnection(node_out.wallet.address,1000000).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('@DSO: Approve Node_In as Connection', function(done) {
						node_in.dso().then( function(dso) {
							dso.approveConnection(node_in.wallet.address,1000000).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Let MPO become NODE_IN by setting contract in roles', function(done) {
						node_in.roleLookup(known_rolelookup).then( function(roleLookup) {							
							roleLookup.setRelation(1,parent.options.contracts["StromDAO-BO.sol_MPO"]).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});			
		it('Let MPO become NODE_OUT by setting contract in roles', function(done) {
						node_out.roleLookup(known_rolelookup).then( function(roleLookup) {							
							roleLookup.setRelation(1,parent.options.contracts["StromDAO-BO.sol_MPO"]).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Let TestProvider become NODE_IN Provider by setting contract in roles', function(done) {
				node_in.roleLookup(known_rolelookup).then( function(roleLookup) {
					roleLookup.setRelation(3,parent.options.contracts["StromDAO-BO.sol_Provider"]).then( function(tx_result) {	
							assert.equal(tx_result.length,66);
							done();
					});
				});
		});		
		it('Let TestProvider become NODE_OUT Provider by setting contract in roles', function(done) {
				node_out.roleLookup(known_rolelookup).then( function(roleLookup) {
					roleLookup.setRelation(3,parent.options.contracts["StromDAO-BO.sol_Provider"]).then( function(tx_result) {	
							assert.equal(tx_result.length,66);
							done();
					});
				});
		});	
		it('Let Provider accept deliveries from NODE_IN as sender with cost per day 0 and cost per energy 2', function(done) {
						node_in.provider().then( function(provider) {							
							provider.approveSender(node_in.wallet.address,true,0,2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});		
		it('Let Provider accept deliveries from NODE_OUT as sender with cost per day 0 and cost per energy 2', function(done) {
						node_out.provider().then( function(provider) {							
							provider.approveSender(node_out.wallet.address,true,0,2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});								
		it('@Provider: Settle Base Delivery', function(done) {
						node_in.provider().then( function(provider) {
							provider.deliveryMux().then( function(dm_adr) {	
									node_in.deliverymux(dm_adr).then( function(dmux) {
											dmux.settleBaseDeliveries().then( function(tx_result) {
												assert.equal(tx_result.length,66);
												done();
											});										
									});									
							});
						});
		});	
			
	});
});	
