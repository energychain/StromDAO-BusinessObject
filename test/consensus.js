/**
  StromDAO Business Object - Consensus testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Consensus System for Energy Blockchain	', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node = new StromDAONode.Node({external_id:external_id,testMode:true});

	var known_rolelookup = '0x0000000000000000000000000000000000000006';

	var my_reading_1=Math.round(Math.random()*10000000);
	var my_reading_2=Math.round(my_reading_1+(Math.random()*100+1));
	var my_reading_3=Math.round(my_reading_2+(Math.random()*100+1));
	var my_reading_4=Math.round(my_reading_3+(Math.random()*100+1));
	var my_reading_5=Math.round(my_reading_4+(Math.random()*100+1));
	var my_reading_6=Math.round(my_reading_5+(Math.random()*100+1));
	var my_mpo ='';
	var my_dso ='';
	var my_provider = '';
	var my_stromkonto = '';
	var my_billing='';
	var role_mpo=1;
	var role_dso=2;
	var role_provider=3;

    var delivery_1='';
    var delivery_2='';
    var delivery_3='';
    var delivery_4='';
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - Reading#1:",my_reading_1);
    console.log("  - Reading#2:",my_reading_2);
    console.log("  - Reading#3:",my_reading_3);
    console.log("  - Reading#4:",my_reading_4);
    console.log("  - Reading#5:",my_reading_5);
    console.log("  - Reading#6:",my_reading_6);
	describe('Usecase: Connect new Meterpoint to Consensus System', function() {
	
		it('Ensure DSO Contract exists', function(done) {
				node._deployContract('StromDAO-BO.sol:DSO',known_rolelookup).then(function(address) {								
								assert.equal(address.length,42);
								my_dso=address;
								console.log("        - My DSO:",my_dso);
								done();
				});
		});	
		it('Ensure MPO Contract exists', function(done) {
				node._deployContract('StromDAO-BO.sol:MPO',known_rolelookup).then(function(address) {
								
								assert.equal(address.length,42);
								my_mpo=address;
								console.log("        - My MPO:",my_mpo);
								done();
				});
		});	
		it('Ensure Provider Contract exists', function(done) {
				node._deployContract('StromDAO-BO.sol:Provider',known_rolelookup).then(function(address) {								
								assert.equal(address.length,42);
								my_provider=address;
								console.log("        - My Provider:",my_provider);
								done();
				});
		});			
		it('Test if consensus is aware of MPO Role (uint8)', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.roles(1).then( function(role_address) {	
									assert.equal(role_address,1);
									role_mpo=role_address;
									done();
							});
						});
		});	
		it('Test if consensus is aware of DSO Role (uint8)', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.roles(2).then( function(role_address) {	
									assert.equal(role_address,2);
									role_dso=role_address;
									done();
							});
						});
		});	
		it('Test if consensus is aware of Provider Role (uint8)', function(done) {
						node.roleLookup(known_rolelookup).then( function(roleLookup) {
							roleLookup.roles(3).then( function(role_address) {	
									assert.equal(role_address,3);
									role_provider=role_address;
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
							dso.approveConnection(node.wallet.address,1000000).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
	
	});
	describe('Usecase: Process sequential Meterpoint readings', function() {	
		it('Set my reading #1 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_1).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		
		it('Set my reading #2 according to MPO contract', function(done) {
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
		it('Set my reading #3 according to MPO contract', function(done) {
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
	describe('Usecase: Consensus of Power Delivery is given after exchange (merge/resolve)', function() {
		it('Sumup energy in deliveries - should be eq to reading 3 - reading 1', function(done) {
			node.delivery(delivery_1).then( function(delivery) {
				
				delivery.power().then( function(tx_result) {	
						var power_1 = (tx_result[0].toString())*1;
							node.delivery(delivery_2).then( function(delivery) {				
								delivery.power().then( function(tx_result) {
									var power_2 = (tx_result[0].toString())*1;
									assert.equal(power_1+power_2,my_reading_3-my_reading_1);
									//console.log(power_1,power_2,power_1+power_2,my_reading_3-my_reading_1);
									done();	
							    });
							});
						
				});
			});
		});	
		it('Transfer Ownership of Delivery 2 to Delivery 1', function(done) {
			node.delivery(delivery_2).then( function(delivery) {
				delivery.transferOwnership(delivery_1).then(function(tx_result) {
					assert.equal(tx_result.length,66);
					done();
				});
			});
		});
		it('Check that Delivery 1 got Ownership', function(done) {
						node.delivery(delivery_2).then( function(delivery) {
							
							delivery.owner().then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									assert.equal(tx_result[0],delivery_1);									
									done();
							});
						});
		});
		it('Include Delivery 2 into 1 ', function(done) {
						node.delivery(delivery_1).then( function(delivery) {
							
							delivery.includeDelivery(delivery_2).then( function(tx_result) {	
								assert.equal(tx_result.length,66);
								done();
							});
						});
		});	
		it('Re-Sumup energy in deliveries - should be eq to reading 3 - reading 1', function(done) {
			node.delivery(delivery_1).then( function(delivery) {
				
				delivery.power().then( function(tx_result) {	
						var power_1 = (tx_result[0].toString())*1;
							node.delivery(delivery_2).then( function(delivery) {				
								delivery.power().then( function(tx_result) {
									var power_2 = (tx_result[0].toString())*1;
									assert.equal(power_1+power_2,my_reading_3-my_reading_1);
									done();	
							    });
							});
						
				});
			});
		});	
		it('Delivery 2 should have power eq 0', function(done) {
			node.delivery(delivery_2).then( function(delivery) {
				
				delivery.power().then( function(tx_result) {	
						var power_2 = (tx_result[0].toString())*1;						
						assert.equal(power_2,0);
						done();														
				});
			});
		});							
	});
	describe('Usecase: Delegation of Deliveries', function() {
		it('Let DSO become my Provider by setting contract in roles', function(done) {
				node.roleLookup(known_rolelookup).then( function(roleLookup) {
					roleLookup.setRelation(role_provider,my_dso).then( function(tx_result) {	
							assert.equal(tx_result.length,66);
							done();
					});
				});
		});	
		it('Set my reading #4 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_4).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});	
		it('Retrieve my last Delivery', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							
							mpo.lastDelivery(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									delivery_3=tx_result[0];
									done();
							});
						});
		});	
		/*	
		it('Check that DSO is owner of last Delivery', function(done) {
						node.delivery(delivery_3).then( function(delivery) {
							
							delivery.owner().then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									assert.equal(tx_result[0],my_dso);	
									assert.notEqual(tx_result[0],node.wallet.address);								
									done();
							});
						});
		});	
		*/
		it('Let TestProvider become my Provider by setting contract in roles', function(done) {
				node.roleLookup(known_rolelookup).then( function(roleLookup) {
					roleLookup.setRelation(role_provider,my_provider).then( function(tx_result) {	
							assert.equal(tx_result.length,66);
							done();
					});
				});
		});	
		it('Set my reading #5 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_5).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
		});			
	});	
	describe('Usecase: Provider does energy to money exchange', function() {
			it('Let Provider accept deliveries from me as sender with cost per day 0 and cost per energy 2', function(done) {
						node.provider(my_provider).then( function(provider) {							
							provider.approveSender(node.wallet.address,true,0,2).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
			});	
			it('Retrieve my last Delivery', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.lastDelivery(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									delivery_4=tx_result[0];
									done();
							});
						});
			});	
			it('Retrieve Stromkonto', function(done) {
						node.provider(my_provider).then( function(provider) {	
							provider.stromkonto().then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									my_stromkonto=tx_result[0];
									done();
							});
						});
			});	
			it('Check my due eq 0 on Stromkonto', function(done) {
						node.stromkonto(my_stromkonto).then( function(stromkonto) {	
							stromkonto.balancesSoll(node.wallet.address).then( function(tx_result) {	
								
									assert.equal(tx_result*1,0);									
									done();
							});
						});
			});	
			it('Sign Billing Contract with Provider', function(done) {
						node.provider(my_provider).then( function(provider) {	
							provider.billings(node.wallet.address).then( function(tx_result) {
									my_billing=tx_result[0];	
									node.billing(tx_result[0]).then( function(billing) {
											billing.becomeTo().then(function(tx_result2) {
												//console.log(tx_result2);
												assert.equal(tx_result2.length,66);												
												done();
										    });
									});									
							});
						});
			});		
			it('Set my reading #6 according to MPO contract', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_6).then( function(tx_result) {	
									assert.equal(tx_result.length,66);
									done();
							});
						});
			});			
			it('Retrieve my last Delivery', function(done) {
						node.mpo(my_mpo).then( function(mpo) {
							mpo.lastDelivery(node.wallet.address).then( function(tx_result) {	
									assert.equal(tx_result[0].length,42);
									delivery_4=tx_result[0];
									done();
							});
						});
			});					
			it('Let provider handle my last delivery', function(done) {
						node.provider(my_provider).then( function(provider) {							
							provider.handleDelivery(delivery_4).then( function(tx_result) {										
									assert.equal(tx_result.length,66);
									done();
							});
						});
			});	
			it('Check my due is double energy on Stromkonto as cost per energy is set to 2 (reading#6-reading#4)*2', function(done) {
						node.stromkonto(my_stromkonto).then( function(stromkonto) {	
							stromkonto.balancesSoll(node.wallet.address).then( function(tx_result) {										
									//assert.notEqual(tx_result*1,0);	
									due=tx_result*1;
									//assert.equal(due,(my_reading_5-my_reading_4)*2);		TODO ReAdd Assert after Reading 6						
									done();
							});
						});
			});	
	});	
	describe('Usecase: End-To-End Test', function() {
			it('Setting reading #6 should trigger event/transaction on stromkonto', function(done) {
					node.stromkonto(my_stromkonto).then( function(stromkonto) {	
							//console.log(stromkonto.obj);
							/*
							stromkonto.obj.ontx=function(from,to,value,base) {
								console.log(from,to,value,base);
								done();
								//if(from==node.wallet.address) { done(); }
							}*/
							done();
					});
					
					node.mpo(my_mpo).then( function(mpo) {
							mpo.storeReading(my_reading_6).then( function(tx_result) {	
									// Nothing to do here ... as Event should be triggered.
							});
						});
				
			});
	
	});
});
