/**
  Basic PowerDelivery Contract testing.
  
  Evaluates:
   - GWALink 
   - PDcontract
   - PDclearingStub (!Stub Only!)
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('PowerDelivery', function() {
	this.timeout(240000);
	var external_id = Math.random()*10000000; 
	var node = new StromDAONode.Node({external_id:external_id});
	var known_gwalink = '0x119AA4A3C2C7287f99FCBB41C5a78a8Dc15d1338';
	var known_pdclearingstub = '0xf3F5044ad981C6CF2E2Be619BB7610076d6690cA';
	var pdcontract={};
	var pdclearing={};
	before(function(done) {
			node.pdclearing(known_pdclearingstub).then(function(_pdclearing) {		
			pdclearing=_pdclearing;
			pdclearing.factory(known_gwalink,node.wallet.address,node.wallet.address,node.wallet.address,1000,10,true).then( 		
					function(o) {										
								node.pdcontract(o).then(function(_pdcontract) {	
									pdcontract=_pdcontract; 
									console.log("  - MyAddress:",node.wallet.address);
									console.log("  - PD Contract:",pdcontract.obj.address);
									done();
									});											
							});					
			});
	});
	
	describe('Check Instantiation',function() {										
									it('Check Last Reading is 0', function(done2) {								
											pdcontract.obj.zs_last().then(function(zs_last) { 											
													assert.equal(zs_last[0].toString(),0);
													done2();
											});
									});
									it('Check Contract not executed', function(done2) {								
											pdcontract.obj.executed().then(function(executed) {													
													assert.equal(executed[0],false);
													done2();
											});
									});
									it('Check Contract is endure', function(done2) {								
											pdcontract.obj.endure().then(function(endure) { 													
													assert.equal(endure[0],true);
													done2();													
											});
									});	
									it('Run Check Transaction', function(done2) {								
											pdcontract.obj.check().then(function() {																								
													done2();													
											});
									});	
									it('Set new Reading, endure to false, execute clearing (n2n test)', function(done2) {
											node.gwalink(known_gwalink).then(
													function(gwalink) {
													var reader_in = gwalink.reader_in;
														reader_in.pingReading(1000).then(function(o) {
																node._waitNextBlock(function() {												
																 pdcontract.obj.check().then(function(o) {
																  node._waitNextBlock(function() {
																	  pdcontract.obj.stopEndure().then( function(o) {
																		node._waitNextBlock(function() {
																		  pdcontract.obj.endure().then(function(endure) { 													
																		  assert.equal(endure[0],false);
																		   pdclearing.obj.execute(pdcontract.obj.address).then(function(o) {
																			node._waitNextBlock(function() {
																			 pdcontract.obj.executed().then(function(executed) {
																			 done2();
																			 });	
																			});
																		   });														
																		  });																		
																		 });
																	});	 
																	});
														        });
															   });	
														});															
										});
									});
									/*
									it('Check cost_sum 1.000.000', function(done2) {
											pdcontract.obj.cost_sum().then(function(o) {
													console.log(o);
													assert.equals(o[0].toString(),1000000);
													done2();													
											});
									});
									*/

	});
});
	