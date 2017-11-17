var StromDAONode = require("../StromDAONode.js");  
var NodeRSA = require('node-rsa');
var external_id="123";
var node = new StromDAONode.Node({external_id:external_id,testMode:true});
privateKey=node.wallet.privateKey.substring(2);
var key = new NodeRSA();
key.generateKeyPair(16);	
console.log(key.exportKey('pkcs1-private-der').toString('hex').length);
var k1=key.exportKey('pkcs1-private-der').toString('hex');

privateKey=k1.substring(0,10)+privateKey;
console.log(privateKey,k1);
console.log("PK",privateKey.length,k1.length);				
var keybuffer=new Buffer(privateKey,'hex');

var key = new NodeRSA(keybuffer, 'pkcs1-der');
var publicDer = key.exportKey('pkcs8-public-der');
var privateDer = key.exportKey('pkcs1-der');

console.log(publicDer);
	
