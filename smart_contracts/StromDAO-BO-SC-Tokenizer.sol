pragma solidity ^0.4.2;
contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract MPReading is owned {

	mapping(address=>reading) public readings;
	event Reading(address _meter_point,uint256 _power);
	
	struct reading {
		uint256 time;
		uint256 power;
		
	}
	

	function storeReading(uint256 _reading) {
			readings[tx.origin]=reading(now,_reading);           			
			Reading(tx.origin,_reading);
	}
	
}


contract MPTokenFactory {
	event Built(address _mpt,address _account);
	
	function build(MPReading _reading,address _meterpoint) returns(MPToken) {
		MPToken mptoken = new MPToken(_reading,_meterpoint);
		Built(address(mptoken),msg.sender);
		mptoken.transferOwnership(msg.sender);
		return mptoken;
	}
	
}
contract MPToken is owned {
	MPReading public  reading;
	address public meterpoint;
	uint256 public start_time;
	uint256 public start_power;
	token public power_token;
	token public time_token;
	event Issued(uint256 _time,uint256 _power);
		
	function MPToken(MPReading _reading,address _meterpoint) {
		meterpoint=_meterpoint;
		reading=_reading;
		(start_time,start_power)=reading.readings(meterpoint);
		power_token=new token(0,'Power',0,'Wh');
		time_token=new token(0,'Time',0,'s');		
	} 
	
	function issue() {
		uint256 time;
		uint256 power;
		(time,power)=reading.readings(meterpoint);
		
		if(time<start_time) throw;
		if(power<start_power) throw;
		
		power_token.issue(power-(power_token.totalSupply()+start_power));
		time_token.issue(time-(time_token.totalSupply()+start_time));
		
		Issued(time_token.balanceOf(this),power_token.balanceOf(this));
		power_token.transfer(msg.sender,power_token.balanceOf(this));
		time_token.transfer(msg.sender,time_token.balanceOf(this));		
	}
}

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract token is owned {
    /* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function token(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }

	function issue(uint256 _value) onlyOwner {
			totalSupply+=_value;
			balanceOf[msg.sender]+=_value;
	}
    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /* Approve and then communicate the approved contract in a single tx */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {    
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balanceOf[_from] < _value) throw;                 // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;  // Check for overflows
        if (_value > allowance[_from][msg.sender]) throw;   // Check allowance
        balanceOf[_from] -= _value;                          // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}



