/*
 * StromDAO Business Object: Meta Data Publish
 * =========================================
 * Distribution Public MetaData for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
var request = require('request');
 
this.metaset=function(role_id) {
					
			var p1 = new Promise(function(resolve, reject) { 

					var obj = {};
					
					obj.put=function(data_obj) {
						var p2 = new Promise(function(resolve2, reject2) { 
							// First Publish Data and get MultiHash			
							request.post("https://demo.stromdao.de/put", {form:data_obj}).on('data', function(data) { 
								
								var multihash=data.toString();
								
								parent.stringstoragefactory().then( function(ssf) {
									ssf.build(multihash).then(function(adr) {									
									parent.roleLookup().then(function(rl) {
										rl.setRelation(role_id,adr).then(function(hash) {
											resolve2(adr);											
										});
									});
								});
								});									
							});
						});
						return p2;
						// Second set in Role	s and return Promise											
					}
					
					obj.get=function(address) {
						var p2 = new Promise(function(resolve2, reject2) { 
							parent.roleLookup().then(function(rl) {
								rl.relations(address,role_id).then(function(roler) {
											parent.stringstorage(roler).then(function(ss) {
												ss.str().then(function(multihash) {
													request.post("https://demo.stromdao.de/get",{form:{key:multihash}}).on('data',	function(d) {
		
														string = d.toString();
														//console.log(roler,multihash,string);
														resolve2(string);
													});;
													
												});
											});
								});
							});
						});
						return p2;					
					}
					
					resolve(obj);
					
			});
			return p1;
		};
