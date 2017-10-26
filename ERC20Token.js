/**
 * StromDAO Business Object: MPToken
 * =========================================
 * Meter Point Token handling for StromDAO Energy Blockchain.
 * 
 * In General a MPToken consists of two ERC-20 Tokens: Time and Power
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 

this.erc20token = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol:ERC20Token"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:ERC20Token');			
				instance.test = {};				

				instance.transfer=function(address_to,uint256_value) {
					//_reading=Math.round(_reading);
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.transfer( parent._resolveName(address_to),uint256_value).then(function(o) {	
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
				
				instance.owner=function() {					
					var p2 = new Promise(function(resolve2, reject2) { 							
							instance.obj.owner().then(function(o) {														
								 resolve2(o[0].toString());									
							});									
					});
					return p2;
				};
				
				instance.balanceOf=function(address_account) {					
						var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceOf( parent._resolveName(address_account)).then(function(o) {
													resolve2(o[0].toString()*1);
											});
								});
								return p2;
				};
				
				resolve(instance);
			});
			return p1;
		};
