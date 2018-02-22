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

