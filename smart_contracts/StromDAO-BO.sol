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
        owner = newOwner;
    }
}

/** Roles and Responsibility */
contract Role is owned { string  public role = 'stub'; } /**< Abstract stub for Roles */

contract RoleMPO is Role { string  public role = 'mpo'; } /**< Role Inheritance for Meter Point Operator */

contract RoleDSO is Role { string  public role = 'dso'; } /**< Role Inheritance for Grid Operators */

contract RoleProvider is Role { string  public role = 'provider'; } /**< Role Inheritance for Utilities */

contract RoleActor is Role { string public role = 'actor'; } /**< Role Inheritance for general actors (0) */

contract RoleSource is Role { string public role = 'sourceOfEnergy'; } /**< Role provides Source of Energy */
contract RoleTarget is Role { string public role = 'targetOfEnergy'; } /**< Role consume/uses Energy  */

/**
 * RoleLookup
 * ====================================================================
 * Provides entity relation model (yellowpages, who-implements-what)
 * to StromDAO Business Objects. A single consensframe must always share
 * a single RoleLookup deployment.
 */
contract RoleLookup is owned {
    mapping(uint256 => Role) public roles;
    mapping(address=>mapping(address=>address)) public relations;
    
    event Relation(address _from,Role _for, address _to);
    
    function RoleLookup() {
        roles[0]= (Role (new RoleActor())); // Generic Role as actor
        roles[1]= (Role (new RoleMPO()));
        roles[2]= (Role (new RoleDSO()));
        roles[3]= (Role (new RoleProvider()));
        roles[4]= (Role (new RoleSource()));
        roles[5]= (Role (new RoleTarget()));
    }
    function setRelation(Role _for,address _from) {
        relations[msg.sender][_for]=_from;
        Relation(_from,_for,msg.sender);
    }
    function setRelationOnBehalf(Role _for,address _from,address _to)  onlyOwnerAsOriginator {
        relations[_to][_for]=_from;
        Relation(_from,_for,msg.sender);
    }
    
    function deleteRelation(Role _for, address _to) onlyOwner {
        relations[_to][_for]=address(0);
        Relation(_to,_for,address(0));
    }
    
    function replaceRole(uint256 _role_id,Role _role) onlyOwner {
        roles[_role_id]=_role;
    }
}

/**
 * MeterPointOperator
 * ====================================================================
 * An entity that manages several meters
 */
 
contract MPO is RoleMPO {
    RoleLookup public roles;
    
    event StatusChange(address _meter_point,bool _is_approved);
    event ProcessedClearance(address _meterpoint,Clearable _clearable,uint256 power);
    event IssuedDelivery(address delivery,address _meterpoint,uint256 fromTime,uint256 toTime,uint256 power);
    mapping(address=>bool) public approvedMeterPoints;
    mapping(address=>reading) public readings;
    mapping(address=>reading) public processed;
    mapping(address=>Delivery) public lastDelivery;
    
    struct reading {
        uint256 time;
        uint256 power;
        
    }
    function MPO(RoleLookup _roles) {
        roles=_roles;    
    }
    
    function approveMP(address _meter_point) onlyOwner {
        approvedMeterPoints[_meter_point]=true;
        StatusChange(_meter_point,true);
    }
    
    function declineMP(address _meter_point) onlyOwner {
        approvedMeterPoints[_meter_point]=false;
        StatusChange(_meter_point,false);
    }
    
    function storeReading(uint256 _reading) {
        if(approvedMeterPoints[msg.sender]==false) throw;
        if(readings[msg.sender].power<_reading) {
            Delivery delivery = new Delivery(roles,msg.sender,readings[msg.sender].time,now,_reading-readings[msg.sender].power);
            IssuedDelivery(address(delivery),msg.sender,readings[msg.sender].time,now,_reading-readings[msg.sender].power);
            lastDelivery[msg.sender]=delivery;
            delivery.transferOwnership(msg.sender);
        }
        readings[msg.sender]=reading(now,_reading);
    }
    
    function process(address _meterpoint,Clearable _clearable) {
        reading last_reading = readings[_meterpoint];
        reading last_processed = processed[_meterpoint];
        if(last_processed.power!=0) { 
            uint256 delta_power = last_reading.power - last_processed.power;
            if(delta_power>0) {
                last_reading.power -= _clearable.doClearingGridIn(delta_power);
                ProcessedClearance(_meterpoint,_clearable,delta_power);
            }
        } 
        processed[_meterpoint]=last_reading;
        
    }
}

contract Provider is RoleProvider {
    RoleLookup public roles;
    
    function Provider(RoleLookup _roles) {
        roles=_roles;    
    }
    
    function process(address _meterpoint)  {
        MPO mpo = MPO(roles.relations(_meterpoint,roles.roles(1)));
        DSO dso = DSO(roles.relations(_meterpoint,roles.roles(2)));
        mpo.process(_meterpoint,dso.clearances(_meterpoint));
    }
}

