import steem from 'steem'

steem.api.setOptions({ url: process.env.STEEM_HOST })
// steem.api.setOptions({ url: 'https://testnet.steemitdev.com' })
// steem.config.set('address_prefix','TST')
// steem.config.set('chain_id','46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32')

export default steem
