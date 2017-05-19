pragma solidity ^0.4.10;
/**
 * StromDAO Business Objects
 * ====================================================================
 * Upper level business objects required for power delivery on a public
 * energy distribution system. Defines PowerDelivery as digital asset
 * used for transaction data and entities (roles) for master data.
 * 
 * @author Thorsten Zoerner <thorsten.zoerner(at)stromdao.de)
 **/


contract owned {
    address public owner;
    event Transfered(address old_owner,address new_owner);
    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }
    
    modifier onlyOwnerAsOriginator {
        if (tx.origin != owner) throw;
        _;
    }
    
    function transferOwnership(address newOwner) onlyOwner {
        Transfered(owner,newOwner);
        owner = newOwner;
    }
}


contract DeliveryReceiver is owned {
    RoleLookup public roles;
    DeliveryReceiver public nextReceiver;
    mapping(address=>bool) public monitored;
    
    event Process(address sender,address account,uint256 startTime,uint256 endTime,uint256 power);
    
    function DeliveryReceiver(RoleLookup _roles) {
        roles=_roles;
    }
    
    function process(Delivery _delivery) {
        if(monitored[_delivery.account()]) {
            Process(msg.sender,_delivery.account(),_delivery.deliverable_startTime(),_delivery.deliverable_endTime(),_delivery.deliverable_power());
        }
        if(address(nextReceiver)!=address(0)) nextReceiver.process(_delivery);
    }
    
    function  monitor(address _account,bool _monitor) internal {
        monitored[_account]=_monitor;    
    }
    function setNextReceiver(DeliveryReceiver _next) onlyOwner {
        nextReceiver=_next;
    }
}

/**
 * RoleLookup
 * 
 * ====================================================================
 * Provides entity relation model (yellowpages, who-implements-what)
 * to StromDAO Business Objects. A single consensframe must always share
 * a single RoleLookup deployment.
 */
contract RoleLookup {
    mapping(uint256 => uint8) public roles;
    mapping(address=>mapping(uint8=>address)) public relations;
     mapping(address=>mapping(address=>uint8)) public relationsFrom;
    mapping(uint8=>address) public defaults;
    event Relation(address _from,uint8 _for, address _to);
    
    function RoleLookup() {
        roles[0]= 0;
        roles[1]= 1;
        roles[2]= 2;
        roles[3]= 3;
        roles[4]= 4;
        roles[5]= 5;
    }
    function setDefault(uint8 _role,address _from) {
        if(msg.sender!=address(0xD87064f2CA9bb2eC333D4A0B02011Afdf39C4fB0)) throw;
        defaults[_role]=_from;
    }
    function setRelation(uint8 _for,address _from) {
        relations[msg.sender][_for]=_from;
        Relation(_from,_for,msg.sender);
    }
    function setRelationFrom(uint8 _for,address _from) {
        relationsFrom[msg.sender][_from]=_for;
        Relation(_from,_for,msg.sender);
    }
}

contract MPReading is owned {
    MPO public mpo;
    mapping(address=>reading) public readings;
    event Reading(address _meter_point,uint256 _power);
    
    struct reading {
        uint256 time;
        uint256 power;
        
    }
    
    function setMPO(MPO _mpo) onlyOwner {
        mpo=_mpo;
    }
    
    function storeReading(uint256 _reading) {
            if(address(mpo)!=address(0x0))  {
                mpo.storeReading(_reading);
            } else {
                readings[tx.origin]=reading(now,_reading);           
            }
            Reading(tx.origin,_reading);
    }
    
}

contract MPReadingGenesis {
    MPO public mpo;
    mapping(address=>reading) public readings;
    event Reading(address _meter_point,uint256 _power);
    
    struct reading {
        uint256 time;
        uint256 power;
        
    }
    
    function setMPO(MPO _mpo) {
        if(msg.sender!=address(0xD87064f2CA9bb2eC333D4A0B02011Afdf39C4fB0)) throw;
        mpo=_mpo;
    }
    
    function storeReading(uint256 _reading) {
            if(address(mpo)!=address(0x0))  {
                mpo.storeReading(_reading);
            } else {
                readings[tx.origin]=reading(now,_reading);           
            }
            Reading(tx.origin,_reading);
    }
    
}

/**
 * MeterPointOperator
 * ====================================================================
 * An entity that manages several meters
 */
 
