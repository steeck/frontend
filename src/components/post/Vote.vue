<template>
  <v-menu offset-x :disabled="isVoted">
    <v-btn icon flat slot="activator" class="btn-vote">
      <v-icon
        size="20"
        :color="isVoted ? '#6633ff' : '#414d6b'"
        v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
      <v-icon
        size="20"
        :color="isVoted ? '#fff' : '#414d6b'"
        :style="'position: absolute; left: 0; top: 0;'"
        v-text="'keyboard_arrow_up'"
      ></v-icon>
    </v-btn>
    <!-- <v-list>
      <v-list-tile> -->
    <div class="px-3">
      <v-layout row wrap align-center>
        <v-flex xs8>
        <v-slider v-model="weight" color="deep-purple"></v-slider>
        <v-layout row wrap class="ma-0 percent">
          <div style="width: 12.5%; text-align: left">0%</div>
          <div style="width: 25%; text-align: center">25%</div>
          <div style="width: 25%; text-align: center">50%</div>
          <div style="width: 25%; text-align: center">75%</div>
          <div style="width: 12.5%; text-align: right">100%</div>
        </v-layout></v-flex>
        <v-flex xs4 class="text-xs-right">
          <v-btn class="btn-upvote" outline color="deep-purple" round small flat @click="vote()" :loading="isVoting">업보트</v-btn>
        </v-flex>
      </v-layout>
      <v-flex class="pt-1 vote-text">현재 <b>{{ getVoteValue() | kwn | number }}원</b>의 가치로 업보트를 할 수 있습니다.</v-flex>
    </div>
  </v-menu>
</template>

<script>
  import steem from '@/services/steem'
  import steemutil from '@/mixins/steemutil'
  import steemconnect from '@/services/steemconnect'

  export default {
    name: 'Vote',
    mixins: [steemutil],
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
      },
      content: {
        type: Object
      }
    },
    data () {
      return {
        dialog: false,
        weight: 100,
        isVoting: false,
        fond: {
          recentClaims: 0,
          rewardBalance: 0
        },
        isVoted: false
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
    mounted () {
      this.getRewardFund()
      this.getVoted()
    },
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
      getVoted: function () {
        let vm = this
        this.isVoted = false
        if (this.item) {
          this.item.active_votes.forEach(function (obj) {
            if (obj.voter === vm.$store.state.auth.username) {
              if (obj.percent > 0) {
                vm.isVoted = true
              }
              return true
            }
          })
        }
      },
      vote: function () {
        let vote = {
          voter: this.$store.state.auth.username,
          author: this.item.author,
          permlink: this.item.permlink,
          weight: this.weight * 100
        }
        // console.log(vote)
        let vm = this
        this.isVoting = true
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        // old steemconnect
        steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
          if (!err) {
            // console.log('ok')
            vm.isVoted = true
            let now = new Date()
            let global = new Date(now.setMinutes(now.getMinutes() + now.getTimezoneOffset()))
            vm.item.active_votes.push({voter: vote.voter, percent: vote.weight, time: global.toISOString()})
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
    }
  }
</script>

<style scoped>
.btn-vote {
  position: relative;
  margin: 0;
  width: 20px;
  height: 20px;
}
.btn-upvote {
  padding: 0 12px!important;
  min-width: 10px;
  margin: 0;
}
.v-menu__content {
  background-color: #fff;
  padding-bottom: 8px;
}
.percent {
  font-size: 0.8em;
}
.vote-text {
  color: #333;
  font-size: 0.9em;
}
>>>.v-input--slider {
  margin-top: 0;
}
>>>.v-input--slider .v-input__slot {
  margin-bottom: 0;
}
>>>.v-input--slider .v-messages {
  display: none;
}
</style>
