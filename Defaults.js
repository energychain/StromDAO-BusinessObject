this.deployment=function(options) {
				if(typeof options.rpc == "undefined") options.rpc='http://app.stromdao.de:8081/rpc';
				return options;
		};
this.loadDefaults=function(options) {
				if(typeof parent.waitForDefaults == "undefined") {
					parent.waitForDefaults = true;
					options.rolelookup="0x0000000000000000000000000000000000000006";
					var contract_type=[];
					
					if(typeof parent.storage.getItemSync(options.rolelookup+"_1") == "undefined") {						
								/*
								parent.roleLookup(options.rolelookup).then( function(roles) {											
								roles.defaults(1).then( 
									function (r1) {  
										parent.storage.setItemSync(options.rolelookup+"_1",r1);
										contract_type["StromDAO-BO.sol_MPO"] = r1; 
										return roles.defaults(2);
									}
								).then(
									function (r2) {  
										parent.storage.setItemSync(options.rolelookup+"_2",r2);
										contract_type["StromDAO-BO.sol_DSO"] = r2; 
										return roles.defaults(3);
									}
								).then(
									function (r3) {  
										parent.storage.setItemSync(options.rolelookup+"_3",r3);
										contract_type["StromDAO-BO.sol_Provider"] = r3; 
										parent.storage.setItemSync(options.rolelookup,contract_type);
									}
								)
							});
							*/
						parent.storage.setItemSync(options.rolelookup+"_1","0x5FB27050934DAd2Fba68ee22841Eca55dD131f57");
						parent.storage.setItemSync(options.rolelookup+"_2","0x08f5409fdEC245ec8d52042982fb7a05fa8114A2");
						parent.storage.setItemSync(options.rolelookup+"_3","0x47E905A8f7627FE0406922B7722e48dc8C6a6ee4");
					} 
					
					contract_type["StromDAO-BO.sol_MPO"]=parent.storage.getItemSync(options.rolelookup+"_1"); 
					contract_type["StromDAO-BO.sol_DSO"]=parent.storage.getItemSync(options.rolelookup+"_2"); 
					contract_type["StromDAO-BO.sol_Provider"]=parent.storage.getItemSync(options.rolelookup+"_3"); 
						
													
					contract_type["StromDAO-BO.sol:MPReading"]="0x0000000000000000000000000000000000000008";
					var roles=[];
					roles[0]=0;
					roles[1]=1;
					roles[2]=2;
					roles[3]=3;
					options.contracts=contract_type;
					options.roles=roles;
					parent.waitForDefaults=false;	
				
					return options;
				} else {
					return options;
				}
}
