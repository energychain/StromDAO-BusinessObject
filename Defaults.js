this.deployment=function(options) {
				var contract_type=[];
				contract_type["StromDAO-BO.sol_DSO"]="0xD3F73Ef3939bb284646F88b4b2b47d5c7F4D7bC1";
				contract_type["StromDAO-BO.sol_MPO"]="0xCEaf534d3be165Be54D393D0c5548DA7f589467a";
				contract_type["StromDAO-BO.sol_Provider"]="0x66bBCF6e888AA672DDF3DD80217C23f22f7633Fe";
				
				contract_type["StromDAO-BO.sol:DSO"]="0xD3F73Ef3939bb284646F88b4b2b47d5c7F4D7bC1";
				contract_type["StromDAO-BO.sol:MPO"]="0xCEaf534d3be165Be54D393D0c5548DA7f589467a";
				contract_type["StromDAO-BO.sol:Provider"]="0x66bBCF6e888AA672DDF3DD80217C23f22f7633Fe";
				
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
