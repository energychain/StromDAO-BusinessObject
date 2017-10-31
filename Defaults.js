this.deployment=function(options) {
				if(typeof options.rpc == "undefined") {
					if(typeof window != "undefined") {
							// options.rpc=location.origin+"/rpc";
							options.rpc='https://demo.stromdao.de/rpc';
						} else {
						options.rpc='https://demo.stromdao.de/rpc';
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
					contract_type["StromDAO-BO.sol_MPSetFactory"]="0xf3FC07380a41119E0acAF5D88dB9E86addeDAA5B";
					contract_type["StromDAO-BO.sol_MPRSetFactory"]="0x8Ca4E5A443a09425af1F9e1792619A39e28abEF4";
					contract_type["StromDAO-BO.sol_MPRDecorateFactory"]="0x599A82fF93533220b2e6E529477342b484DB2d73";
					contract_type["StromDAO-BO.sol_SettlementFactory"]="0x6dE580411a5432D0A5Bd304b42C3a2b8A3710E50";
					contract_type["StromDAO-BO.sol_ClearingFactory"]="0x2E3F061534A3A1D57F51f57f32bf7c8fe80e6621";
					contract_type["StromDAO-BO.sol_SingleClearingFactory"]="0x3Df3fF97B8F93BbdAeB7C945bAdf32016C369212";
					contract_type["StromDAO-BO.sol_DirectClearingFactory"]="0xA88C076bbf5C50d2e35f89f285D373bEd636FD87";
					contract_type["StromDAO-BO.sol_StromkontoProxyFactory"]="0xDD106606C4100BA9DAA092690AE6AF849c81bC7F";
					contract_type["StromDAO-BO.sol_Transferable"]="0x5856b2AE31ed0FCf82F02a4090502DC5CCEec93E";
					contract_type["StromDAO-BO.sol_AssetsLiabilitiesFactory"]="0x98C1E2Eb8C921197066A75AD0ceE6c9852113Df3";					
					contract_type["StromDAO-BO.sol_MPTokenFactory"]="0x604Caaa72ea8cfCf64179079c30D4168D5bd87bc";
					contract_type["StromDAO-BO.sol_XTokenFactory"]="0x814e1eEE776b00D3285913dADceb2ff6DeEFea51";
					contract_type["StromDAO-BO.sol_CUTokenFactory"]="0x392c6a3482ffd600fF8C2b816b09d6613ad61BC4";
					
											
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
