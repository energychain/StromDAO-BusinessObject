this.deployment=function(options) {
				var contract_type=[];
				contract_type["StromDAO-BO.sol_DSO"]="0x2ff19e1A98C0FbEE5B72951393008D1f865ccA96";
				contract_type["StromDAO-BO.sol_MPO"]="0x7ac4083492942eDee3B9a0A664c7EAB6473795fa";
				contract_type["StromDAO-BO.sol_Provider"]="0x0161C279E54E7d4f7b4410272e0019F703dE055B";
				
				contract_type["StromDAO-BO.sol:DSO"]="0x2ff19e1A98C0FbEE5B72951393008D1f865ccA96";
				contract_type["StromDAO-BO.sol:MPO"]="0x7ac4083492942eDee3B9a0A664c7EAB6473795fa";
				contract_type["StromDAO-BO.sol:Provider"]="0x0161C279E54E7d4f7b4410272e0019F703dE055B";
				
				var roles=[];
				roles[0]=0;
				roles[1]=1;
				roles[2]=2;
				roles[3]=3;
				options.contracts=contract_type;
								
				options.rolelookup="0xCd4c500672A3A0c945462354c6A13b6a866baf17";
				options.roles=roles;
					
				return options;
		};
