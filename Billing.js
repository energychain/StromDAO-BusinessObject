/*
 * StromDAO Business Object: Billing
 * =========================================
 * Consensus handling of power/electricity billing in StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.billing=function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Billing');
					instance.becomeTo=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.becomeTo().then(function(o) {
									parent._waitForTransactionKeepRef(o,resolve2);	
								});
							});
							return p2;
					};
					resolve(instance);
			});
			return p1;
		};
