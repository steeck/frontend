'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APP_HOST: '"http://localhost:8080"',
  API_HOST: '"http://localhost:8081"',
  STEEM_HOST: '"https://api.steemit.com"',
})
