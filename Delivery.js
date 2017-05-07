/*
 * StromDAO Business Object: Delivery
 * =========================================
 * Consensus handling of power/electricity delivery StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 

this.delivery=function(obj_or_address) {
			var p1 = new Promise(function(resolve, reject) { 
					var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol:Delivery');
					instance.owner=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.owner().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.power=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.deliverable_power().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.transferOwnership=function(owner) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.transferOwnership(owner).then(function(o) {
									parent._waitForTransaction(o.hash).then(function() {								
										resolve2(parent._keepHashRef(o));					
									});				
								});
							});
							return p2;
					};
					instance.includeDelivery=function(delivery) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.includeDelivery(delivery).then(function(o) {
									parent._waitForTransaction(o.hash).then(function() {								
										resolve2(parent._keepHashRef(o));					
									});				
								});
							});
							return p2;
					};					
					resolve(instance);
			});
			return p1;
		};	