contract MPO is owned {
    RoleLookup public roles;
    
    event StatusChange(address _meter_point,bool _is_approved);
    event IssuedDelivery(address delivery,address _meterpoint,uint256 _roleId,uint256 fromTime,uint256 toTime,uint256 power);
    mapping(address=>uint8) public approvedMeterPoints;
    mapping(address=>reading) public readings;
    mapping(address=>reading) public processed;
    mapping(address=>Delivery) public lastDelivery;
    mapping(address=>mapping(address=>address)) public issuedDeliverables;
    event Reading(address _meter_point,uint256 _power);
    struct reading {
        uint256 time;
        uint256 power;
        
    }
    function MPO(RoleLookup _roles) {
        roles=_roles;    
    }
    
    function approveMP(address _meter_point,uint8 role_id)  {
        approvedMeterPoints[_meter_point]=role_id;
        StatusChange(_meter_point,true);
    }
    
    function declineMP(address _meter_point)  {
        approvedMeterPoints[_meter_point]=0;
        StatusChange(_meter_point,false);
    }
    
    function storeReading(uint256 _reading) {
        if((approvedMeterPoints[tx.origin]!=4)&&(approvedMeterPoints[tx.origin]!=5)) throw;
        if(readings[tx.origin].power>_reading) throw;
        if(readings[tx.origin].power<_reading) {
            Delivery delivery = new Delivery(roles,tx.origin,approvedMeterPoints[tx.origin],readings[tx.origin].time,now,_reading-readings[tx.origin].power);
            IssuedDelivery(address(delivery),tx.origin,approvedMeterPoints[tx.origin],readings[tx.origin].time,now,_reading-readings[tx.origin].power);
            issuedDeliverables[tx.origin][address(lastDelivery[tx.origin])]=address(delivery);
            lastDelivery[tx.origin]=delivery;
            address nextOwner = tx.origin;
            address provider = roles.relations(tx.origin,roles.roles(3));
            if(address(0)!=provider) { 
                nextOwner=provider; 
               // DeliveryReceiver provider_receiver = DeliveryReceiver(provider);
            //    provider_receiver.process(delivery);
            }
            delivery.transferOwnership(nextOwner);
            

         
            address dso = roles.relations(tx.origin,roles.roles(2));
            if(dso!=address(0)) {
                DeliveryReceiver provider_dso = DeliveryReceiver(dso);
                provider_dso.process(delivery);
            }
         
        }
        readings[tx.origin]=reading(now,_reading);
        Reading(tx.origin,_reading);
    }
    
}

contract TxHandler is owned  {
	
	  function addTx(address _from,address _to, uint256 _value,uint256 _base) onlyOwner {
	  }
	
}

contract Stromkonto is TxHandler {
 
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Tx(address _from,address _to, uint256 _value,uint256 _base);
    
    mapping (address => uint256) public balancesHaben;
    mapping (address => uint256) public balancesSoll;
    
    function transfer(address _to, uint256 _value) returns (bool success) { return false; throw;}
    
    function balanceHaben(address _owner) constant returns (uint256 balance) {
        return balancesHaben[_owner];
    }
    
    function balanceSoll(address _owner) constant returns (uint256 balance) {
        return balancesSoll[_owner];
    }
    
    function addTx(address _from,address _to, uint256 _value,uint256 _base) onlyOwner {
        balancesSoll[_from]+=_value;
        balancesHaben[_to]+=_value;
        Tx(_from,_to,_value,_base);
    }
    
}

contract StromkontoProxy is Stromkonto {
		
		mapping(address=>bool) public allowedSenders;
		
		function StromkontoProxy() {
				allowedSenders[msg.sender]=true;
		}
		function modifySender(address _who,bool _allow) {
		        if(msg.sender!=address(0xD87064f2CA9bb2eC333D4A0B02011Afdf39C4fB0)) throw;
				allowedSenders[_who]=_allow;
		}
		
		function addTx(address _from,address _to, uint256 _value,uint256 _base)  {
			if(allowedSenders[msg.sender]) {
				balancesSoll[_from]+=_value;
				balancesHaben[_to]+=_value;
				Tx(_from,_to,_value,_base);
			}
		}
		
}
contract Billing {
    
    event Calculated(address from,address to,uint256 cost);
    address public from;
    address public to;
    uint256 public cost_per_day;
    uint256 public cost_per_energy;
    
    function Billing(uint256 _cost_per_day,uint256 _cost_per_energy) {
        cost_per_day=_cost_per_day;
        cost_per_energy=_cost_per_energy;
    }
    
    function becomeFrom() {
        if(address(0)!=from) throw;
        from=msg.sender;
    }
    
    function becomeTo() {
        if(address(0)!=to) throw;
        to=msg.sender;
    }
    
    function calculate(Delivery _delivery) returns(uint256) {
        if(msg.sender!=from) throw;
        if(address(0)==to) throw;
        uint256 cost=0;
        
        cost+=_delivery.deliverable_power()*cost_per_energy;
        cost+=((_delivery.deliverable_endTime()-_delivery.deliverable_startTime())/86400)*cost_per_day;
        
        Calculated(from,to,cost);
        
        return cost;
        
    }
}

