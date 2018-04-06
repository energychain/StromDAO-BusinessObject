/**
  StromDAO Business Object - SPV testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

console.log("STROMDAO - Special Purpose Vehilce for Hybrid Power Market");
console.log("-----------------------------------------------------------");
console.log("Storyline:");
console.log("This sample case illustrates how to do a community based");
console.log("invest into a solar plant and mange this via energy ");
console.log("blockchain. All tests get issued live as the story goes.");
console.log("-----------------------------------------------------------");

var spv_address="";
var owner_id = "SPV_"+Math.random()*10000000; 
var owner_address="";

var investor_id = "SPV_"+Math.random()*10000000;
var investor_address="";

var investor_id2 = "SPV_"+Math.random()*10000000;
var investor_address2="";
	
describe('Setup Owner Role for Hybrid Power Market', function() {
	this.timeout(300000);
	
	var node_owner = {};
	var known_rolelookup = '0x0000000000000000000000000000000000000006';
		
	it('Create a new entity that takes role of project owner', function(done) {		
		node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});								
		assert.equal(node_owner.wallet.address.length,42);
		console.log("> Address (Owner)",node_owner.wallet.address);
		owner_address=node_owner.wallet.address;
		done();							
	});				
	
    it('Use SPV Factory to create SPV entity ', function(done) {		
		node_owner.spvfactory().then(function(spvf) {
			 spvf.build("0x19BF166624F485f191d82900a5B7bc22Be569895","Unit Test").then(function(o) {
					spv_address=o;
					assert.equal(spv_address.length,42);	
					console.log("> Address (SPV)",spv_address);
					done();	
				});
		});
	});				
	
	it('As Owner: Allow funding', function(done) {				
		node_owner.spv(spv_address).then(function(spv) {			 
			 spv.allowFunding().then(function(o) {											
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	
	it('As Owner: Do initial funding of 100', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.fund(100).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	it('SPV total funded is 100', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.totalSupply().then(function(o) {										
					assert.equal(o,100);							
					done();	
				});
		});
	});		
});	
	
describe('Become second investor', function() {
	this.timeout(300000);
	var node_investor = {};
	var known_rolelookup = '0x0000000000000000000000000000000000000006';
		
	it('Create a new entity that takes role of second Investor', function(done) {		
		node_investor = new StromDAONode.Node({external_id:investor_id,testMode:true});						
		assert.equal(node_investor.wallet.address.length,42);
		investor_address=node_investor.wallet.address;
		console.log("> Address (Investor)",node_investor.wallet.address);
		done();							
	});		
	
	it('As Investor: Do funding of 200', function(done) {		
		node_investor.spv(spv_address).then(function(spv) {
			 spv.fund(200).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});
	});
	
	it('SPV total funded is 300', function(done) {		
		node_investor.spv(spv_address).then(function(spv) {
			 spv.totalSupply().then(function(o) {										
					assert.equal(o,300);							
					done();	
				});
		});
	});	
	it('- owner has 100', function(done) {		
		node_investor.spv(spv_address).then(function(spv) {
			 spv.balanceOf(owner_address).then(function(o) {										
					assert.equal(o,100);							
					done();	
				});
		});
	});	
	it('- Investor has 200', function(done) {		
		node_investor.spv(spv_address).then(function(spv) {
			 spv.balanceOf(investor_address).then(function(o) {										
					assert.equal(o,200);							
					done();	
				});
		});
	});		
});

describe('Finish invest phase - spend funds.', function() {
	this.timeout(300000);
	
	it('Re-Open project owner', function(done) {		
		node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});								
		assert.equal(node_owner.wallet.address,owner_address);		
		done();							
	});	
	it('Disallow Funding', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.disallowFunding().then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});					
	});	
	it('As Owner: Try another funding of 50 - should now be earning', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.fund(50).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	it('Check if funding is still 300', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.totalSupply().then(function(o) {										
					assert.equal(o,300);							
					done();	
				});
		});
	});	
	it('Spend 270', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.spend(270).then(function(o) {										
					assert.equal(o.length,66);							
					done();	
				});
		});
	});	
	it('Check if funding is still 300', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.totalSupply().then(function(o) {										
					assert.equal(o,300);							
					done();	
				});
		});
	});	
	it('As Owner: Book earning of 150', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earn(150).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	it('Check if earning is now 200', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earnings().then(function(o) {										
					assert.equal(o,200);							
					done();	
				});
		});
	});	
});
describe('Do metered earning (Earn as soon as meter reading is available).', function() {
	this.timeout(300000);
	node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});		
	it('Set price per reading unit to 10', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.meteredPrice(10).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});					
	});	
	it('Set initial reading to 200', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.meteredEarn(200).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});					
	});
	it('Set second reading to 211', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.meteredEarn(211).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});					
	});
	it('Check if earning is now 310 (110 new)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earnings().then(function(o) {										
					assert.equal(o,310);							
					done();	
				});
		});
	});	
});
describe('Add another investor and transfer funds from owner to new investor', function() {
	this.timeout(300000);
	it('Create a new entity that takes role of second Investor', function(done) {		
		node_investor2 = new StromDAONode.Node({external_id:investor_id2,testMode:true});						
		assert.equal(node_investor2.wallet.address.length,42);
		investor_address2=node_investor2.wallet.address;
		console.log("> Address (Investor2)",node_investor2.wallet.address);
		done();							
	});	
	it('Re-Open project owner', function(done) {		
		node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});								
		assert.equal(node_owner.wallet.address,owner_address);		
		done();							
	});
	it('Transfer 13 funds to new investor', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.transfer(investor_address2,13).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				}).catch(function(e) {console.log("Error",e);});
		});									
	});	
	it('SPV total funded is 300', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.totalSupply().then(function(o) {										
					assert.equal(o,300);							
					done();	
				});
		});
	});	
	it('- owner has 87', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.balanceOf(owner_address).then(function(o) {										
					assert.equal(o,87);							
					done();	
				});
		});
	});	
	it('- Investor has 200', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.balanceOf(investor_address).then(function(o) {										
					assert.equal(o,200);							
					done();	
				});
		});
	});		
	it('- Second Investor has 13', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.balanceOf(investor_address2).then(function(o) {										
					assert.equal(o,13);							
					done();	
				});
		});
	});			
});
describe('Sell (Exchange) Funds for cash', function() {
	this.timeout(300000);
	var node_owner = {};
	it('Re-Open project owner', function(done) {		
		node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});								
		assert.equal(node_owner.wallet.address,owner_address);		
		done();							
	});
	it('As Owner: Book earning of 290', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earn(290).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	it('Check if earning is now 600 (290 new)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earnings().then(function(o) {										
					assert.equal(o,600);							
					done();	
				});
		});
	});	
	it('Calculate exchange Rate (should be 600 earned / 300 funded = 2)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
				spv.totalSupply().then(function(o) {										
					assert.equal(o,300);							
					done();	
				});
		});		
	});	
	it('Sell 10 funds to investor1 for 20 earnings (=payout)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.sell(investor_address,10,20).then(function(o) {						
					assert.equal(o.length,66);							
					done();	
				});
		});
	});
	it('Check if earning is now 580 (20 less)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.earnings().then(function(o) {										
					assert.equal(o,580);							
					done();	
				});
		});
	});	
	it('Check if total funds is now 290 (10 less)', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
				spv.totalSupply().then(function(o) {										
					assert.equal(o,290);							
					done();	
				});
		});		
	});	
	it('- Investor has 190', function(done) {		
		node_owner.spv(spv_address).then(function(spv) {
			 spv.balanceOf(investor_address).then(function(o) {										
					assert.equal(o,190);							
					done();	
				});
		});
	});		
});
describe('Validate Stromkonto Consensus', function() {
	this.timeout(300000);
	var node_owner = {};
	it('Re-Open project owner', function(done) {		
		node_owner = new StromDAONode.Node({external_id:owner_id,testMode:true});								
		assert.equal(node_owner.wallet.address,owner_address);		
		done();							
	});
	it('- SPV has liabilities of 290', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesSoll(spv_address).then(function(o) {						
					assert.equal(o,290);							
					done();	
				});
		});
	});
	it('- SPV has savings of 900', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesHaben(spv_address).then(function(o) {						
					assert.equal(o,900);							
					done();	
				});
		});
	});	
	it('- Owner has liabilities of 700', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesSoll(owner_address).then(function(o) {						
					assert.equal(o,700);							
					done();	
				});
		});
	});
	it('- Owner has savings of 270', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesHaben(owner_address).then(function(o) {						
					assert.equal(o,270);							
					done();	
				});
		});
	});		
	it('- Investor has liabilities of 200', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesSoll(investor_address).then(function(o) {						
					assert.equal(o,200);							
					done();	
				});
		});
	});
	it('- Investor has savings of 20', function(done) {		
		node_owner.stromkonto("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			 sko.balancesHaben(investor_address).then(function(o) {						
					assert.equal(o,20);							
					done();	
				});
		});
	});	
});	
