/*
 * StromDAO Business Object: Stromkonto
 * =========================================
 * Stable Balance handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
 
this.stromkonto = function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 					
						var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Stromkonto');
						instance.addTx=function(_from,_to,_value,_base) {
								var p2 = new Promise(function(resolve2, reject2) { 
											instance.obj.addTx(_from,_to,_value,_base).then(function(o) {
													parent._waitForTransactionKeepRef(o,resolve2);	
											});
								});
								return p2;
						};
						instance.balancesSoll=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceSoll(_address).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};	
						instance.balancesHaben=function(_address) {
								var p2 = new Promise(function(resolve2, reject2) { 
											//console.log(instance.obj);
											instance.obj.balanceHaben(_address).then(function(o) {
													resolve2(o);
											});
								});
								return p2;
						};					
						resolve(instance);
			});
			return p1;
};