contract DSO is RoleDSO {
    RoleLookup public roles;
    ClearablesLink public cl;
    Clearable public last_clearable_from;
    mapping(address=>Clearable) public clearances;
    mapping(address=>bool) public approvedProvider;
    function DSO(RoleLookup _roles) {
        roles=_roles;    
    }
    
    function approveConnection(address _address,uint256 _base_from_time,uint256 _base_to_time,uint256 _base_powerIn,uint256 _base_powerOut) onlyOwner {
        Clearable base_clearance = clearances[_address];
        if(address(base_clearance)!=0) {
            _base_from_time=base_clearance.valid_untilTime();
        }
        if(_base_from_time==0) _base_from_time=now;
        if(_base_to_time==0) _base_to_time= _base_from_time+86400;
        base_clearance = new Clearable();
        base_clearance.setFromTime(_base_from_time);
        base_clearance.setUntilTime(_base_to_time);
        base_clearance.setPowerOut(_base_powerIn);
        base_clearance.setPowerIn(_base_powerOut);
        clearances[_address]=base_clearance;
        // roles.setRelationOnBehalf(roles.roles(2),this,tx.origin); ! Needs to be set by Account itself !
    }
    
    
    function addClearableFrom(address from,Clearable _clearable) {
        Clearable clearable_from = clearances[from];
        clearable_from.setChild(_clearable);
    }
    
    function addClearableTo(address to,Clearable _clearable) {
        Clearable clearable_to = clearances[to];
        clearable_to.setChild(_clearable);
    }
    /*
    function addClearableTo(ClearablesLink _clearableLink) {
        // if(clearances[msg.sender].valid_untilTime()<now) throw; // if we do not have a valid base clearable (approve Connection required). ! Not possible to throw !
        // TODO: Should check approved Provider 
        cl=_clearableLink;
        
        //clearances[msg.sender].setChild(_clearable);
        address to = roles.relations(_clearableLink,roles.roles(5));
        
        if(address(roles.relations(to,roles.roles(2)))==address(this)) {
            Clearable clearable_to = clearances[to];
            clearable_to.setChild(_clearableLink.clearable_to());
        }
        
        
    }
    */
    function providerAllowance(address dso,bool allow) onlyOwner {
        approvedProvider[dso]=allow;
    }
}

contract Clearable is owned {
    
    uint256 public valid_fromTime;          /**< unit: seconds since 1.1.1970 (Unix-Time) */
    uint256 public valid_untilTime;         /**< unit: seconds since 1.1.1970 (Unix-Time) */
    uint256 public valid_powerIn;             /**< unit: Watt-hours (Wh) */
    uint256 public valid_powerOut;             /**< unit: Watt-hours (Wh) */
    
    uint256 public buffersize;               /**< unit: Watt (W) */
    uint256 public bufferload;              /**< unit: Watt (W) */
    uint256 public cleared_power;       
    
    Clearable public child;
    event ClearedDelivery(uint256 _power,uint256 valid_power,uint256 cleared_power);
    
    function setFromTime(uint256 _from) onlyOwner { valid_fromTime = _from; }
    function setUntilTime(uint256 _until) onlyOwner { valid_untilTime = _until; }
    function setPowerIn(uint256 _power) onlyOwner { valid_powerIn = _power; }    
    function setPowerOut(uint256 _power) onlyOwner { valid_powerOut = _power; }    
    function setChild(Clearable _child) { 
        if(address(child)==address(0)) {
            child = _child; 
        } else {
            child.setChild(_child);
        }
        
    }    //TODO Add onlyOwner again
    function setBuffer(uint256 _buffersize) onlyOwner { buffersize = _buffersize; }
    
    /** doClearing(uint256 _power)
     * @param _power Amount of Wh that is clearable
     * returns Remaining (uncleared) power 
     */
    function doClearingGridIn(uint256 _power) returns(uint256) {
        // Check if valid timeframe
        if(valid_fromTime>now) return(0);
        if(valid_untilTime<now) return(0);
        
        // First delegate clearing to childs
        if(address(child)!=address(0)) {
            _power=child.doClearingGridIn(_power);
        } 
        _power=buffer(_power);
        // Than substract our clearance.
        if(_power>0) {
            if(valid_powerIn<_power) { _power=valid_powerIn;  cleared_power+=valid_powerIn;  } else { valid_powerIn-=_power; cleared_power+=_power; _power=0;}
            ClearedDelivery(_power,valid_powerIn,cleared_power);
        }
        
        //Return remaining to clear.
        return _power;
    }
     function doClearingGridOut(uint256 _power) returns(uint256) {
        // Check if valid timeframe
        if(valid_fromTime>now) return(0);
        if(valid_untilTime<now) return(0);
        
        // First delegate clearing to childs
        if(address(child)!=address(0)) {
            _power=child.doClearingGridOut(_power);
        } 
        _power=buffer(_power);
        // Than substract our clearance.
        if(_power>0) {
            if(valid_powerOut<_power) { _power=valid_powerOut;  cleared_power+=valid_powerOut;  } else { valid_powerOut-=_power; cleared_power+=_power; _power=0;}
            ClearedDelivery(_power,valid_powerOut,cleared_power);
        }
        
        //Return remaining to clear.
        return _power;
    }
    
    function buffer(uint256 _power) private returns(uint256) {
        if(_power>0) {
            var possible_load = buffersize-bufferload;
            if(possible_load>0) {
                if(possible_load>_power) { bufferload+=_power; _power=0;} else { bufferload+=possible_load; _power-=possible_load; } 
            }
            
        } else {
            // unload buffer...
            _power=bufferload;
            bufferload=0;
           
        }
        return _power;
    }
}

