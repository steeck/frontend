import { Client } from 'dsteem'
// let opts = {}

// connect to community testnet
// opts.addressPrefix = 'STX'
// opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
// connect to server which is connected to the network/testnet
// const client = new Client('https://testnet.steem.vc', opts)
const client = new Client('https://api.steemit.com')

export default client
