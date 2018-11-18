<template>
  <v-menu
    bottom
    :close-on-content-click="false"
    :open-on-click="!!this.$store.state.auth.username"
    v-model="show"
  >
    <v-btn icon flat
      slot="activator"
      class="btn-vote"
    >
      <v-icon
        size="20"
        :color="isVoted ? '#6633ff' : '#414d6b'"
        v-text="isVoted ? 'lens' : 'panorama_fish_eye'" @click="openVote()"></v-icon>
      <v-icon
        size="20"
        :color="isVoted ? '#fff' : '#414d6b'"
        :style="'position: absolute; left: 0; top: 0;'"
        v-text="'keyboard_arrow_up'" @click="openVote()">
      ></v-icon>
    </v-btn>
    <!-- <v-list>
      <v-list-tile> -->
    <div class="px-4 py-2">
      <v-layout row wrap align-center v-if="isVoted">
        <v-flex xs9 class="unvote-text mt-2 pr-3 pt-1">
          업보트를 취소하시겠습니까?
        </v-flex>
        <v-flex xs3 class="text-xs-right mt-2 pt-1">
          <v-btn class="btn-upvote" outline color="#6644ff" round small flat @click="unvote()" :loading="isVoting">언보트</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-center v-else>
        <v-flex xs12>
        <v-slider v-model="weight" color="#6644ff"></v-slider>
        <v-layout row wrap class="ma-0 percent">
          <div style="width: 12.5%; text-align: left">0%</div>
          <div style="width: 25%; text-align: center">25%</div>
          <div style="width: 25%; text-align: center">50%</div>
          <div style="width: 25%; text-align: center">75%</div>
          <div style="width: 12.5%; text-align: right">100%</div>
        </v-layout></v-flex>
        <v-flex xs9 class="vote-text mt-2 pt-1">
          현재 <b>{{ getVoteValue() | kwn | number }}원</b>의 가치로 업보트를 할 수 있습니다
        </v-flex>
        <v-flex xs3 class="text-xs-right mt-2 pt-1">
          <v-btn class="btn-upvote" outline color="#6644ff" round small flat @click="vote()" :loading="isVoting">업보트</v-btn>
        </v-flex>
      </v-layout>
    </div>
  </v-menu>
</template>

<script>
  import steem from '@/services/steem'
  import steemutil from '@/mixins/steemutil'
  import steemconnect from '@/services/steemconnect'
  import api from '@/api/steecky'

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
        isVoted: false,
        show: false
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
      openVote: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
        }
      },
      getVoteValue: function () {
        const sp = this.getSteemPower()
        const vp = this.calculateVotingPower(this.me)
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
        if (!this.$store.state.auth.username) {
          return
        }
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

            vm.createSteecky()
            vm.complete()
            vm.show = false
          } else {
            alert('보팅할 수 없습니다')
            vm.show = false
          }
          vm.isVoting = false
        })
      },
      unvote: function () {
        let vote = {
          voter: this.$store.state.auth.username,
          author: this.item.author,
          permlink: this.item.permlink,
          weight: 0
        }
        // console.log(vote)
        let vm = this
        this.isVoting = true
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        // old steemconnect
        steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
          if (!err) {
            // console.log('ok')
            vm.isVoted = false
            vm.complete()
            vm.show = false
          } else {
            alert('보팅할 수 없습니다')
            vm.show = false
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
      },
      createSteecky: function () {
        if (!this.$store.state.auth.username) {
          return
        }

        api.create({username: this.$store.state.auth.username, type: 'vote', permlink: this.item.permlink})
          .then(res => {
            console.log(res)
          }).catch(error => {
            console.log(error)
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
  max-width: 90%;
}
.percent {
  font-size: 0.9em;
}
.vote-text {
  color: #333;
  font-size: 0.85em;
}
.unvote-text {
  color: #333;
  font-size: 1em;
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
