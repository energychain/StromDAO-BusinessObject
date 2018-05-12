pragma solidity ^0.4.2;
contract owned {
	address public owner;

	constructor() public {
		owner = msg.sender;
	}

	modifier onlyOwner {
		if (msg.sender != owner) revert();
		_;
	}

	function transferOwnership(address newOwner) onlyOwner public {
		owner = newOwner;
	}
}



contract tokenRecipient  { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public; }

contract Token is owned {

}

contract MPReading is owned {

	mapping(address=>reading) public readings;
	event Reading(address _meter_point,uint256 _power);

	struct reading {
		uint256 time;
		uint256 power;

	}

	function storeReading(uint256 _reading) public {
			readings[tx.origin]=reading(now,_reading);
			emit Reading(tx.origin,_reading);
	}
}


contract ApexToken is Token {

	string public standard = 'ApexToken 0.3';
	string public name = "ApexToken";
	string public symbol = "💰";
	uint8 public decimals = 8;
	uint256 public totalSupply;
	uint256 public maxSupply;
	address[] public shareHolders;
	mapping (address => uint256) public balanceOf;
	address public oracle;
	uint256 public value=0;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Oracle(address _oracle);
	event Valuation(uint256 _value);
	event Shareholder(address _address);

	uint256 public freeFlow=0;

	constructor(uint256 initialSupply,address _oracle) public {
		balanceOf[msg.sender] = initialSupply;
		totalSupply = initialSupply;
		oracle=_oracle;
	}

	function setOracle(address _oracle) public onlyOwner {
			oracle=_oracle;
			emit Oracle(_oracle);
	}

	function incValue(uint256 _value) public onlyOwner {
			value+=_value;
			emit Valuation(value);
	}

	function setValue(uint256 _value) public onlyOwner {
			value=_value;
			emit Valuation(value);
	}

	function setName(string _name) public onlyOwner {
			name=_name;
	}
	/* Send coins */
	function transfer(address _to, uint256 _value) public {
		if(balanceOf[_to]==0) {
			shareHolders.push(_to);
			emit Shareholder(_to);
		}
		if (balanceOf[msg.sender] < _value) revert();
		if (balanceOf[_to] + _value < balanceOf[_to]) revert();
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		freeFlow=totalSupply-balanceOf[owner];
	}

	function () public {
		revert();
	}
}

