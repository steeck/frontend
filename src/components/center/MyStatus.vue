<template>
  <div class="my-profile text-xs-center px-4">
    <h3>{{ username }} 스팀 파워</h3>
    <h3>{{ mineSP }} SP ({{ (receivedSP - delegatedSP).toFixed(3) }} SP)</h3>
    <h4>Delegated SP : {{ delegatedSP }} SP</h4>
    <h4>{{ me.vesting_balance }} / {{ me.sbd_balance }}</h4>
    <!-- <h4>Steem : {{ me.vesting_balance }}</h4>
    <h4>Steem Dollor : {{ me.sbd_balance }}</h4> -->
    <h4>보팅 마나</h4>
    <progress-bar
      :percent="vmana"
      :text="vmana + '%'"
      :color="'dark'"
      ></progress-bar>
    <h4>RC 마나</h4>
    <progress-bar
      :percent="rcmana"
      :text="rcmana + '%'"
      ></progress-bar>
    <h4>Vote Value : ${{ (votingValue * weight / 100).toFixed(2) }}</h4>
    <div>
      <v-slider v-model="weight" color="deep-purple"></v-slider>
      <v-layout>
        <div style="width: 12.5%; text-align: left">0%</div>
        <div style="width: 25%; text-align: center">25%</div>
        <div style="width: 25%; text-align: center">50%</div>
        <div style="width: 25%; text-align: center">75%</div>
        <div style="width: 12.5%; text-align: right">100%</div>
      </v-layout>
    </div>
  </div>
</template>

<style scoped>
>>>.v-input--slider {
  margin-top: 0;
}
>>>.v-input__slot {
  margin-bottom: 0;
}
>>>.theme--light.v-messages {
  display: none;
}
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
  props: ['username'],
  data () {
    return {
      me: {},
      rc: {},
      fund: {},
      weight: 100
    }
  },
  mounted () {
    if (!this.username) {
      this.username = this.$store.state.auth.username
    }
    this.getAccount()
    this.getRC()
    this.getRewardFund()
    this.getSteemPrice()
  },
  computed: {
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
    vmana () {
      return (this.me.voting_power / 100).toFixed(2)
    },
    rcmana () {
      if (this.rc.rc_manabar) {
        return (this.rc.rc_manabar.current_mana / this.rc.max_rc * 100).toFixed(2)
      }
    },
    steemPrice () {
      return this.$store.getters.steemPrice
    },
    votingValue () {
      const sp = this.sp
      const vp = this.me.voting_power
      const i = this.fund.rewardBalance / this.fund.recentClaims
      const a = this.$store.state.global.properties.fund / this.$store.state.global.properties.shares
      const r = sp / a
      const m = parseInt(((vp * 100 / 100) + 49) / 50)
      const l = parseInt(r * m * 100) * i * this.steemPrice
      return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
    }
  },
  methods: {
    getAccount: function () {
      let vm = this
      steem.api.getAccounts([this.username], function (err, res) {
        if (err) {}
        vm.me = res[0]
      })
    },
    getRC: function () {
      let vm = this
      steem.api.send('rc_api', { method: 'find_rc_accounts', params: { 'accounts': [this.username] } }, function (err, res) {
        if (err) {
          console.log(err)
          return
        }
        vm.rc = res.rc_accounts[0]
      })
    },
    getRewardFund: function () {
      let vm = this
      steem.api.getRewardFund('post', function (err, res) {
        if (err) {}
        vm.fund.recentClaims = res.recent_claims
        vm.fund.rewardBalance = parseFloat(res.reward_balance)
      })
    },
    getSteemPrice: function () {
      let vm = this
      steem.api.getCurrentMedianHistoryPrice(function (err, result) {
        if (err) {}
        // vm.steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
        const steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
        vm.$store.commit('setSteemPrice', steemPrice)
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
