/**
  StromDAO Business Object - MPReading/DirectConnection (IoT) testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Direct Charging and Connection', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node_in = new StromDAONode.Node({external_id:external_id,testMode:true});
	var node_out = new StromDAONode.Node({external_id:external_id+1,testMode:true});
	
	var known_rolelookup = '0x0000000000000000000000000000000000000006';

    var reading_out_1=Math.round(Math.random()*10000000);
	var reading_out_2=Math.round(reading_out_1+(Math.random()*100+1));
	var reading_out_3=Math.round(reading_out_2+(Math.random()*100+1));	

    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress Feed In (to become owner):",node_in.wallet.address);
	console.log("  - MyAddress Feed Out (to be charged):",node_out.wallet.address);
    
    console.log("  - Reading Out #1:",reading_out_1);
    console.log("  - Reading Out #2:",reading_out_2);
    console.log("  - Reading Out #3:",reading_out_3);
    
    var my_connection = "";
    var my_charging = "";
    var my_stromkonto = "";
    
    
	describe('Scenario setup', function() {
	
		it('Setup direct connection for IN to OUT', function(done) {
						node_out.directconnectionfactory().then( function(dfc) {
							dfc.buildConnection(node_out.wallet.address,node_in.wallet.address,node_out.wallet.address,2,0).then( function(tx_result) {								
								assert.equal(tx_result.length,42);							
								my_connection=tx_result;
								console.log("  - DirectConnection",my_connection);
								done();
							});
						});
		});	
		it('Setup direct charging for IN to OUT', function(done) {
						node_out.directchargingfactory().then( function(dfc) {
							dfc.buildCharging().then( function(tx_result) {								
								assert.equal(tx_result.length,42);							
								my_charging=tx_result;
								console.log("  - DirectCharging",my_charging);
								done();
							});
						});
		});			
		it('Get Reader', function(done) {
						node_out.directcharging(my_charging).then( function(dc) {
							dc.reader().then( function(tx_result) {								
								assert.equal(tx_result.length,42);							
								my_reader=tx_result;
								console.log("  - Associated Meter Point Reader Contract",my_reader);
								done();
							});
						});
		});		
		it('Get Stromkonto Contract', function(done) {
						node_out.directcharging(my_charging).then( function(dc) {
							dc.stromkonto().then( function(tx_result) {								
								assert.equal(tx_result.length,42);							
								my_stromkonto=tx_result;
								console.log("  - Associated Stromkonto Contract",my_stromkonto);
								done();
							});
						});
		});	
		it('Add my Direct Connection to Charging', function(done) {
						node_out.directcharging(my_charging).then( function(dc) {
							dc.addConnection(my_connection).then( function(tx_result) {								
								assert.equal(tx_result.length,66);															
								done();
							});
						});
		});
	});
	describe('Sequentially write Readings', function() {
			it('@OUT commit Reading #1', function(done) {	
						node_out.mpr(my_reader).then( function(mpr) {
								mpr.storeReading(reading_out_1).then(function(tx_result) {
								assert.equal(tx_result.length,66);	
								done();
								});							
						});
						
			});
			it('@DirectCharging process all Connections', function(done) {	
						node_out.directcharging(my_charging).then( function(dc) {
							dc.chargeAll().then( function(tx_result) {								
								assert.equal(tx_result.length,66);							
								done();
							});
						});						
			});
			it('@Stromkonto of OUT debit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_out.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			/**
			 * After commiting the first reading we do not have a delta. So no charging is done.
			 */
			it('@Stromkonto of OUT credit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_out.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN debit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_in.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN credit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_in.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});
			/**
			 * After commiting the second reading we do have a delta so balances should not be 0
			 */								
			it('@OUT commit Reading #2', function(done) {	
						node_out.mpr(my_reader).then( function(mpr) {
								mpr.storeReading(reading_out_2).then(function(tx_result) {
								assert.equal(tx_result.length,66);	
								done();
								});							
						});
						
			});
			it('@DirectCharging process all Connections', function(done) {	
						node_out.directcharging(my_charging).then( function(dc) {
							dc.chargeAll().then( function(tx_result) {								
								assert.equal(tx_result.length,66);							
								done();
							});
						});						
			});			
			it('@Stromkonto of OUT debit should not be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_out.wallet.address).then( function(tx_result) {								
								assert.notEqual(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of OUT credit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_out.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN debit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_in.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN credit should not be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_in.wallet.address).then( function(tx_result) {								
								assert.notEqual(tx_result,0);							
								done();
							});
						});						
			});				
			/**
			 * After commiting third reading we could check if balancing works fine (check value)
			 */
			it('@OUT commit Reading #3', function(done) {	
						node_out.mpr(my_reader).then( function(mpr) {
								mpr.storeReading(reading_out_3).then(function(tx_result) {
								assert.equal(tx_result.length,66);	
								done();
								});							
						});
						
			});
			it('@DirectCharging process all Connections', function(done) {	
						node_out.directcharging(my_charging).then( function(dc) {
							dc.chargeAll().then( function(tx_result) {								
								assert.equal(tx_result.length,66);							
								done();
							});
						});						
			});			
			it('@Stromkonto of OUT debit should be (Reading#3-Reading#1)*2', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_out.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,(reading_out_3-reading_out_1)*2);							
								done();
							});
						});						
			});	
			it('@Stromkonto of OUT credit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_out.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN debit should be 0', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesSoll(node_in.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,0);							
								done();
							});
						});						
			});	
			it('@Stromkonto of IN credit should be (Reading#3-Reading#1)*2', function(done) {	
						node_out.stromkonto(my_stromkonto).then( function(stromkonto) {
							stromkonto.balancesHaben(node_in.wallet.address).then( function(tx_result) {								
								assert.equal(tx_result,(reading_out_3-reading_out_1)*2);							
								done();
							});
						});						
			});				
	});	
});	
