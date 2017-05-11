this.deployment=function(options) {
				var contract_type=[];
				contract_type["StromDAO-BO.sol_DSO"]="0x7a0134578718b171168A7Cf73b861662E945a4D3";
				contract_type["StromDAO-BO.sol_MPO"]="0xc4719B91742D052d0A93F513f59F6Ac15e95D061";
				contract_type["StromDAO-BO.sol_Provider"]="0xd457F18DB9949899263d5bEbd74e74Ef6d2a6624";
				
				contract_type["StromDAO-BO.sol:DSO"]="0x7a0134578718b171168A7Cf73b861662E945a4D3";
				contract_type["StromDAO-BO.sol:MPO"]="0xc4719B91742D052d0A93F513f59F6Ac15e95D061";
				contract_type["StromDAO-BO.sol:Provider"]="0xd457F18DB9949899263d5bEbd74e74Ef6d2a6624";
				
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
