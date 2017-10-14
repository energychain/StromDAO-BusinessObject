/**
  StromDAO Business Object - StringStorage
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");    

describe('StromDAO: Brain Wallet', function() {
	var external_id = Math.random()*10000000; 
	this.timeout(300000);
	var node = new StromDAONode.Node({external_id:external_id,testMode:true});
	var my_str = "C"+external_id;
	var imutable="";
	var encoded="";
    var stringstorage = "";
    
	console.log("Consens Parameters for this test instance:");	
    
	describe('Create personal wallet', function() {	
		it('Test encoding for test,test', function(done) {
				var Account = new StromDAONode.Account("test","test");
				Account.encrypt(my_str).then(function(enc) {
							encoded=enc;
							done();
				});					
		});	
		it('Test decoding for test,test', function(done) {
				var Account = new StromDAONode.Account("test","test");
				Account.decrypt(encoded).then(function(dec) {
							assert.equal(dec,my_str);
							done();
				});					
		});	
		it('Test decoding for test2,test', function(done) {
				var Account = new StromDAONode.Account("test2","test");
				Account.decrypt(encoded).then(function(dec) {
							assert.notEqual(dec,my_str);
							done();
				});					
		});	
		it('Test decoding for test,test2', function(done) {
				var Account = new StromDAONode.Account("test","test2");
				Account.decrypt(encoded).then(function(dec) {
							assert.notEqual(dec,my_str);
							done();
				});					
		});			
		it('Persist PK for this node', function(done) {
				var Account = new StromDAONode.Account("test","test");
				Account.encrypt(node.wallet.privateKey).then(function(enc) {
					node.stringstoragefactory().then(function(ssf)  {
						console.log(" - Encrypted pk",enc);
						ssf.build(enc).then(function(ss) {
							node.roleLookup().then(function(rl) {
									rl.setRelation(256,ss).then(function(tx) {
										done();	
									});
							});
						});
					});							
				});					
		});
		it('Retrieve PK for this node', function(done) {
				var Account = new StromDAONode.Account("test","test");
				node.roleLookup().then(function(rl) {
					rl.relations(node.wallet.address,256).then(function(ss_addres) {
						node.stringstorage(ss_addres).then(function(ss) {
								ss.str().then(function(str) {
										Account.decrypt(str).then(function(pk) {
												console.log(" - Encrypted pk",str);
												assert.equal(pk,node.wallet.privateKey);
												done();
										});
								});
						});
					});						
				});				
		});
		it('Retrieve PK for this node (wrong username)', function(done) {
				var Account = new StromDAONode.Account("test2","test");
				node.roleLookup().then(function(rl) {
					rl.relations(node.wallet.address,256).then(function(ss_addres) {
						node.stringstorage(ss_addres).then(function(ss) {
								ss.str().then(function(str) {
										Account.decrypt(str).then(function(pk) {												
												assert.notEqual(pk,node.wallet.privateKey);
												done();
										});
								});
						});
					});						
				});				
		});
	});
});
