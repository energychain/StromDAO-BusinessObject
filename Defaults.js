this.deployment=function(options) {
				if(typeof options.rpc == "undefined") {
					if(typeof window != "undefined") {
						options.rpc=location.origin+"/rpc";
						} else {
						options.rpc='http://app.stromdao.de:8081/rpc';
					}
				}
						
				return options;
		};
this.loadDefaults=function(options) {
				if(typeof parent.waitForDefaults == "undefined") {
					parent.waitForDefaults = true;
					options.rolelookup="0x0000000000000000000000000000000000000006";
					options.defaultReading="0x0000000000000000000000000000000000000008";
					
					var contract_type=[];
					
					parent.storage.setItemSync(options.rolelookup+"_1","0x08f5409fdEC245ec8d52042982fb7a05fa8114A2");
					parent.storage.setItemSync(options.rolelookup+"_2","0x5FB27050934DAd2Fba68ee22841Eca55dD131f57");
					parent.storage.setItemSync(options.rolelookup+"_3","0xe9E343883297f3ED5Dd25Dc31387387cba2a8F1c");
					
					contract_type["StromDAO-BO.sol_MPO"]=parent.storage.getItemSync(options.rolelookup+"_1"); 
					contract_type["StromDAO-BO.sol_DSO"]=parent.storage.getItemSync(options.rolelookup+"_2"); 
					contract_type["StromDAO-BO.sol_Provider"]=parent.storage.getItemSync(options.rolelookup+"_3"); 
						
													
					contract_type["StromDAO-BO.sol:MPReading"]="0x0000000000000000000000000000000000000008";
					contract_type["StromDAO-BO.sol_DirectChargingFactory"]="0x6B24c0ea21f4002d35E850bf0f132EeBEb191b7d";
					contract_type["StromDAO-BO.sol_DirectConnectionFactory"]="0x2bb4Aa9b328633C28B5ad797995E2bA91177D2b7";
					contract_type["StromDAO-BO.sol_DirectBalancingGroupFactory"]="0x853c478C2ecc83D1BCa274D00a8D2dff0fAf1304";
					contract_type["StromDAO-BO.sol_StringStorageFactory"]="0xdbD614e0567f37C64e815DEBa321A919CE228d1D";
					contract_type["StromDAO-BO.sol_MPSetFactory"]="0x58c0A0465a4F38eeA992154ABD7cfA7f2d04AFF3";
					contract_type["StromDAO-BO.sol_MPRSetFactory"]="0x6822cBA0DE49d9Ab97757A3F89a16b8b3aa4FDE1";
					contract_type["StromDAO-BO.sol_MPRDecorateFactory"]="0x019c77428a873F39Be57563C926D2b5dfc85175f";
					contract_type["StromDAO-BO.sol_SettlementFactory"]="0x2abd0380408674852c14Ba17692851d6fAAaa395";
					contract_type["StromDAO-BO.sol_ClearingFactory"]="0x0fa57AbE7Bb67e0D3eE04A344A1Ab343edb960af";
					contract_type["StromDAO-BO.sol_StromkontoProxyFactory"]="0x9DE3120F406D7A39C5e0110B2E372930308d641b";
											
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
