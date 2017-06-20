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
									
				instance.setAccount=function(_account,_shares)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setAccount(_account,_shares).then(function(o) {									
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
				instance.setEnergyCost=function(_cost)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setEnergyCost(_cost).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.addTx=function(_from,_to,value,base)  {		
		
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.addTx(_from,_to,value,base).then(function(o) {									
								parent._waitForTransactionKeepRef(o,resolve2);												
							});									
					});
					return p2;
				};
				instance.accounts=function(idx) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.accounts(idx).then(function(o) {									
								resolve2(o[0]);											
							});									
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
				instance.energyCost=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.energyCost().then(function(o) {									
								resolve2(o[0]);											
							});									
					});
					return p2;
				};
				instance.share=function(address) {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.share(address).then(function(o) {									
								resolve2(o[0].toString());											
							});									
					});
					return p2;
				};
				

				resolve(instance);
			});
			return p1;
		};
