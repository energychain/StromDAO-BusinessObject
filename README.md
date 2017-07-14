# StromDAO-BusinessObject

Abstract BusinessObject for StromDAO Energy Blockchain. Abstraction layer between blockchain technology and business logic providing energy market related entities and use cases.

The StromDAO BusinessObject comes ready-to-use in custom applications. 

Please be aware that the last commited version is always a development only version and not intended to use in production.

![Build Status](https://app.codeship.com/projects/01db8140-0b02-0135-a191-4665eb7ab8b1/status?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/energychain/StromDAO-BusinessObject/badges/score.svg)](https://www.bithound.io/github/energychain/StromDAO-BusinessObject) ![Build Status](https://travis-ci.org/energychain/StromDAO-BusinessObject.svg?branch=master) [![bitHound Code](https://www.bithound.io/github/energychain/StromDAO-BusinessObject/badges/code.svg)](https://www.bithound.io/github/energychain/StromDAO-BusinessObject) [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/stromdao/BusinessObject) <a href="https://gratipay.com/StromDAO-Business-Object/"><img src="https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.png" width="92" height="20"/></a> -[![Greenkeeper badge](https://badges.greenkeeper.io/energychain/StromDAO-BusinessObject.svg)](https://greenkeeper.io/)

## Requirements
- NODE JS Version 7.9 ( https://nodejs.org/en/ )
- Internet connection to our Blockchain nodes and JSON RPC Interfaces

## Demo Case
There is a Mock-Up Demo available to illustrate energy delivery handling, billing and other use cases on: https://github.com/energychain/BusinessObject-Demo

## Quick Start

### Install via npm:
```
npm install stromdao-businessobject
```

### (Alternative) Install via clone GitHub Repository:
```
git clone https://github.com/energychain/StromDAO-BusinessObject.git
cd StromDAO-BusinessObject
npm install
```

### Run Integration Test (Recommended)
```
npm test
```

Output (similar to)
```
> stromdao-businessobject@0.1.3 test /home/zoernert/Development/StromDAO-BusinessObject
> mocha --harmony test/rolelookup.js

Consens Parameters for this test instance:
  - MyAddress: 0x3dce352377051eE333777fe759c99D16ecb9853C
  - Private Key: 0xea9085fd0f21b69f289f357e0c23f3ba8ed39d9bca1a565765629344e325c9c5
  - Reading#1: 1107368
  - Reading#2: 1107416
  - Reading#3: 1107477
  - Reading#4: 1107542
  - Reading#5: 1107597


  StromDAO: Consensus System for Energy Blockchain	
    Usecase: Connect new Meterpoint to Consensus System
      ✓ Test Ownership of Consensus (deployed as prerequesit) (117ms)
        - My DSO: 0x7a0134578718b171168A7Cf73b861662E945a4D3
      ✓ Ensure DSO Contract exists
        - My MPO: 0xc4719B91742D052d0A93F513f59F6Ac15e95D061
      ✓ Ensure MPO Contract exists
        - My Provider: 0xd457F18DB9949899263d5bEbd74e74Ef6d2a6624
      ✓ Ensure Provider Contract exists
      ✓ Test if consensus is aware of MPO Role (address) (44ms)
      ✓ Test if consensus is aware of DSO Role (address) (46ms)
      ✓ Test if consensus is aware of Provider Role (address) (46ms)
      ✓ Let MPO become my MPO by setting contract in roles (4255ms)
      ✓ Let DSO become my DSO by setting contract in roles (8192ms)
      ✓ @MPO: Approve myself as MeterPoint (Role 4) (12340ms)
      ✓ @DSO: Approve myself as Connection (8289ms)
    Usecase: Process sequential Meterpoint readings
      ✓ Set my reading #1 according to MPO contract (12216ms)
      ✓ Set my reading #2 according to MPO contract (8229ms)
      ✓ Retrieve my last Delivery (67ms)
      ✓ Check that I am owner of last Delivery (65ms)
      ✓ Set my reading #3 according to MPO contract (8269ms)
      ✓ Retrieve my last Delivery - should be different to first (52ms)
    Usecase: Consensus of Power Delivery is given after exchange (merge/resolve)
      ✓ Sumup energy in deliveries - should be eq to reading 3 - reading 1 (114ms)
      ✓ Transfer Ownership of Delivery 2 to Delivery 1 (12224ms)
      ✓ Check that Delivery 1 got Ownership (55ms)
      ✓ Include Delivery 2 into 1  (8226ms)
      ✓ Re-Sumup energy in deliveries - should be eq to reading 3 - reading 1 (98ms)
      ✓ Delivery 2 should have power eq 0 (45ms)
    Usecase: Delegation of Deliveries
      ✓ Let DSO become my Provider by setting contract in roles (12215ms)
      ✓ Set my reading #4 according to MPO contract (8228ms)
      ✓ Retrieve my last Delivery (50ms)
      ✓ Check that DSO is owner of last Delivery (45ms)
      ✓ Let TestProvider become my Provider by setting contract in roles (8191ms)
      ✓ Set my reading #5 according to MPO contract (12204ms)
    Usecase: Provider does energy to money exchange
      ✓ Let Provider accept deliveries from me as sender with cost per day 0 and cost per energy 2 (8256ms)
      ✓ Retrieve my last Delivery (59ms)
      ✓ Retrieve Stromkonto (49ms)
      ✓ Check my due eq 0 on Stromkonto (61ms)
      ✓ Sign Billing Contract with Provider (12306ms)
      ✓ Let provider handle my last delivery (8209ms)
      ✓ Check my due is double energy on Stromkonto as cost per energy is set to 2 (reading#5-reading#4)*2 (132ms)


  36 passing (3m)

```
## Hello-World Sample
Create a "mytest.js" file with:

```javascript
var StromDAOBO = require("stromdao-businessobject");    
var external_id = Math.random()*10000000; 
var node = new StromDAOBO.Node({external_id:external_id,testMode:true});

var my_reading_1=Math.round(Math.random()*10000000);


// Parameters of Consensus-System
var known_rolelookup = '0xbc723c385dB9FC5E82e301b8A7aa45819E4c3e8B';

// Deploy Meter-Point-Contract if it does not exist ...
node._deployContract('StromDAO-BO.sol:MPO',known_rolelookup)
	.then(function(my_mpo) { 
		    console.log("MPO Address",my_mpo);		    
		    var p1 = new Promise(function(resolve, reject) {
				node.mpo(my_mpo).then( function(mpo) {
									resolve(mpo);
				});
			});
		    return p1;
		  })
	.then(function(mpo) {   //With instance of MPO Contract
	    var p1 = new Promise(function(resolve, reject) {
	      mpo.approveMP(node.wallet.address,4).then( function(tx_result) {   //aprove MP
			  resolve(mpo);
		  });
	   	});
	    return p1;	
	   }); 
```

Test it with
```
node mytest.js
```

What this Hello-World does is creating a new MeterPoint derived from a random id (external_id). Signs conract for Meter-Point-Operations and confirms (counter-sign by MPO). 

## Test-Cases
https://github.com/energychain/StromDAO-BusinessObject/blob/master/test

For personal tests we are updating several Meter Point Readings every 15 Minutes:
- 0x6e23cCf78dD844cf6bb07022D8B95fa8E3994844
- 0x7f70FE6c18012B9e41D646804B19960fABa49F0A
- 0x83F8B15eb816284ddcF2ff005Db7a19196d86ae1

They are all updated in Genesis MPR Contract ( 0x0000000000000000000000000000000000000008 )

## Documentation 
- http://docs.stromdao.de/code/

## Contributing
- https://stromdao.de/
- https://gitter.im/stromdao/Lobby
