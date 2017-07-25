/**
 * StromDAO Business Object: DirectClearing
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
 
 
this.singleclearing=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_SingleClearing"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_SingleClearing');	
									
				instance.setAccount=function(address_account,uint256_shares)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setAccount(address_account,uint256_shares).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.clearing=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.clearing().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.becomeProvider=function(address_stromkonto) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.becomeProvider(address_stromkonto).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.activate=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.activate().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};	
				instance.deactivate=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.deactivate().then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};								
				instance.setEnergyCost=function(uint256_cost)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setEnergyCost(uint256_cost).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.setMeterPoint=function(address_meterpoint)  {				
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setMeterPoint(address_meterpoint).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.addTx=function(address_from,address_to,uint256_value,uint256_base)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addTx(address_from,address_to,uint256_value,uint256_base).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.accounts=function(uint256_idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.accounts(uint256_idx).then(function(o) {									
								resolve2(o[0]);											
							}).catch(function(r) {resolve2();});									
					});
					return p2;
				};
				instance.meterpoint=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoint().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				instance.stromkonto=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.stromkonto().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				instance.last_reading=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.last_reading().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};	
				instance.last_time=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.last_time().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};								
				instance.energyCost=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.energyCost().then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				instance.state=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.state().then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				
				instance.getProvider=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.provider().then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				instance.getOwner=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.owner().then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				instance.total_shares=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.total_shares().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};				
				instance.share=function(address_account) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.share(address_account).then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				instance.balanceOf=function(address_account) {
					var p2 = new Promise(function(resolve2, reject2) { 
								//console.log(instance.obj);
								instance.obj.balanceOf(address_account).then(function(o) {
										resolve2(o[0].toString()*1);
								});
					});
					return p2;
				};														
				resolve(instance);
			});
			return p1;
		};
