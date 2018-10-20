<template>
    <div>
      <div>
        <div>
          <span class="vote-text1">당신의 투표는 US {{ getVoteValue() }} 만큼의 가치가 있을 것입니다.</span>
          <span style="float: right">
            <v-btn outline color="light-blue" flat="flat" @click="vote" :loading="isVoting">승인</v-btn>
            <v-btn outline color="red darken-1" flat="flat" @click="close">취소</v-btn>
          </span>
        </div>
        <div style="padding-top: 1rem; padding-bottom: 1rem;">
          <v-slider v-model="weight" color="deep-purple"></v-slider>
          <v-layout>
            <div style="width: 12.5%; text-align: left">0%</div>
            <div style="width: 25%; text-align: center">25%</div>
            <div style="width: 25%; text-align: center">50%</div>
            <div style="width: 25%; text-align: center">75%</div>
            <div style="width: 12.5%; text-align: right">100%</div>
          </v-layout>
        </div>
        <div class="vote-text2">현재까지 {{ weight }}% 달성되었습니다.</div>
      </div>

    </div>
</template>

<script>
  import steem from '@/services/steem'
  import steemutil from '@/mixins/steemutil'
  import steemconnect from '@/services/steemconnect'

  export default {
    name: 'Vote',
    props: {
      item: {
        type: Object
      },
      close: {
        default: () => {
          console.log('Default Function')
        },
        type: Function
      },
      complete: {
        default: () => {
          console.log('Default Function')
        },
        type: Function
      }
    },
    data () {
      return {
        weight: 100,
        isVoting: false,
        fond: {
          recentClaims: 0,
          rewardBalance: 0
        }
      }
    },
    computed: {
      me: function () {
        return this.$store.state.me.account
      },
      steemPrice: function () {
        return this.$store.getters.steemPrice
      },
      getPayoutValue: function () {
        return parseFloat(this.item.pending_payout_value.replace(' SBD', '')).toFixed(2)
      }
    },
    mixins: [steemutil],
    methods: {
      getVoteValue: function () {
        const sp = this.getSteemPower()
        const vp = this.me.voting_power
        const i = this.fond.rewardBalance / this.fond.recentClaims
        const a = this.$store.state.global.properties.fund / this.$store.state.global.properties.shares
        const r = sp / a
        const m = parseInt(((vp * this.weight / 100) + 49) / 50)
        const l = parseInt(r * m * 100) * i * this.steemPrice
        return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
      },
      getSteemPower: function () {
        const vestingShares = this.getVestingShares()
        return this.getSP(vestingShares)
      },
      getVestingShares: function () {
        return parseFloat(this.me.vesting_shares) +
          parseFloat(this.me.received_vesting_shares) +
          -parseFloat(this.me.delegated_vesting_shares)
      },
      vote: function () {
        let vote = {
          voter: this.$store.state.auth.username,
          author: this.item.author,
          permlink: this.item.permlink,
          weight: this.weight * 100
        }
        console.log(vote)
        let vm = this
        this.isVoting = true
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        // old steemconnect
        steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
          if (!err) {
            console.log('ok')
            vm.item.active_votes.push({voter: vote.voter, percent: vote.weight, time: new Date().toISOString()})
            vm.complete()
          }
          vm.isVoting = false
        })
      },
      getRewardFund: function () {
        let vm = this
        steem.api.callAsync('get_reward_fund', ['post'])
          .then(function (result) {
            vm.fond.recentClaims = result.recent_claims
            vm.fond.rewardBalance = result.reward_balance.replace(' STEEM', '')
          })
      }
    },
    mounted () {
      this.getRewardFund()
    }
  }
</script>

<style scoped>

</style>
