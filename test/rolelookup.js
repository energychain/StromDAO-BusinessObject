/**
  Basic RoleLookup Contract testing. 
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('RoleLookup', function() {
	this.timeout(240000);
	var external_id = Math.random()*10000000; 
	var node = new StromDAONode.Node({external_id:external_id});
	var known_rolelookup = '0xbc723c385dB9FC5E82e301b8A7aa45819E4c3e8B';	
	console.log("  - MyAddress:",node.wallet.address);
	it('Test Ownership (0/0)', function(done) {			
			node.roleLookup(known_rolelookup).then( function(roleLookup) {
						roleLookup.owner().then( function(owner) {						
						assert.equal(owner[0].toString(),"0x00D44194A83Affb40dB9DFded2ebb62aBE711F56");
						done();
						});
					});		
	});
	it('Test Deployment DSO (low-level)', function(done) {
			node._deployContract('StromDAO-BO.sol:DSO',known_rolelookup).then(function(address) {
							//console.log("Deployed",address);
							assert.equal(address.length,42);
							done();
			});
	});	
});
