/**
 * StromDAO Business Object: MPToken
 * =========================================
 * Meter Point Token handling for StromDAO Energy Blockchain.
 * 
 * In General a MPToken consists of two ERC-20 Tokens: Time and Power
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.xtoken = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:XToken"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:XToken');			
				instance.test = {};				

				instance.transfer=function(address_to,uint256_value) {
					//_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.transfer(address_to,uint256_value).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
								
				instance.totalSupply=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.totalSupply().then(function(o) {														
								 resolve2(o[0].toString()*1);									
							});									
					});
					return p2;
				};
				
				instance.setRate=function(address_token,uint256_value) {
					//_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.setRate(address_token,uint256_value).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				instance.allocate=function(address_token,uint256_value) {
					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.allocate(address_token,uint256_value).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				instance.x=function(address_token) {
					
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.x(address_token).then(function(o) {	
								parent._waitForTransactionKeepRef(o,resolve2);			
							});									
					});
					return p2;
				};
				
				instance.xchange=function(address_token,uint256_value) {
					var p2 = new Promise(function(resolve2, reject2) { 
						instance.allocate(address_token,uint256_value).then(function() {
								parent.erc20token(address_token).then(function(e20) {
										e20.transfer(obj_or_address,uint256_value).then(function() {
											instance.x(address_token).then(function(o) {
												parent._waitForTransactionKeepRef(o,resolve2);	
											});
										});
								});
							
						});
					});
					return p2;						
				}
				
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
