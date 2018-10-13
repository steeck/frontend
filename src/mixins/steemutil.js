import steem from 'steem'

const steemutil = {
  computed: {
    vestsFor1SP () {
      const vests = 100000
      const sp = steem.formatter.vestToSteem(vests, this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund)
      return vests / sp
    }
  },
  methods: {
    getSP: function (vests) {
      return steem.formatter.vestToSteem(vests, this.$store.state.global.properties.shares, this.$store.state.global.properties.fund)
    },
    vestsToSP: function (vests, decimals = 3) {
      return (vests * this.vestsFor1SP).toFixed(decimals)
    },
    spToVests: function (sp, decimals = 6) {
      return (sp * this.vestsFor1SP).toFixed(decimals)
    }
  }
}
export default steemutil
