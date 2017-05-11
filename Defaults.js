this.deployment=function(options) {
				var contract_type=[];
				contract_type["StromDAO-BO.sol_DSO"]="0x7a0134578718b171168A7Cf73b861662E945a4D3";
				contract_type["StromDAO-BO.sol_MPO"]="0x6Bd0712751bB6EC7D9f57E1a58b19eccd6AE9603";
				contract_type["StromDAO-BO.sol_Provider"]="0x13522cfB417Ec804E821650Cbd8d5a58A3308D70";
				
				contract_type["StromDAO-BO.sol:DSO"]="0x7a0134578718b171168A7Cf73b861662E945a4D3";
				contract_type["StromDAO-BO.sol:MPO"]="0x6Bd0712751bB6EC7D9f57E1a58b19eccd6AE9603";
				contract_type["StromDAO-BO.sol:Provider"]="0x13522cfB417Ec804E821650Cbd8d5a58A3308D70";
				
				var roles=[];
				roles[0]="0x0";
				roles[1]="0x0ccE513Fc5581F636830D15ddA7eD211c211aa63";
				roles[2]="0x72467342DcC4b072AeDB2C4242D98504fa22b17A";
				roles[3]="0x680801b520073B622E097735742DEb6E173d99c7";
				options.contracts=contract_type;
								
				options.rolelookup="0xbc723c385dB9FC5E82e301b8A7aa45819E4c3e8B";
				options.roles=roles;
					
				return options;
		};
