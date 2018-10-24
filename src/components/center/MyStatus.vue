<template>
  <div class="my-profile text-xs-center px-4">
    <h3>Steem Power</h3>
    <h3>{{ mineSP }} SP (+{{ receivedSP - delegatedSP }} SP)</h3>
    <h4>Delegated SP : {{ delegatedSP }} SP</h4>
    <h4>{{ me.vesting_balance }} / {{ me.sbd_balance }}</h4>
    <!-- <h4>Steem : {{ me.vesting_balance }}</h4>
    <h4>Steem Dollor : {{ me.sbd_balance }}</h4> -->
    <h4>Voting Mana</h4>
    <progress-bar
      :percent="vp"
      :text="vp + '%'"
      :color="'dark'"
      ></progress-bar>
    <h4>Vote Value : ${{ getVoteValue() }}</h4>
  </div>
</template>

<style scoped>
</style>

<script>
import steemutil from '@/mixins/steemutil'
import steem from '@/services/steem'
import ProgressBar from '@/components/ui/ProgressBar'

export default {
  mixins: [steemutil],
  components: {
    ProgressBar
  },
  data () {
    return {
      fund: {}
    }
  },
  mounted () {
    this.$store.dispatch('me/getAccount')
    this.getRewardFund()
  },
  computed: {
    me () {
      return this.$store.state.me.account
    },
    sp () {
      return this.getSP(parseFloat(this.me.vesting_shares) + parseFloat(this.me.received_vesting_shares) - parseFloat(this.me.delegated_vesting_shares))
    },
    mineSP () {
      return this.getSP(parseFloat(this.me.vesting_shares)).toFixed(3)
    },
    receivedSP () {
      return this.getSP(parseFloat(this.me.received_vesting_shares)).toFixed(3)
    },
    delegatedSP () {
      return this.getSP(parseFloat(this.me.delegated_vesting_shares)).toFixed(3)
    },
    vp () {
      return (this.me.voting_power / 100).toFixed(2)
    },
    steemPrice: function () {
      return this.$store.getters.steemPrice
    }
  },
  methods: {
    getRewardFund: function () {
      let vm = this
      steem.api.getRewardFund('post', function (err, res) {
        if (err) {}
        vm.fund.recentClaims = res.recent_claims
        vm.fund.rewardBalance = parseFloat(res.reward_balance)
      })
    },
    getVoteValue: function () {
      const sp = this.sp
      const vp = this.me.voting_power
      const i = this.fund.rewardBalance / this.fund.recentClaims
      const a = this.$store.state.global.properties.fund / this.$store.state.global.properties.shares
      const r = sp / a
      const m = parseInt(((vp * 100 / 100) + 49) / 50)
      const l = parseInt(r * m * 100) * i * this.steemPrice
      return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
    }
  }
}
</script>
