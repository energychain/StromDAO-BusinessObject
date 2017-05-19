this.deployment=function(options) {
				if(typeof options.rpc == "undefined") options.rpc='http://app.stromdao.de:8081/rpc';
				return options;
		};
this.loadDefaults=function(options) {
				if(typeof parent.waitForDefaults == "undefined") {
					parent.waitForDefaults = true;
					options.rolelookup="0x7B4B8A73f08cc85De6e183deC814077347e26dAF";
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
						parent.storage.setItemSync(options.rolelookup+"_1","0x04f6d471bF3b17A4fCC896406A40FFC89A096474");
						parent.storage.setItemSync(options.rolelookup+"_2","0xa7a1828060f6A83FE30b6717A877FacD049f7aDe");
						parent.storage.setItemSync(options.rolelookup+"_3","0x2fEFd9Ea1E7BE78594d3a7222cF9df5400A48b7a");
					} 
					
					contract_type["StromDAO-BO.sol_MPO"]=parent.storage.getItemSync(options.rolelookup+"_1"); 
					contract_type["StromDAO-BO.sol_DSO"]=parent.storage.getItemSync(options.rolelookup+"_2"); 
					contract_type["StromDAO-BO.sol_Provider"]=parent.storage.getItemSync(options.rolelookup+"_3"); 
						
													
					contract_type["StromDAO-BO.sol:MPReading"]="0x6177CeFF392b920881BE7e4789c4B7C075B7Eb64";
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
