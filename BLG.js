/**
 * StromDAO Business Object: DirectBLG
 * =========================================
 * Directly charge for Energy delivery to an account within StromDAO Energy Blockchain.
 * 
 * DirectCharging gets used together with DirectConnections.
 * 
 * In theory account A and account B are exchanging energy metered by meter_point C
 * 
 * DirectCharging takes several DirectConnections and runs charging as soon as method chargeAll is called.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 var request = require('request');
 
this.blg=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_DirectBalancingGroup"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_DirectBalancingGroup');	
				parent._saveLabel('BLG',obj_or_address);					
				instance.addFeedIn=function(account,meter_point,cost_per_energy,cost_per_day)  {		
					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addFeedIn(account,meter_point,cost_per_energy,cost_per_day).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.addFeedOut=function(account,meter_point,cost_per_energy,cost_per_day)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addFeedOut(account,meter_point,cost_per_energy,cost_per_day).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.setFixedEnergyCost=function(cost_per_energy)  {				
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setFixedEnergyCost(cost_per_energy).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};				
				instance.charge=function()  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.charge({gasLimit:5120000,gasPrice:0}).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.emptyConnections=function()  {				
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.emptyConnections().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};				
				instance.stromkontoDelta=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.stromkontoDelta().then(function(o) {	
								parent._saveLabel('BAL',o[0]);									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.feedIn=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.feedIn(idx).then(function(o) {	
								parent._saveLabel('CON',o[0]);								
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.feedOut=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.feedOut(idx).then(function(o) {	
								parent._saveLabel('CON',o[0]);								
								resolve2(o[0]);											
							});									
					});
					return p2;
				}				
				instance.stromkontoIn=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.stromkontoIn().then(function(o) {	
								parent._saveLabel('BAL',o[0]);								
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				instance.stromkontoOut=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.stromkontoOut().then(function(o) {	
								parent._saveLabel('BAL',o[0]);									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}	
				//cnt_feedin
				instance.cnt_feedin=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.cnt_feedin().then(function(o) {																
								resolve2(o[0]*1);											
							});									
					});
					return p2;
				}
				instance.cnt_feedout=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.cnt_feedout().then(function(o) {																
								resolve2(o[0]*1);											
							});									
					});
					return p2;
				}		
				instance.balancesheets=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							// Save as it is unmutbale
							var stored = parent.storage.getItemSync(obj_or_address+"_"+idx);
							if((typeof stored == "undefined")||(stored==null)) {						
								instance.obj.balancesheets(idx).then(function(o) {
									o.idx=idx;	
									parent._saveLabel('BAL',o.balanceIn);									
									parent._saveLabel('BAL',o.balanceOut);
									parent.storage.setItemSync(obj_or_address+"_"+idx,JSON.stringify(o));
									resolve2(o);											
								});									
							} else {		
								var o = JSON.parse(stored);						
								o.blockNumber=parent._utils.bigNumberify("0x"+o.blockNumber._bn);						
								resolve2(o);
							}
					});
					return p2;
				}
				instance.setCostPerEnergy=function(connection,cost_per_energy) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setCostPerEnergy(connection,cost_per_energy).then(function(o) {
								parent._waitForTransactionKeepRef(o,resolve2);													
							});									
					});
					return p2;
				}
				instance.setAccountInfo=function(account,data_obj) {
					var p2 = new Promise(function(resolve2, reject2) { 
							request.post("http://l2.stromdao.de:8001/put", {form:data_obj}).on('data', function(data) { 
								var multihash=data.toString();								
								parent.stringstoragefactory().then( function(ssf) {
									ssf.build(multihash).then(function(adr) {
										console.log("Adr",adr,"Multihash",multihash,"Account",account);
										instance.obj.setAccountInfo(account,adr).then(function(o) {
											parent._waitForTransactionKeepRef(o,resolve2);													
										});										
									});
								});
							});																
					});
					return p2;
				}	
				instance.accountInfo=function(account) {
					var p2 = new Promise(function(resolve2, reject2) { 
						instance.obj.accountInfo(account).then(function(o) {	
							parent.stringstorage(o[0]).then(function(ss) {
												ss.str().then(function(multihash) {
													request.post("http://l2.stromdao.de:8001/get",{form:{key:multihash}}).on('data',	function(d) {
														string = d.toString();
														resolve2(string);
													});;
													
												});
											});																																		
							});											
					});
					return p2;
				}			
				instance.setCostPerDay=function(connection,cost_per_day) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setCostPerDay(connection,cost_per_day).then(function(o) {
								parent._waitForTransactionKeepRef(o,resolve2);													
							});									
					});
					return p2;
				}			
				instance.balancesheets_cnt=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.balancesheets_cnt().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				}									
				resolve(instance);
			});
			return p1;
		};
