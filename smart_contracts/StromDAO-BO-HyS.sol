pragma solidity ^0.4.2;
contract owned {
    address public owner;

    function owned() public {
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


contract TxHandler is owned  {	
	  function addTx(address _from,address _to, uint256 _value,uint256 _base) onlyOwner { }	
}

contract Stromkonto is TxHandler {
 
	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Tx(address _from,address _to, uint256 _value,uint256 _base,uint256 _from_soll,uint256 _from_haben,uint256 _to_soll,uint256 _to_haben);
	
	mapping (address => uint256) public balancesHaben;
	mapping (address => uint256) public balancesSoll;
	
	mapping (address => uint256) public baseHaben;
	mapping (address => uint256) public baseSoll;
	uint256 public sumTx;
	uint256 public sumBase;
	
	function transfer(address _to, uint256 _value) returns (bool success) { return false; throw;}
	

	function balanceHaben(address _owner) constant returns (uint256 balance) { return balancesHaben[_owner]; }
	
	function balanceSoll(address _owner) constant returns (uint256 balance) { return balancesSoll[_owner]; }

	
	function addTx(address _from,address _to, uint256 _value,uint256 _base) onlyOwner {}
	
}


contract StromkontoProxy is Stromkonto {
		
		mapping(address=>bool) public allowedSenders;
		
		address public receipt_asset;
		address public receipt_liability;
		
		
		function StromkontoProxy() public { }
		function modifySender(address _who,bool _allow) public onlyOwner {	}
				
		
		function setReceiptAsset(address _address) public { }
		
		function setReceiptLiablity(address _address) public {	}		
}

contract StromkontoProxyFactory {
	event Built(address _sp,address _account);
	
	function build() returns(StromkontoProxy) {
		
	}	
}

contract HySM  is owned,MPReading {
	
	StromkontoProxy public stromkonto;
	HySToken public current_hystoken;
	mapping(address=>reading) public readings;
	mapping(address=>reading) public commissioning;
	mapping(address=>commissioninfo) public commissions;
	mapping(address=>address) public hysoracles;
	 
	HySToken[] public managed_tokens;
	uint256 public managed_tokens_cnt=0;
	uint256 public active_token_idx=0;	
	
	struct commissioninfo {
		address account;
		address oracle;
		uint256 value_energy;
		uint256 value_time;		
	}
	event Reading(address _meter_point,uint256 _power);
	event Commissioning(address account,address oracle,uint256 value_energy,uint256 value_time);
	
	
	function HySM(StromkontoProxyFactory _stromkontoproxyfactory ) public {
			stromkonto = _stromkontoproxyfactory.build();
			stromkonto.modifySender(msg.sender,true);
	}
	
	function modifyTxSender(address _who,bool _allow) onlyOwner public {
		    stromkonto.modifySender(_who,_allow);
	}
	
	function storeReading(uint256 _reading) public {
		if(readings[tx.origin].power==(0)) {
			commissioning[tx.origin]=reading(now,_reading); 			
		} 
		readings[tx.origin]=reading(now,_reading);   		
		emit Reading(tx.origin,_reading);
		if(address(current_hystoken)!=address(0)) {
			address oracle=commissions[tx.origin].account;
			if(oracle==address(0)) oracle=tx.origin;
			if(hysoracles[oracle]==address(0)) {
				// Only allow to receive tokens for reading if not an oracle of asset
				current_hystoken.storeDelegatedReading(oracle,_reading);	
			}
		}
	}	
	
	function setActiveTokenIdx(uint256 _active_token_idx) onlyOwner {
		active_token_idx=_active_token_idx;
		current_hystoken=managed_tokens[_active_token_idx];		
	}
	
	function commission(address _account,address _oracle,uint256 _value_energy,uint256 _value_time) onlyOwner public {
		  commissions[_account]=commissioninfo(_account,_oracle,_value_energy,_value_time);
		  commissions[_oracle]=commissioninfo(_account,_oracle,_value_energy,_value_time);
		  commissioning[_oracle]=readings[_oracle];				  
		  emit Commissioning(_account,_oracle,_value_energy,_value_time);  
	}
			
	function createHySToken(uint256 _max_supply,uint256 _credit,address _account,address _oracle,uint256 _value_energy,uint256 _value_time) onlyOwner public {
		HySToken _token = new HySToken();				
		managed_tokens.push(_token);
		managed_tokens_cnt=managed_tokens.length;
		_token.setMaxSupply(_max_supply);
		stromkonto.addTx(address(_token),address(this),_credit,0);
		commissions[address(_token)]=commissioninfo(_account,_oracle,_value_energy,_value_time);
		hysoracles[_oracle]=address(_token);		
	}
	
	function transferHySToken(address _new_owner,HySToken _token) onlyOwner public {
			_token.transferOwnership(_new_owner);		
	} 
	
	function setStromkontoProxy(StromkontoProxy _stromkontoproxy) onlyOwner public {	
		stromkonto.transferOwnership(msg.sender);	
		stromkonto=_stromkontoproxy;
	}
		
}
contract HySToken is MPReading,Token {
    mapping(address=>reading) public readings;
    mapping(address=>address) public delegations;
	event Reading(address _meter_point,uint256 _power);
	event Delegate(address _oracle,address _account);
	function storeReading(uint256 _reading) public {	    
		    if(readings[tx.origin].power>(0)) {
				if(totalSupply+_reading-readings[tx.origin].power<maxSupply) {
					totalSupply+=_reading-readings[tx.origin].power;
					if((balanceOf[tx.origin]==0)&&(delegations[tx.origin]!=address(0))) {
						shareHolders.push(tx.origin);	
					}
					balanceOf[tx.origin]+=_reading-readings[tx.origin].power;	
				} else {
					// Funding Goal Reached but no Exception thrown! As we have to set in HySM next Token															
				}
			}        			
			readings[tx.origin]=reading(now,_reading);   			
			emit Reading(tx.origin,_reading);
			if(delegations[tx.origin]!=address(0)) {
					transfer(delegations[tx.origin],balanceOf[tx.origin]);
			}
	}	
	function storeDelegatedReading(address _account,uint256 _reading) public onlyOwner {
	    
		    if(readings[_account].power>(0)) {
				if(totalSupply+_reading-readings[_account].power<maxSupply) {
					totalSupply+=_reading-readings[_account].power;
					if((balanceOf[_account]==0)&&(delegations[_account]!=address(0))) {
						shareHolders.push(tx.origin);	
					}
					balanceOf[_account]+=_reading-readings[_account].power;	
				} else revert();
			}        			
			readings[_account]=reading(now,_reading);   			
			emit Reading(_account,_reading);
			if(delegations[_account]!=address(0)) {
					transfer(delegations[_account],balanceOf[_account]);
			}
	}	
	    
    string public standard = 'HySToken 0.2';
    string public name = "HySToken";
    string public symbol = "💰";
    uint8 public decimals = 3;
    uint256 public totalSupply;
	uint256 public maxSupply;
	address[] public shareHolders;    
    mapping (address => uint256) public balanceOf;    
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function HySToken() public {
        balanceOf[msg.sender] = 0;              // Give the creator all initial tokens
        totalSupply = 0;                        // Update total supply     
        maxSupply = 0;   
    }

	function issue(uint256 _value) onlyOwner public {
			totalSupply+=_value;
			balanceOf[msg.sender]+=_value;
	}
	function addDelegation(address oracle,address investor) onlyOwner public {
			delegations[oracle]=investor;
	}
	function setMaxSupply(uint256 _maxSupply) onlyOwner public {
			maxSupply=_maxSupply;
	}
    /* Send coins */
    function transfer(address _to, uint256 _value) public {
		if(balanceOf[_to]==0) {
			shareHolders.push(_to);		
		}
        if (balanceOf[msg.sender] < _value) revert();           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) revert(); // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        emit Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    function () public {
        revert();     // Prevents accidental sending of ether
    }
}
