/**
  StromDAO Business Object - Consensus testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Consensus System for Energy Blockchain	', function() {
	this.timeout(240000);
	var external_id = Math.random()*10000000; 
	var external_id_alternate = Math.random()*10000000; 
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});

	var known_rolelookup = '0xbc723c385dB9FC5E82e301b8A7aa45819E4c3e8B';
	var my_reading_1=Math.round(Math.random()*10000000);
	var my_reading_2=Math.round(my_reading_1+(Math.random()*100+1));
	var my_reading_3=Math.round(my_reading_2+(Math.random()*100+1));
	
	var my_mpo ='';
	var my_dso ='';
	var role_mpo='';
	var role_dso='';

    var delivery_1='';
    var delivery_2='';
		
	console.log("  - MyAddress:",node.wallet.address);

	describe('Usecase: Connect new Meterpoint to Consensus System', function() {
		it('Test Ownership of Consensus (deployed as prerequesit)', function(done) {			
				node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.owner().then( function(owner) {						
							assert.equal(owner[0].toString(),"0x00D44194A83Affb40dB9DFded2ebb62aBE711F56");
							done();
							});
						});		
		});
		it('Ensure DSO Contract exists', function(done) {
				node._deployContract('StromDAO-BO.sol:DSO',known_rolelookup).then(function(address) {
								//console.log("Deployed",address);
								assert.equal(address.length,42);
								my_dso=address;
								console.log("  - My DSO:",my_dso);
								done();
				});
		});	
		it('Ensure MPO Contract exists', function(done) {
				node._deployContract('StromDAO-BO.sol:MPO',known_rolelookup).then(function(address) {
								
								assert.equal(address.length,42);
								my_mpo=address;
								console.log("  - My MPO:",my_mpo);
								done();
				});
		});	
		it('Test if consensus is aware of MPO Role (address)', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.roles(1).then( function(role_address) {	
									assert.equal(role_address.length,42);
									role_mpo=role_address;
									done();
							});
						});
		});	
		it('Test if consensus is aware of DSO Role (address)', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.roles(2).then( function(role_address) {	
									assert.equal(role_address.length,42);
									role_dso=role_address;
									done();
							});
						});
		});		
		it('Let MPO become my MPO by setting contract in roles', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.setRelation(role_mpo,my_mpo).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Let DSO become my DSO by setting contract in roles', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.setRelation(role_dso,my_dso).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
	
		
		it('@MPO: Approve myself as MeterPoint (Role 4)', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.approveMP(node.wallet.address,4).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		
		it('@DSO: Approve myself as Connection', function(done) {
						node.dso(my_dso).then( function(dso) {
							dso.approveConnection(node.wallet.address,0,0,1000000,1000000).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
	
	});
	describe('Usecase:Process sequential Meterpoint readings', function() {	
		it('Set my reading 1 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_1).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		
		it('Set my reading 2 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		
		it('Retrieve my last Delivery', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							
							mpo.lastDelivery(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									delivery_1=tx_result[0];
									done();
							});
						});
		});
		
		it('Check that I am owner of last Delivery', function(done) {
						node.delivery(delivery_1).then( function(delivery) {
							
							delivery.owner().then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									assert.equal(tx_result[0],node.wallet.address);									
									done();
							});
						});
		});	
		it('Set my reading 3 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_3).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Retrieve my last Delivery - should be different to first', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							
							mpo.lastDelivery(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									delivery_2=tx_result[0];
									assert.notEqual(delivery_1,delivery_2);
									done();
							});
						});
		});
	});			
});
