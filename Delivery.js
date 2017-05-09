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
					instance.owner=function() {return parent._owner_promise(instance);};
					instance.power=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.deliverable_power().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.resolution=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.resolution().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.endTime=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.deliverable_endTime().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};	
					instance.startTime=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.deliverable_startTime().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.account=function() {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.account().then(function(o) {
										resolve2(o);
								});
							});
							return p2;
					};
					instance.transferOwnership=function(owner) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.transferOwnership(owner).then(function(o) {
									parent._waitForTransactionKeepRef(o,resolve2);				
								});
							});
							return p2;
					};
					instance.includeDelivery=function(delivery) {
							var p2 = new Promise(function(resolve2, reject2) {
								instance.obj.includeDelivery(delivery).then(function(o) {
									parent._waitForTransactionKeepRef(o,resolve2);				
								});
							});
							return p2;
					};					
					resolve(instance);
			});
			return p1;
		};	
