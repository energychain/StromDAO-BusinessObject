/**
  StromDAO Business Object - MPReading (IoT) testing for Energy Blockchain
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    
var StromDAONode_in1 = require("../StromDAONode.js");    
var StromDAONode_in2 = require("../StromDAONode.js");    
var StromDAONode_out1 = require("../StromDAONode.js");    
var StromDAONode_out2 = require("../StromDAONode.js");    
describe('StromDAO: Meter Point Operating and Clearing', function() {
	this.timeout(300000);
	var external_id = Math.random()*10000000; 

	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var mp1_in = new StromDAONode_in1.Node({external_id:external_id+"_in1",testMode:true});
	var mp2_in = new StromDAONode_in2.Node({external_id:external_id+"_in2",testMode:true});
    
    var mp1_out = new StromDAONode_out1.Node({external_id:external_id+"_out1",testMode:true});
	var mp2_out = new StromDAONode_out2.Node({external_id:external_id+"_out2",testMode:true});    
    var node = new StromDAONode.Node({external_id:external_id,testMode:true});
    
	console.log("Consens Parameters for this test instance:");	
	console.log("  - MyAddress:",node.wallet.address);
	console.log("  - Private Key:",node.wallet.privateKey);
    console.log("  - MP1_in Address:",mp1_in.wallet.address);
    console.log("  - MP2_in Address:",mp2_in.wallet.address);
    console.log("  - MP1_out Address:",mp1_out.wallet.address);
    console.log("  - MP2_out Address:",mp2_out.wallet.address);
    
    var mpset_in = "";
    var mpset_out = "";
    
    var mprset_in_start = "";
    var mprset_out_start = "";
    
    var mprset_in_end = "";
    var mprset_out_end = "";
    
    var mprd_in="";
    var mprd_out="";
    
    var mprd_in_energy="";
    var mprd_out_energy="";    
    
    var settlement_in="";
    var settlement_out="";
    
    var stromkonto="";
    var clearing_in="";    
    var clearing_out="";
    var tx_cache_in="";
    var tx_cache_out="";

	describe('Create Metersets', function() {	
		it('Build Set for Feed IN Meters', function(done) {
				
				node.mpsetfactory().then(function(mpsf) {					
						mpsf.build().then(function(o) {	
													
							assert.equal(o.length,42);
							mpset_in=o;
							var node = new StromDAONode.Node({external_id:external_id,testMode:true});
							done();
						});							
				});						
		});	
		it('Build Set for Feed OUT Meters', function(done) {
				node.mpsetfactory().then(function(mpsf) {
						mpsf.build().then(function(o) {
							assert.equal(o.length,42);
							mpset_out=o;
							done();
						});							
				});						
		});	
		it('Add Meters to Feed In Meterset', function(done) {			
				node.mpset(mpset_in).then(function(mps) {
						mps.addMeterPoint(mp1_in.wallet.address).then( function(o) {
							assert.equal(o.length,66);									
							mps.addMeterPoint(mp2_in.wallet.address).then( function(o) {
								assert.equal(o.length,66);									
								done();
							});
						});							
				});						
		});	
		it('Add Meters to Feed Out Meterset', function(done) {
				node.mpset(mpset_out).then(function(mps) {
						mps.addMeterPoint(mp1_out.wallet.address).then( function(o) {
							assert.equal(o.length,66);									
							mps.addMeterPoint(mp2_out.wallet.address).then( function(o) {
								assert.equal(o.length,66);									
								done();
							});
						});							
				});						
		});			
	});
	describe('Set Opening Balance by storing Readings into MPRset', function() {
		it('Create Snapshot of Readings (MPRset) for Feed IN meters', function(done) {
				node.mprsetfactory().then(function(mpsf) {
						mpsf.build(mpset_in,node.options.defaultReading).then(function(o) {
							assert.equal(o.length,42);
							mprset_in_start=o;
							done();
						});							
				});						
		});		
		it('Create Snapshot of Readings (MPRset) for Feed Out meters', function(done) {
				node.mprsetfactory().then(function(mpsf) {
						mpsf.build(mpset_out,node.options.defaultReading).then(function(o) {
							assert.equal(o.length,42);
							mprset_out_start=o;
							done();
						});							
				});						
		});				
	});
	describe('Set new Meter Point Readings to 3', function() {
		
		it('Set Readings for mp1_in', function(done) {
				var mp1_in = new StromDAONode_in1.Node({external_id:external_id+"_in1",testMode:true});
				mp1_in.mpr(node.options.defaultReading).then(function(mpr) {
						mpr.storeReading(3).then(function(o) {
							assert.equal(o.length,66);
							done();
						});												
				});						
		});		
		it('Set Readings for mp2_in', function(done) {
				var mp2_in = new StromDAONode_in1.Node({external_id:external_id+"_in2",testMode:true});
				mp2_in.mpr(node.options.defaultReading).then(function(mpr) {
						mpr.storeReading(3).then(function(o) {
							assert.equal(o.length,66);
							done();
						});												
				});						
		});			
		it('Set Readings for mp1_out', function(done) {
				var mp1_out = new StromDAONode_in1.Node({external_id:external_id+"_out1",testMode:true});
				mp1_out.mpr(node.options.defaultReading).then(function(mpr) {
						mpr.storeReading(3).then(function(o) {
							assert.equal(o.length,66);
							done();
						});												
				});						
		});	
		it('Set Readings for mp2_out', function(done) {
				var mp2_out = new StromDAONode_in1.Node({external_id:external_id+"_out2",testMode:true});
				mp2_out.mpr(node.options.defaultReading).then(function(mpr) {
						mpr.storeReading(3).then(function(o) {
							assert.equal(o.length,66);
							done();
						});												
				});						
		});					
	});
	describe('Set Closing Balance by storing Readings into MPRset', function() {
		it('Create Snapshot of Readings (MPRset) for Feed IN meters', function(done) {
				var node = new StromDAONode.Node({external_id:external_id,testMode:true});
				node.mprsetfactory().then(function(mpsf) {
						mpsf.build(mpset_in,node.options.defaultReading).then(function(o) {
							assert.equal(o.length,42);
							mprset_in_end=o;
							done();
						});							
				});						
		});		
		it('Create Snapshot of Readings (MPRset) for Feed Out meters', function(done) {
				node.mprsetfactory().then(function(mpsf) {
						mpsf.build(mpset_out,node.options.defaultReading).then(function(o) {
							assert.equal(o.length,42);
							mprset_out_end=o;
							done();
						});							
				});						
		});				
	});
	describe('Create Delta of Readings (Start to Close)', function() {
		it('Create Delta MPR for Feed IN meters (Value/Cost)', function(done) {
				node.mprdecoratefactory().then(function(mprd) {
						mprd.build(mpset_in,mprset_in_start,mprset_in_end).then(function(o) {
							assert.equal(o.length,42);
							mprd_in=o;
							done();
						});							
				});						
		});		
		it('Create Delta MPR for Feed IN meters (Base/Energy)', function(done) {
				node.mprdecoratefactory().then(function(mprd) {
						mprd.build(mpset_in,mprset_in_start,mprset_in_end).then(function(o) {
							assert.equal(o.length,42);
							mprd_in_energy=o;
							done();
						});							
				});						
		});			
		it('Create Delta MPR for Feed OUT meters (Value/Cost)', function(done) {
				node.mprdecoratefactory().then(function(mprd) {
						mprd.build(mpset_out,mprset_out_start,mprset_out_end).then(function(o) {
							assert.equal(o.length,42);
							mprd_out=o;
							done();
						});							
				});						
		});	
		it('Create Delta MPR for Feed OUT meters (Base/Energy)', function(done) {
				node.mprdecoratefactory().then(function(mprd) {
						mprd.build(mpset_out,mprset_out_start,mprset_out_end).then(function(o) {
							assert.equal(o.length,42);
							mprd_out_energy=o;
							done();
						});							
				});						
		});	
		it('Check for MP1_IN, that delta is now 3', function(done) {
				node.mprdecorate(mprd_in).then(function(mprd) {
						mprd.mpr(mp1_in.wallet.address).then(function(o) {
							assert.equal(o,3);					
							done();
						});							
				});						
		});
		/*
		it('Check for MP1_IN, that delta is now 0 in MPRD_OUT', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.mpr(mp1_in.wallet.address).then(function(o) {
							assert.equal(o,0);					
							done();
						});							
				});						
		});
		*/					
		it('Check for MP1_OUT, that reading is now 3', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.mpr(mp1_out.wallet.address).then(function(o) {
							assert.equal(o,3);					
							done();
						});							
				});						
		});						
	});
	describe('Work with MP Decorator on Feed OUT meters', function() {
		it('Set a value of 2 to each', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.ChargeFix(2).then(function(o) {
							assert.equal(o.length,66);					
							done();
						});							
				});						
		});		
		it('Check for MP1_OUT, that reading is now 5', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.mpr(mp1_out.wallet.address).then(function(o) {
							assert.equal(o,5);					
							done();
						});							
				});						
		});	
		it('Distribute Equal a value of 8 to each', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.SplitEqual(8).then(function(o) {
							assert.equal(o.length,66);					
							done();
						});							
				});						
		});	
		it('Check for MP2_OUT, that reading is now 7', function(done) {
				node.mprdecorate(mprd_out).then(function(mprd) {
						mprd.mpr(mp2_out.wallet.address).then(function(o) {
							assert.equal(o,7);					
							done();
						});							
				});						
		});										
	});
	describe('Do Settlements', function() {
		it('Build Feed IN Meterpoint Set Settlement', function(done) {
				node.settlementfactory().then(function(sf) {
						sf.build(mpset_in,mprd_in,mprd_in_energy,false).then(function(o) {							
							assert.equal(o.length,42);	
							settlement_in=o;				
							done();							
						});	
				});						
		});		
		it('Build Feed OUT Meterpoint Set', function(done) {
				node.settlementfactory().then(function(sf) {
						sf.build(mpset_out,mprd_out,mprd_out_energy,true).then(function(o) {							
							assert.equal(o.length,42);	
							settlement_out=o;				
							done();							
						});	
				});						
		});		
		it('Settle Feed IN', function(done) {
				node.settlement(settlement_in).then(function(sf) {
						sf.settle().then(function(o) {							
							assert.equal(o.length,66);								
							done();							
						});	
				});						
		});		
		it('Settle Feed OUT', function(done) {
				node.settlement(settlement_out).then(function(sf) {
						sf.settle().then(function(o) {							
							assert.equal(o.length,66);								
							done();							
						});	
				});											
		});
		it('Check for resolution of settlement. Node should have 28 in Out', function(done) {
				node.settlement(settlement_out).then(function(mprd) {
						mprd.mpr(node.wallet.address).then(function(o) {
							assert.equal(o,28);					
							done();
						});							
				});						
		});		
		it('Check for resolution of settlement. Node should have 0 in In', function(done) {
				node.settlement(settlement_in).then(function(mprd) {
						mprd.mpr(node.wallet.address).then(function(o) {
							assert.equal(o,0);					
							done();
						});							
				});						
		});								
		it('Check for resolution of settlement. MP1_IN should have 3', function(done) {
				node.settlement(settlement_in).then(function(mprd) {
						mprd.mpr(mp1_in.wallet.address).then(function(o) {
							assert.equal(o,3);								
							done();
						});							
				});						
		});	
		it('Retrieve TX Cache for Clearing In', function(done) {
				node.settlement(settlement_in).then(function(mprd) {
						mprd.txcache().then(function(o) {
							assert.equal(o.length,42);
							tx_cache_in=o;								
							done();
						});							
				});						
		});					
		it('Retrieve TX Cache for Clearing Out', function(done) {
				node.settlement(settlement_out).then(function(mprd) {
						mprd.txcache().then(function(o) {
							assert.equal(o.length,42);
							tx_cache_out=o;								
							done();
						});							
				});						
		});									
	});
	
	describe('Do Clearing to Stromkonto', function() {
		it('Build StromkontoProxy', function(done) {
				node.stromkontoproxyfactory().then(function(sf) {
				
						sf.build().then(function(o) {							
							assert.equal(o.length,42);	
							stromkonto=o;	
							console.log("Stromkonto",stromkonto);				
							done();							
						});	
				});						
		});		
		it('Build Clearing Out', function(done) {
				node.clearingfactory().then(function(sf) {
						sf.build(stromkonto).then(function(o) {							
							assert.equal(o.length,42);	
							clearing_out=o;				
							done();							
						});	
				});						
		});		
		it('Allow Clearing Out to write Transactions', function(done) {
				node.stromkontoproxy(stromkonto).then(function(sf) {
						sf.modifySender(clearing_out,true).then(function(o) {							
							assert.equal(o.length,66);									
							done();							
						});	
				});						
		});	
		it('Do Clearing Out', function(done) {
				node.clearing(clearing_out).then(function(sf) {					
						sf.clear(tx_cache_out).then(function(o) {							
							assert.equal(o.length,66);	
							done();							
						});	
				});						
		});		
		it('Build Clearing In', function(done) {
				node.clearingfactory().then(function(sf) {
						sf.build(stromkonto).then(function(o) {							
							assert.equal(o.length,42);	
							clearing_in=o;				
							done();							
						});	
				});						
		});		
		it('Allow Clearing In to write Transactions', function(done) {
				node.stromkontoproxy(stromkonto).then(function(sf) {
						sf.modifySender(clearing_in,false).then(function(o) {							
							assert.equal(o.length,66);									
							done();							
						});	
				});						
		});	
		it('Do Clearing In', function(done) {
				node.clearing(clearing_in).then(function(sf) {
						sf.clear(tx_cache_in).then(function(o) {							
							assert.equal(o.length,66);	
							done();							
						});	
				});						
		});		
		it('Final Contracts used', function(done) {
				    console.log("MPSET_IN",mpset_in);
					console.log("MPSET_OUT",mpset_out);
					
					console.log("MPRSET_IN_START",mprset_in_start);
					console.log("MPRSET_OUT_START",mprset_out_start);
					
					console.log("MPRSET_IN_END",mprset_in_end);
					console.log("MPRSET_OUT_END",mprset_out_end);
					
					console.log("MPRD_IN",mprd_in);
					console.log("MPRD_OUT",mprd_out);
					
					console.log("MPRD_IN_ENERGY",mprd_in_energy);
					console.log("MPRD_OUT_ENERGY",mprd_out_energy);    
					
					console.log("SETTLEMENT_IN",settlement_in);
					console.log("SETTLEMENT_OUT",settlement_out);
					
					console.log("STROMKONTO",stromkonto);
					console.log("CLEARING_IN",clearing_in);
					console.log("CLEARING_OUT",clearing_out);					
					console.log("TX_CACHE_IN",tx_cache_in);
					console.log("TX_CACHE_OUT",tx_cache_out);				
					done();
		});									
	});	
});	
