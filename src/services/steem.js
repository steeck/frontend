import steem from 'steem'

/**
 * @property {Function} getContentAsync : 글의 상세정보를 로딩
 */

// const steem = require('steem')

steem.api.setOptions({ url: 'https://api.steemit.com' })
// steem.api.setOptions({ url: 'https://testnet.steem.vc' })

// steem.api.config.set('https://testnet.steem.vc', 'helloworld1')

// let opts = {}
// opts.addressPrefix = 'STX'
// opts.chainId = '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
// const client = new Client('https://testnet.steem.vc', opts)
// const client = new Client('https://api.steemit.com')

export default steem
