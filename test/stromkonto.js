/**
  Basic Stromkonto Contract testing. 
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('Stromkonto', function() {
	this.timeout(240000);
	var external_id = Math.random()*10000000; 
	var node = new StromDAONode.Node({external_id:external_id});
	var known_stromkontostub = '0x1938D2eDeA524B91CEe2E5a26657eAc2E361E77c';	
	console.log("  - MyAddress:",node.wallet.address);
	it('Test Balances (0/0)', function(done) {			
			node.stromkonto(known_stromkontostub).then( function(stromkonto) {
					stromkonto.obj.balanceSoll(node.wallet.address).then(function(o) {
						assert.equal(o[0].toString(),0);
						stromkonto.obj.balanceHaben(node.wallet.address).then(function(p) {
								assert.equal(p[0].toString(),0);
								done();
						});
					});
			});
	});
	it('Transfer 100 Cent to me (and test)', function(done) {			
			node.stromkonto(known_stromkontostub).then( function(stromkonto) {
					stromkonto.addTx(known_stromkontostub,node.wallet.address,100,known_stromkontostub).then(
						function(o) {							
							node._waitForTransaction(o).then(function() {
									stromkonto.obj.balanceHaben(node.wallet.address).then(function(p) {
											assert.equal(p[0].toString(),100);
											done();
									});
							});
						}
					);
			});
	});
});