/**
 * ClearablesLink
 * ====================================================================
 * Connects two clearables for Peer-2-Peer "flow" of energy delivery
 * introduces a buffer to limit speed of flow. 
 */
contract ClearablesLink is owned {
    
    RoleLookup public roles;
    address public from;                    /* Energy Source */
    address public to;                      /* Energy To */
    
    Clearable public clearable_from;
    Clearable public clearable_to;
 
    function ClearablesLink(RoleLookup _roles,uint256 _validFrom,uint256 _validUntil,uint256 _quantity,uint256 _buffer,address _from, address _to)  {
        roles=_roles;
        
        clearable_from = new Clearable();
        clearable_from.setFromTime(_validFrom);
        clearable_from.setUntilTime(_validUntil);
        clearable_from.setPowerIn(_quantity);
        from=_from;
        roles.setRelation(roles.roles(4),from);
        
        clearable_to = new Clearable();
        clearable_to.setFromTime(_validFrom);
        clearable_to.setUntilTime(_validUntil);
        clearable_to.setPowerOut(_quantity);
        to=_to;
        roles.setRelation(roles.roles(5),to);
        
        DSO dso_from = DSO(roles.relations(_from,roles.roles(2)));
        DSO dso_to = DSO(roles.relations(_to,roles.roles(2)));
        
        dso_from.addClearableFrom(from,clearable_from);
        dso_to.addClearableTo(to,clearable_to);
        //if(address(dso_from)!= address(dso_to)) { dso_to.addClearableLink(this); }
        
    }
}

/**
 * PowerDelivery
 * ====================================================================
 * Asset that is megotiated and controlled by consens. Covering
 * a power delivery between two parties. 
 */
contract PowerDelivery {
    
    address public owner;
    RoleLookup public roles;
    
    address public from;                /** Energy From **/
    address public to;                  /** Energy To **/

    uint256 public start;               /**< unit: seconds since 1.1.1970 (Unix-Time) */
    uint256 public duration;            /**< unit: seconds */
    
    uint256 public quantity;            /**< unit: Watt-Hour (Wh) */
    uint256 public price;               /**< unit: 1/1000 Euro-Cent */
    uint256 public buffer;              /**< unit: Watt-Hour (Wh) - of inbalance buffer */
    ClearablesLink public clearabalelink;
        
    
    function PowerDelivery(RoleLookup _roles,uint256 _start,uint256 _duration, uint256 _quantity, uint256 _price,uint256 _buffer) {
        if(_start == 0 ) _start=now;
        start = _start;
        duration= _duration;
        quantity = _quantity;
        price = _price;
        roles=_roles;
        buffer = _buffer;
        owner = msg.sender;
    }
    
    /** Helper to validate if there is a consense that entity (address) becomes actor in a PowerDelivery-Contract */
    function validateConnectivity(address _address)  {
         if(roles.relations(_address,roles.roles(1))==address(0)) throw; // No MeterPointOperator available
         address mpo_adr = roles.relations(_address,roles.roles(1));
         MPO mpo = MPO(mpo_adr);
         if(!mpo.approvedMeterPoints(_address)) throw; // MPO refuses to have actor
         
          if(roles.relations(_address,roles.roles(2))==address(0)) throw; // No DSO available
         address dso_adr = roles.relations(_address,roles.roles(2));
         DSO dso = DSO(dso_adr);
       
         if(dso.clearances(_address).valid_untilTime()<start) throw;
         
         // Check if provider is allowed to push clearance
         address provider_adr = roles.relations(_address,roles.roles(3));
         // TODO Check (traps at the moment!): if(!dso.approvedProvider(provider_adr)) throw;
         
         // We do not need to Return something, as we throw on execpetion
    }   
    
    function hasParties() {
        if((address(from)!=0)&&(address(to)!=0)) {
            // Clearables may be commited now
           clearabalelink = new ClearablesLink(roles,start,start+duration,quantity,buffer,from,to);
        }
        
    }
    
    /** Managing entity relations - Role "From" for SmartContract */
    function becomeFrom() {
        if(address(from)!=0) throw;
        // Only allow "from" if consens about MPO
        validateConnectivity(msg.sender);
        from=msg.sender;
        //hasParties(); //TODO Reenable
    }

    /** Managing entity relations - Role "To" for SmartContract */
    function becomeTo() {
        if(address(to)!=0) throw;
        // Only allow "from" if consens about MPO
        validateConnectivity(msg.sender);
        to=msg.sender;
        //hasParties(); //TODO Reenable
    }

}

