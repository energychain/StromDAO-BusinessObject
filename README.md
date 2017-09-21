# StromDAO-BusinessObject

Abstract BusinessObject for StromDAO Energy Blockchain. Abstraction layer between blockchain technology and business logic providing energy market related entities and use cases.

The StromDAO BusinessObject comes ready-to-use in custom applications. 

Please be aware that the last commited version is always a development only version and not intended to use in production.

![Build Status](https://app.codeship.com/projects/01db8140-0b02-0135-a191-4665eb7ab8b1/status?branch=master) [![bitHound Overall Score](https://www.bithound.io/github/energychain/StromDAO-BusinessObject/badges/score.svg)](https://www.bithound.io/github/energychain/StromDAO-BusinessObject) ![Build Status](https://travis-ci.org/energychain/StromDAO-BusinessObject.svg?branch=master) [![bitHound Code](https://www.bithound.io/github/energychain/StromDAO-BusinessObject/badges/code.svg)](https://www.bithound.io/github/energychain/StromDAO-BusinessObject) [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/stromdao/BusinessObject) <a href="https://gratipay.com/StromDAO-Business-Object/"><img src="https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.png" width="92" height="20"/></a> -[![Greenkeeper badge](https://badges.greenkeeper.io/energychain/StromDAO-BusinessObject.svg)](https://greenkeeper.io/)

## Requirements
- NODE JS Version 7.9 ( https://nodejs.org/en/ )
- Internet connection to our Blockchain nodes and JSON RPC Interfaces


## Quick Start
Easy Quickstart is available from within the [Fury.Network](https://fury.network). Download and install [NPM Package](https://github.com/energychain/fury.skeleton) and start playing with an easy [Energy Meter Demo](https://fury.network/?extid=fn_helloworld&inject=0x15D4bA502210dDCEc0f7a79f01208bB68d2eEe0e)

What this Hello-World does is creating a new MeterPoint derived from a random id (external_id). Signs conract for Meter-Point-Operations and confirms (counter-sign by MPO). 

Testing of individual functions might be done via our [Introspect Page](https://demo.stromdao.de/introspect.html).

## Demo Case
There is a Mock-Up Demo available to illustrate energy delivery handling, billing and other use cases on: https://github.com/energychain/BusinessObject-Demo

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
