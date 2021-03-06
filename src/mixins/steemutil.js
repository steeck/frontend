import steem from 'steem'

const steemutil = {
  computed: {
    vestsFor1SP () {
      const vests = 100000
      const sp = this.getSP(vests)
      return vests / sp
    }
  },
  methods: {
    getSP: function (vests) {
      vests = parseFloat(vests)
      return steem.formatter.vestToSteem(vests, this.$store.state.global.properties.shares, this.$store.state.global.properties.fund)
    },
    vestsToSP: function (vests, decimals = 3) {
      return (vests * this.vestsFor1SP).toFixed(decimals)
    },
    spToVests: function (sp, decimals = 6) {
      return (sp * this.vestsFor1SP).toFixed(decimals)
    },
    calculateEstAccountValue: function (user, steemRate, sbdRate) {
      return (
        (this.getSP(user.vesting_shares) + parseFloat(user.vesting_balance)) * parseFloat(steemRate) +
        parseFloat(user.sbd_balance) * parseFloat(sbdRate)
      )
    },
    calculateVotingPower: function (user) {
      var ago = (new Date().getTime() - new Date((user.last_vote_time) + 'Z').getTime()) / 1000
      return Math.min(10000, user.voting_power + 10000 * ago / 432000)
    }
  }
}
export default steemutil
