'use strict'

const test = require('ava')
const sdao = require('../StromDAONode.js')
const knownGwalink = '0x119AA4A3C2C7287f99FCBB41C5a78a8Dc15d1338'

test('Core - Instanciate with external UID', (t) => {
  t.plan(4)
  let externalID = Math.random() * 10000000

  let node = new sdao.Node({external_id: externalID})
  const address1 = node.options.address
  const pk1 = node.options.privateKey

  node = new sdao.Node({external_id: externalID})
  const address2 = node.options.address
  const pk2 = node.options.privateKey
  externalID++

  node = new sdao.Node({external_id: externalID})
  const address3 = node.options.address
  const pk3 = node.options.privateKey

  t.deepEqual(address1, address2, 'Same external ID should provide same wallet address')
  t.deepEqual(pk1, pk2, 'Same external ID should provide same wallet private key')
  t.notDeepEqual(address3, address2, 'Different external ID should provide different wallet address')
  t.notDeepEqual(pk3, pk2, 'Different external ID should provide different wallet private key')
})

test('Core - Blockchain Status available after instanciation (Block#>0)', (t) => {
  t.plan(2)

  let externalID = Math.random() * 10000000
  let node = new sdao.Node({external_id: externalID})

  return node.provider.getBlockNumber().then((blockNum) => {
    // console.log('currentBlock: ', blockNum)
    t.true(Number.isInteger(blockNum), 'Instanciated node should return current block number')
    t.true((blockNum > 0), 'Current block number should be greater than zero')
  })
})

test('Core - Writing a transaction increases block number', async (t) => {
  let externalID = Math.random() * 10000000
  let node = new sdao.Node({external_id: externalID})

  let [currentBlock, tx] = await Promise.all([
    node.provider.getBlockNumber(),
    node.gwalink(knownGwalink).then(gwalink => {
      return gwalink.reader_in.pingReading(Math.round(externalID))
    })
  ])
  // console.log('current block ', currentBlock)
  // mconsole.log('tx num', tx)

  var nextBlock = currentBlock
  function intervalMethod () {
    // this refers to interval
    if (nextBlock > currentBlock) {
      // console.log('next block is: ', nextBlock, '(should be ', currentBlock + 1, ' )')
      return nextBlock
    } else {
      // console.log('next block is: ', nextBlock, '(should be ', currentBlock + 1, ') retry...')
      node.provider.getBlockNumber().then(blockNum => {
        nextBlock = blockNum
      })
    }
  }

  return require('promise-tool').setInterval(1000, intervalMethod).then(nextBlock => {
    // console.log('Yay!! Next block is : ', nextBlock)
    t.is(nextBlock, currentBlock + 1, 'Writing a transaction increases current block number')
  })
})
