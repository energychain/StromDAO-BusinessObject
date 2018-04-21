/**
 * StromDAO Business Object: HySM
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 *  
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * */
 
function split64(data) { return "0x"+data.substr(0,64);}
function remain64(data) { return data.substr(64);}

this.apexcommissions = function(obj_or_address) {
			if(typeof obj_or_address == "undefined") obj_or_address=parent.options.contracts["StromDAO-BO.sol_ApexCommissions"];
			
			var p1 = new Promise(function(resolve, reject) { 
				var instance=parent._objInstance(obj_or_address,'StromDAO-BO.sol_ApexCommissions');			
				instance.test = {};				
					
				
				resolve(instance);
			});
			return p1;
		};