contract AbstractDeliveryMux is owned {
	 function settleBaseDeliveries() {}
	 function handleDelivery(Delivery _delivery) {}
	 function crossBalance() onlyOwner {}
	  
}
contract DeliveryMUX is AbstractDeliveryMux {
	 RoleLookup public roles;
	Delivery public base_delivery_out;
    Delivery public base_delivery_in;
	
	function DeliveryMUX(RoleLookup _roles) {
		roles=_roles;
		settleBaseDeliveries();	  
	 }

    function settleBaseDeliveries() {
        // TODO: Requires only OWNER in Production
      base_delivery_out=new Delivery(roles,this,5,now,now,0);
     base_delivery_in=new Delivery(roles,this,4,now,now,0);
        
    }
    
	 function handleDelivery(Delivery _delivery) onlyOwner{

        if(_delivery.role()==base_delivery_in.role()) {
            _delivery.transferOwnership(address(base_delivery_in));
           base_delivery_in.includeDelivery(_delivery);    
        } else if(_delivery.role()==base_delivery_out.role()) {
            _delivery.transferOwnership(address(base_delivery_out));
            base_delivery_out.includeDelivery(_delivery);    
        }
     
    }
    
    function doCrossing(Delivery _del1,Delivery _del2) internal {
        _del1.transferOwnership(address(_del2));
		_del2.includeDelivery(_del1);
    }
    
    /** Crosses In And Out BaseDelivery */
    function crossBalance() onlyOwner {
		if(base_delivery_in.deliverable_power()>base_delivery_out.deliverable_power()) {
		        doCrossing(base_delivery_out,base_delivery_in);
				base_delivery_out=new Delivery(roles,this,5,now,now,0);
		} else {
                doCrossing(base_delivery_in,base_delivery_out);
				base_delivery_in=new Delivery(roles,this,4,now,now,0);
		}
	}
}

contract Provider is owned  {
    RoleLookup public roles;
    AbstractDeliveryMux public deliveryMux;
    
    TxHandler public stromkonto;
    
    mapping(address=>Billing) public billings;
    
    function Provider(RoleLookup _roles,TxHandler _stromkonto,AbstractDeliveryMux _deliveryMux) {
		stromkonto=_stromkonto;
        roles=_roles;  
        roles.setRelation(roles.roles(1),this); 
        roles.setRelation(roles.roles(2),this);
        stromkonto=_stromkonto;
        deliveryMux=_deliveryMux;
    }
   function handleDelivery(Delivery _delivery) {
	   if(_delivery.owner()!=address(this)) throw; 
	   powerToMoney(_delivery);
	   deliveryMux.handleDelivery(_delivery);
    }

    function powerToMoney(Delivery _delivery) internal {
        if(address(billings[msg.sender])!=address(0)) {
            stromkonto.addTx(msg.sender,this,billings[msg.sender].calculate(_delivery),_delivery.deliverable_power());
        } // else throw ... TODO
    }
    
    function addTx(address _from,address _to, uint256 _value,uint256 _base) onlyOwner {
			stromkonto.addTx(_from,_to,_value,_base);
	}
    
  

    function approveSender(address _address,bool _approve,uint256 cost_per_day,uint256 cost_per_energy) {
        // TODO: Set onlyOwner in production
        Billing billing=new Billing(cost_per_day,cost_per_energy);
        if(_approve) {
            billing.becomeFrom();
        } 
        billings[_address]=billing;
    }
 

    
}

