/**
 * StromDAO Business Object
 * =========================================
 * Binding für den StromDAO Node zur Anbindung der Energy Blockchain und Arbeit mit den unterschiedlichen BC Objekten (SmartContracts)
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de
 * */

const fs = require('fs')
var ethers = require('ethers')
var storage = require('node-persist')

function Node (options) {
  var parent = this

  this._createNewPK = function () {
    var getRandomValues = require('get-random-values')
    var array = new Uint8Array(32)
    var pk = ethers.utils.keccak256(getRandomValues(array))
    return pk
  }

  this._keepObjRef = function (address, contractType) {
    if (typeof parent.objRef[contractType] === 'undefined') {
      parent.objRef[contractType] = {}
    }
    if (typeof parent.objRef[address] === 'undefined') {
      parent.objRef[address] = { type: contractType }
      parent.objRef[contractType][address] = { type: contractType }
      storage.setItemSync('objRef', parent.objRef)
    }
  }

  this._keepHashRef = function (transaction) {
    storage.setItemSync(transaction.hash, transaction)
    return transaction.hash
  }

  this.getRef = function (ref) {
    return storage.getItemSync(ref)
  }

  this._loadContract = function (address, contractType) {
    var abi = JSON.parse(fs.readFileSync('smart_contracts/' + contractType + '.abi'))
    var contract = new ethers.Contract(address, abi, this.wallet)
    parent._keepObjRef(address, contractType)
    return contract
  }

  this._objInstance = function (objOrAddress, typeOfObject) {
    var instance = {}
    instance.obj = objOrAddress
    if (typeof obj !== 'object') {
      instance.obj = parent._loadContract(instance.obj, typeOfObject)
    } else {
      // Hier könnte man neue Objekte Deployen!
    }
    return instance
  }

  this.reader = function (objOrAddress) {
    var instance = parent._objInstance(objOrAddress, 'StromDAOReader')
    instance.pingReading = function (reading) {
      var p1 = new Promise(function (resolve, reject) {
        instance.obj.pingReading(reading).then(function (o) {
          resolve(parent._keepHashRef(o))
        })
      })
      return p1
    }
    return instance
  }

  this.gwalink = function (objOrAddress) {
    var gwalink = parent._objInstance(objOrAddress, 'gwalink')
    var p1 = new Promise(function (resolve, reject) {
      gwalink.obj.reader_in().then(function (o) {
        gwalink.reader_in = parent.reader(o[0])
        gwalink.obj.reader_out().then(function (o) {
          gwalink.reader_out = parent.reader(o[0])
          resolve(gwalink)
        })
      })
    })
    return p1
  }

  this.pdcontract = function (objOrAddress) {
    var p1 = new Promise(function (resolve, reject) {
      var instance = parent._objInstance(objOrAddress, 'PrivatePDcontract')
      instance.check = function () {
        var p1 = new Promise(function (resolve, reject) {
          instance.obj.check().then(function (o) {
            resolve(parent._keepHashRef(o))
          })
        })
        return p1
      }
      instance.costSum = function () {
        var p1 = new Promise(function (resolve, reject) {
          instance.obj.cost_sum().then(function (o) {
            resolve(o)
          })
        })
        return p1
        // return instance.obj.cost_sum()
      }
      resolve(instance)
    })
    return p1
  }

  storage.initSync()

  if (typeof options.rpc === 'undefined') { options.rpc = 'http://app.stromdao.de:8081/rpc' }
  var provider = new ethers.providers.JsonRpcProvider(options.rpc, 42)
  if (typeof options.external_id !== 'undefined') {
    options.privateKey = storage.getItemSync('ext:' + options.external_id)
    if (typeof options.privateKey === 'undefined') {
      this.options = options
      // this.wallet = new ethers.Wallet.createRandom(this.options);
      options.privateKey = this._createNewPK()
      storage.setItemSync('ext:' + options.external_id, options.privateKey)
    }
  } else if (typeof options.privateKey === 'undefined') {
    options.privateKey = '0x1471693ac4ae1646256c6a96edf2d808ad2dc6b75df69aa2709c4140e16bc7c4'
  }
  this.options = options
  this.wallet = new ethers.Wallet(options.privateKey, provider)
  this.options.address = this.wallet.address
  this.objRef = storage.getItemSync('objRef')
  if ((typeof this.objRef === 'undefined') || (typeof this.options.clearRefCache !== 'undefined')) {
    storage.setItemSync('objRef', {})
    this.objRef = storage.getItemSync('objRef')
  }
  this.provider = provider
}

console.log(Node)

module.exports = {
  Node
}
