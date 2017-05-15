this.deployment=function(options) {
				var contract_type=[];
				contract_type["StromDAO-BO.sol_DSO"]="0x3D8bB3f14e332ae56bf97E2BddB24a3E1c87bcfb";
				contract_type["StromDAO-BO.sol_MPO"]="0xa037ce97716720C27D67E65Bfcb61b5D315410be";
				contract_type["StromDAO-BO.sol_Provider"]="0x23b0209Bc95dc71f8fc29e526C438C8F4332E4e6";
				
				contract_type["StromDAO-BO.sol:DSO"]="0x3D8bB3f14e332ae56bf97E2BddB24a3E1c87bcfb";
				contract_type["StromDAO-BO.sol:MPO"]="0xa037ce97716720C27D67E65Bfcb61b5D315410be";
				contract_type["StromDAO-BO.sol:Provider"]="0x23b0209Bc95dc71f8fc29e526C438C8F4332E4e6";
				
				var roles=[];
				roles[0]=0;
				roles[1]=1;
				roles[2]=2;
				roles[3]=3;
				options.contracts=contract_type;
								
				options.rolelookup="0xEC899C1B2CcAEcb3EFA6733CA249aBa58228e883";
				options.roles=roles;
					
				return options;
		};
