/**
 * StromDAO Business Object: MPSet 
 * =========================================
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */
 
 
this.mpdelta=function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_MPDelta"];
			var p1 = new Promise(function(resolve, reject) { 
			
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_MPDelta');									
				
				instance.lastReadingTime=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.lastReadingTime().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}
				instance.lastReadingPower=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.lastReadingPower().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}				
				instance.meterpoint=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.meterpoint().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}	
				instance.lastDeltaTime=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.lastDeltaTime().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}	
				instance.lastDeltaPower=function() {
					var p2 = new Promise(function(resolve2, reject2) { 
							instance.obj.lastDeltaPower().then(function(o) {									
								resolve2(o);											
							});									
					});
					return p2;
				}	
				resolve(instance);
			});
			return p1;
		};
