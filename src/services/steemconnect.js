import sc2 from 'steemconnect'

const steemconnect = sc2.Initialize({
  app: 'app.steeck',
  callbackURL: process.env.APP_HOST + '/#/login',
  accessToken: 'access_token',
  scope: ['vote', 'comment', 'delete_comment', 'comment_options', 'custom_json', 'claim_reward_balance', 'login', 'offline']
})

export default steemconnect
