/**
  Smart Meter related Use Cases
*/

var assert = require('assert');
var StromDAONode = require("../StromDAONode.js");

describe('SmartMeter', function() {
	this.timeout(60000);

	var known_gwalink = '0x119AA4A3C2C7287f99FCBB41C5a78a8Dc15d1338';
	var external_id = Math.random()*10000000;

	var node = new StromDAONode.Node({external_id:external_id});

	it('Write via Reader/Read via GWALink', function() {
			var myReading = new Date().getTime();
			node.gwalink(known_gwalink).then(
					function(gwalink) {
							var reader_in = gwalink.reader_in;
							reader_in.pingReading(myReading).then(function(o) {
									var interval = setInterval(function() {
										node.provider.getBlockNumber().then(function(blockNumber) {
												if(typeof block1 == "undefined") var block1=blockNumber;
												var block2=blockNumber;
												if(block1!=block2) {
														clearInterval(interval);
														gwalink.obj.zss(node.wallet.address).then(
															function(o) {
																assertEqual(o[1].toString(),myReading);
																done();
															}
														);

												}
										});
									}
									,1000);
							});
			});
	});
	it('Write via Reader/Read via Reader', function() {
			var myReading = new Date().getTime();
			node.gwalink(known_gwalink).then(
					function(gwalink) {
							var reader_in = gwalink.reader_in;
							reader_in.pingReading(myReading).then(function(o) {
									var interval = setInterval(function() {
										node.provider.getBlockNumber().then(function(blockNumber) {
												if(typeof block1 == "undefined") var block1=blockNumber;
												var block2=blockNumber;
												if(block1!=block2) {
														clearInterval(interval);
														reader_in.obj.readings(node.wallet.address).then(
															function(o) {
																assertEqual(o[1].toString(),myReading);
																done();
															}
														);

												}
										});
									}
									,1000);
							});
			});
	});
});