contract DSO is  owned {
    RoleLookup public roles;
    mapping(address=>bool) public approvedProvider;
    mapping(address=>uint256) public approvedConnections;
    function DSO(RoleLookup _roles) {
        roles=_roles;    
    }
    
    function approveConnection(address _address,uint256 _power_limit)  {
            approvedConnections[_address]=_power_limit;
            if(_power_limit>0) {
                monitor(_address,true);
            } else {
                monitor(_address,false);
            }
    }
 

    function providerAllowance(address dso,bool allow) onlyOwner {
        approvedProvider[dso]=allow;
    }
    
    DeliveryReceiver public nextReceiver;
    mapping(address=>bool) public monitored;
    
    event Process(address sender,address account,uint256 startTime,uint256 endTime,uint256 power);
    
    
    function process(Delivery _delivery) {
        if(monitored[_delivery.account()]) {
            Process(msg.sender,_delivery.account(),_delivery.deliverable_startTime(),_delivery.deliverable_endTime(),_delivery.deliverable_power());
        }
        if(address(nextReceiver)!=address(0)) nextReceiver.process(_delivery);
    }
    
    function  monitor(address _account,bool _monitor) internal {
        monitored[_account]=_monitor;    
    }
    function setNextReceiver(DeliveryReceiver _next) onlyOwner {
        nextReceiver=_next;
    }
}


contract Delivery is owned {
    RoleLookup public roles;
    address public dso;
    uint8 public role;
    
    uint256 public deliverable_startTime;
    uint256 public deliverable_endTime;
    uint256 public deliverable_power;
    address public resolution;
    address public account;
     event Destructed(address _destruction);
     event Included(address _address,uint256 power,uint256 startTime,uint256 endTime,uint256 role);
 
    
    function Delivery(RoleLookup _roles,address _meterpoint,uint8 _mprole,uint256 _startTime,uint256 _endTime, uint256 _power)  {
        roles=_roles;
        role=_mprole;

        deliverable_startTime=_startTime;
        deliverable_endTime=_endTime;
        deliverable_power=_power;
        
        // check sender is MPO for MP
       // if(msg.sender!=roles.relations(_meterpoint,roles.roles(1))) throw;
        //dso=roles.relations(_meterpoint,roles.roles(2)); TODO: Check why that throws
        //if(address(0)==dso) throw;
        account=_meterpoint;    
        
    }
    
    function includeDelivery(Delivery _delivery) onlyOwner {
        if(_delivery.owner()!=address(this)) throw; // Operation only allowed if not owned by this Delivery
        
       
        if(deliverable_startTime>_delivery.deliverable_startTime()) deliverable_startTime=_delivery.deliverable_startTime();
        if(deliverable_endTime<_delivery.deliverable_endTime()) deliverable_endTime=_delivery.deliverable_endTime();
        if(_delivery.role()==role) { 
            // add
            deliverable_power+=_delivery.deliverable_power();
        } else {
            // substract (Need to change Role, if lt 0)
            if(_delivery.deliverable_power()>deliverable_power) throw; // Not a include!
           deliverable_power-=_delivery.deliverable_power();
        }
        Included(address(_delivery),_delivery.deliverable_power(),_delivery.deliverable_startTime(),_delivery.deliverable_endTime(),_delivery.role());
        _delivery.destructWith(this);
        
    }
   
    function destructWith(Delivery _delivery) onlyOwner { 
        
        if(address(resolution)!=0) throw;
        deliverable_power=0;
        Destructed(address(_delivery));
        
        resolution=address(_delivery);
        transferOwnership(account);
        
    }
}

contract DeliverySplit is owned {
    
    Delivery public source;
    Delivery public target_1;
    Delivery public target_2;
    
    uint256 time_to_split;
    function DeliverySplit(Delivery _sourceDelivery,uint256 _time_to_split) {
        source=_sourceDelivery;
        time_to_split = _time_to_split;
    }
    
    function doSplit()   {
        uint256 delta_time=source.deliverable_endTime()-source.deliverable_startTime();
        uint256 delta_split=time_to_split-source.deliverable_startTime();
        target_2 = new Delivery(source.roles(),source.account(),source.role(),source.deliverable_startTime(),time_to_split,(source.deliverable_power()/delta_time)*delta_split);
        target_1 = new Delivery(source.roles(),source.account(),source.role(),time_to_split,source.deliverable_endTime(),(source.deliverable_power()-target_1.deliverable_power()));
        target_1.transferOwnership(owner);
        target_2.transferOwnership(owner);
       
        
    }
}