contract Delivery is owned{
    RoleLookup public roles;
    address public dso;
    
    struct Deliverable {
        uint256 startTime;
        uint256 endTime;
        uint256 power;
    }
    
    Deliverable public deliverable;
    
    function Delivery(RoleLookup _roles,address _meterpoint,uint256 _startTime,uint256 _endTime, uint256 _power)  {
        roles=_roles;
        deliverable=Deliverable(_startTime,_endTime,_power);
        // check sender is MPO for MP
        if(msg.sender!=roles.relations(_meterpoint,roles.roles(1))) throw;
        dso=roles.relations(_meterpoint,roles.roles(2));
        if(address(0)==dso) throw;
       
    }
    
    function includeDelivery(Delivery _delivery) onlyOwner {
        deliverable.power+=_delivery.excludeDelivery(this);
    }
    
    function excludeDelivery(Delivery _delivery) returns(uint256) { return 1;}
}
contract IT_Connectivity is owned {
    RoleLookup public roles;
    DSO public dso;
    
    function IT_Connectivity(RoleLookup _roles) {
        roles=_roles;
        dso = new DSO(roles);
        dso.approveConnection(this,now,now+3600,1000,1000);
        dso.approveConnection(msg.sender,now,now+3600,1000,1000);
    } 
    
    function becomeInstanceOwner() onlyOwner {
        dso.transferOwnership(msg.sender);
    } 
}

/**
 * Integration Test Provider
 * ====================================================================
 * Integration testing for consens of Business Object Model (Framework) 
 * 
 */   
contract IT_Provider is owned { 
    RoleLookup public roles;
    Provider public provider;
    
    function IT_Provider(RoleLookup _roles) {
        roles = _roles;
        provider=new Provider(_roles);
    }
    
    function becomeInstanceOwner() onlyOwner {
        provider.transferOwnership(msg.sender);
    } 
} 

/**
 * Integration Test PowerDelivery
 * ====================================================================
 * Integration testing for consens of Business Object Model (Framework) 
 * 
 * - Creates a Meter Point Operator and assigns to TX Sender and Self
 * - Creates a Powerdelivery:
 *     - from Self to Self
 *     - from Msg.sender to Msg.sender
 *     - from Self to Msg.sender
 *     - from Msg.sender to Self
 */   
contract IT_PowerDelivery is owned {
    RoleLookup public roles;
    MPO public mpo;
    PowerDelivery public powerdelivery;

    
    function IT_PowerDelivery(RoleLookup _roles) {
        roles = _roles;
        
        
        mpo = new MPO(roles);
        mpo.approveMP(msg.sender);
        mpo.approveMP(this);
        
        roles.setRelationOnBehalf(roles.roles(1),address(mpo),msg.sender);
        roles.setRelationOnBehalf(roles.roles(1),address(mpo),this);
    /*
        powerdelivery = new PowerDelivery(roles,now,3600,10,10);
        
        powerdelivery.becomeFrom();
        
        powerdelivery.becomeTo();
*/
        // Removed to avoid Gas-Limit issues in quick test szenario
        /*
        powerdelivery = new PowerDelivery(roles,now,3600,10,10);
        powerdelivery.setFrom(msg.sender);
        powerdelivery.setTo(msg.sender);
        
        powerdelivery = new PowerDelivery(roles,now,3600,10,10);
        powerdelivery.setFrom(this);
        powerdelivery.setTo(msg.sender);
        
        powerdelivery = new PowerDelivery(roles,now,3600,10,10);
        powerdelivery.setFrom(msg.sender);
        powerdelivery.setTo(this);
        */
    
    }
    function becomeInstanceOwner() onlyOwner {
        mpo.transferOwnership(msg.sender);
        //powerdelivery.transferOwnership(msg.sender);
    } 
} 