contract ApexFund is MPReading {

	string public standard = 'ApexToken 0.9';
	string public name = "ApexFund";
	string public symbol = "💰";
	uint8 public decimals = 8;
	uint256 public totalSupply;
	uint256 public maxSupply;
	address[] public shareHolders;
	mapping (address => uint256) public balanceOf;
	address public oracle;
	uint256 public value=0;
	uint256 public invest=0;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Oracle(address _oracle);
	event Valuation(uint256 _value);
	event Shareholder(address _address);

	uint256 public freeFlow=0;

	function setOracle(address _oracle) public onlyOwner {
			oracle=_oracle;
			emit Oracle(_oracle);
	}

	function setTotalSupply(uint256 _totalSupply) public onlyOwner {
			totalSupply=_totalSupply;
	}
	function setMaxSupply(uint256 _maxSupply) public onlyOwner {
			maxSupply=_maxSupply;
	}

	function setInvest(uint256 _invest) public onlyOwner {
			invest=_invest;
	}
	function incValue(uint256 _value) public onlyOwner {
			value+=_value;
			emit Valuation(value);
	}

	function setValue(uint256 _value) public onlyOwner {
			value=_value;
			emit Valuation(value);
	}

	/* Send coins */
	function transfer(address _to, uint256 _value) public {
		if(balanceOf[_to]==0) {
			shareHolders.push(_to);
			emit Shareholder(_to);
		}
		if (balanceOf[msg.sender] < _value) {
			if(msg.sender!=owner) revert(); else {
						value+=_value;
						totalSupply+=_value;
						emit Valuation(value);
			}
		}
		if (balanceOf[_to] + _value < balanceOf[_to]) revert();
		if(msg.sender!=owner) {
			balanceOf[msg.sender] -= _value;
		} 
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		freeFlow=totalSupply-balanceOf[owner];
	}

	function () public {
		revert();
	}

	uint256 public managed_tokens_cnt=0;

	mapping(address=>reading) public readings;
	mapping(address=>address) public oracles;
	mapping(address=>address) public accounts;
	mapping(address=>uint256) public valuation;
	mapping(address=>uint256) public assets;
	mapping(address=>ApexToken) public preferedToken;

	ApexToken[] public managed_tokens;
	ApexToken public recommended;

	event addedToken(address indexed _token);
	event oracleAccount(address indexed _oracle,address indexed _account,uint256 _valuation);
	event investment(uint256 _invest);

	constructor()  {
		balanceOf[msg.sender] = 0;
		totalSupply = 0;
	}

	function addToken(ApexToken _token) public onlyOwner {
		managed_tokens.push(_token);
		managed_tokens_cnt=managed_tokens.length;
		emit addedToken(_token);
	}
	function removeToken(uint256 _idx) public onlyOwner {
			delete managed_tokens[_idx];
	}
	function storeReading(uint256 _reading) public {
		if(readings[tx.origin].power>_reading) revert();
		if(readings[tx.origin].power!=0) {
			uint256 power_increase = _reading-readings[tx.origin].power;
			if((power_increase>0)&&(readings[tx.origin].power>0)) {
				address accountable = accounts[tx.origin];
				if(accountable!=address(0)) {
					balanceOf[accountable]+=power_increase;
					totalSupply+=power_increase;
					emit Transfer(msg.sender,accountable, power_increase);
					freeFlow=totalSupply-balanceOf[owner];

					ApexToken target = recommended;
					if(address(preferedToken[accountable])!=address(0)) {
						if(preferedToken[accountable].freeFlow()+power_increase<preferedToken[accountable].totalSupply()) {
								target=preferedToken[accountable];
						}
					}
					if(address(target)==address(0)) { revert(); }
					if(assets[target]==0) {
						target.transfer(accountable,power_increase);
					} else {
						target.incValue(valuation[target]*power_increase);
						value+=valuation[target]*power_increase;
					}
					emit Valuation(value);
				}
			}
		}
		readings[tx.origin]=reading(now,_reading);
		emit Reading(tx.origin,_reading);
	}

	function addAssetValue(ApexToken target,uint256 value_increase) public onlyOwner {
			incValue(value_increase);
			target.incValue(value_increase);
			emit Valuation(value);
	}

	function setAssetValue(ApexToken target,uint256 _value) public onlyOwner {
			target.setValue(_value);
	}

	function createAndActivateToken(uint256 _initialSupply,address _oracle,uint256 _valuation) public onlyOwner {
		ApexToken target = new ApexToken(_initialSupply,_oracle);
		addToken(target);
		assets[_oracle]=1;
		assets[target]=1;
		assignOracle(_oracle,target,_valuation);
		invest+=_initialSupply;
		emit investment(invest);
		recommended=target;
	}

	function addTokenValue(ApexToken _token,uint256 _value) public onlyOwner {
			addAssetValue(_token,_value);
	}

	function setRecommendedToken(uint256 idx) public onlyOwner {
		recommended=managed_tokens[idx];
	}

	function setPreferedToken(ApexToken _token) public {
		preferedToken[msg.sender]=_token;
	}
	function transferTokenOwnership(ApexToken _token) public onlyOwner {
			_token.transferOwnership(msg.sender);
	}
	function assignOracle(address _oracle,address _account,uint256 _valuation) public onlyOwner {
		valuation[_account]=_valuation;
		valuation[_oracle]=_valuation;
		oracles[_account]=_oracle;
		accounts[_oracle]=_account;
		emit oracleAccount(_oracle,_account,_valuation);
	}
}

contract ApexCommissions is owned {

	struct commissioninfo {
		address oracle;
		uint256 value_energy;
		uint256 value_time;
		uint256 power_base;
		uint256 time_base;
	}
	struct reading {
		uint256 time;
		uint256 power;

	}
	MPReading public apexfund;

	mapping(address=>commissioninfo) public commissions;

	constructor(MPReading _apexfund) {
			apexfund=_apexfund;
	}

	function commission(address account,address oracle,uint256 value_energy,uint256 value_time,uint256 power,uint256 time) public onlyOwner {
		commissions[account]=commissioninfo(oracle,value_energy,value_time,power,time);
	}

}
