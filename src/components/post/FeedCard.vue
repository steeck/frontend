<template>
  <v-card
    flat
    class="card"
  >
    <v-card-actions>
      <v-avatar
        color="grey lighten-4"
      >
        <img :src="item.profile" alt="avatar">
      </v-avatar>
      <div class="ml-3">
        <div class="card-author">
          {{ item.account.name }}
        </div>
        <div class="card-created">
          {{ item.created | ago }}
        </div>
      </div>
      <v-btn
        outline
        round
        color="deep-purple"
        class="ml-3"
      >
        +팔로우
      </v-btn>
      <v-spacer></v-spacer>
      <card-menu :author="item.account.name" :permlink="item.permlink"></card-menu>
    </v-card-actions>
    <v-card-title
      primary-title
      class="card-title"
    >
      {{ item.content.title }}
    </v-card-title>
    <v-card-text v-if="item.images.length > 0">
      <v-carousel
        hide-delimiters
      >
        <v-carousel-item
          v-for="(image, i) in item.images"
          :key="i"
          :src="image"
        >
        </v-carousel-item>
      </v-carousel>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        dark
        @click="openVote"
      >
        Vote
      </v-btn>
      {{ getPayoutValue }}
      {{ item.content.children }}개
    </v-card-actions>
    <!-- <vote :blog="item" :dialog="dialog"></vote> -->

    <v-dialog
      v-model="dialog"
      max-width="80%"
    >
      <div class="vote-dialog">
        <div>
          <span class="vote-text1">당신의 투표는 US {{ getVoteValue() }} 만큼의 가치가 있을 것입니다.</span>
          <span style="float: right">
            <v-btn
              outline
              color="light-blue"
              flat="flat"
              @click="vote"
              :loading="isVoting"
              :disabled="isVoted"
            >
              승인
            </v-btn>
            <v-btn
              outline
              color="red darken-1"
              flat="flat"
              @click="dialog = !dialog"
            >
              취소
            </v-btn>
          </span>
        </div>
        <div style="padding-top: 1rem; padding-bottom: 1rem;">
          <v-slider
            v-model="weight"
            color="deep-purple"
          ></v-slider>
          <v-layout>
            <div style="width: 12.5%; text-align: left">
              0%
            </div>
            <div style="width: 25%; text-align: center">
              25%
            </div>
            <div style="width: 25%; text-align: center">
              50%
            </div>
            <div style="width: 25%; text-align: center">
              75%
            </div>
            <div style="width: 12.5%; text-align: right">
              100%
            </div>
          </v-layout>
        </div>
        <div class="vote-text2">
          현재까지 {{ weight }}% 달성되었습니다.
        </div>
      </div>
    </v-dialog>
  </v-card>
</template>

<style scoped>
>>>.v-slider__track, >>>.v-slider__track-fill, >>>.v-slider__track__container {
  height: 8px;
}
>>>.v-messages {
  display: none;
}
>>>.v-card__title, >>>.v-card__text {
  padding: 8px;
}
.card {
  padding: 20px 30px;
  border: 1px solid #d1d1d1;
  margin-bottom: 20px;
}
.card-author {
  font-size: 1.2rem;
  font-weight: 600;
  color: #425363;
}
.card-created {
  font-size: .9rem;
  color: #9ba2ac;
}
.card-more >>>.v-list__tile.v-list__tile--link {
  font-size: .9rem;
  font-weight: 600;
  color: #425363;
  padding: 6px 20px;
  height: auto;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #425363;
}
.vote-dialog {
  background-color: white;
  padding: 2rem;
}
.vote-text1 {
  font-size: 1.1rem;
  color: #aeaeae;
}
.vote-text2 {
  font-size: 1.4rem;
  color: #425363;
  font-weight: 600;
}
</style>

<script>
// import Vote from '@/components/Vote'
import steem from '@/services/steem'
import CardMenu from '@/components/post/Menu'

// export const calculateVoteValue = (
//   vests,
//   recentClaims,
//   rewardBalance,
//   rate,
//   vp = 10000,
//   weight = 10000,
// ) => {
//   const vestingShares = parseInt(vests * 1e6, 10);
//   const power = vp * weight / 10000 / 50;
//   const rshares = power * vestingShares / 10000;
//   return rshares / recentClaims * rewardBalance * rate;
// };
//
// export const getTotalShares = user =>
//   parseFloat(user.vesting_shares) +
//   parseFloat(user.received_vesting_shares) +
//   -parseFloat(user.delegated_vesting_shares);
//
// export const getHasDefaultSlider = user => getTotalShares(user) >= 10000000;
//
// export const getVoteValue = (user, recentClaims, rewardBalance, rate, weight = 10000) =>
//   calculateVoteValue(
//     getTotalShares(user),
//     parseFloat(recentClaims),
//     parseFloat(rewardBalance),
//     rate,
//     user.voting_power,
//     weight,
//   );
//
//   const voteWorth = getVoteValue(
//     user,
//     rewardFund.recent_claims,
//     rewardFund.reward_balance,
//     rate,
//     10000,
//   );
//
//   getCurrentValue = () => this.props.voteWorth;

export default {
  props: ['item'],
  components: {
    'card-menu': CardMenu
  },
  data () {
    return {
      dialog: false,
      weight: 100,
      value: 0,
      me: {},
      steemPrice: 0,
      rewardFund: {
        recentClaims: 0,
        rewardBalance: 0
      },
      steemGlobalProperties: {
        totalVestingShares: 0,
        totalVestingFund: 0
      },
      isVoting: false,
      isVoted: false
    }
  },
  mounted () {
    // this.getSteemGlobalProperties()
    // this.getCurrentPrice()
    this.steemGlobalProperties = this.$store.getters.steemGlobalProperties
    this.steemPrice = this.$store.getters.steemPrice
    this.isVoted = this.getVoted()
  },
  filters: {
    tag: (tag) => {
      if (tag === 'steeck-life') return '라이프'
      else if (tag === 'steeck-hot') return '핫이슈'
      else if (tag === 'steeck-game') return '게임'
      else if (tag === 'steeck-travel') return '여행'
      else return tag
    },
    ago: function (date) {
      const diff = (new Date() - date) / 1000 / 60  // min
      // console.log(now, date, diff)
      if (diff < 60) return Math.floor(diff) + '분 전'
      else if (diff < 60 * 24) return Math.floor(diff / 60) + '시간 전'
      else return Math.floor(diff / 60 / 24) + '일 전'
    }
  },
  computed: {
    getPayoutValue: function () {
      // console.log(this.item.content.pending_payout_value)
      return parseFloat(this.item.content.pending_payout_value.replace(' SBD', '')).toFixed(2)
    }
  },
  methods: {
    test: function () {
      console.log(this.me)
    },
    // getSteemGlobalProperties: function () {
    //   let vm = this
    //   this.$steem.api.getDynamicGlobalProperties(function (err, result) {
    //     if (err) {}
    //     vm.steemGlobalProperties.totalVestingShares = result.total_vesting_shares.replace(' VESTS', '')
    //     vm.steemGlobalProperties.totalVestingFund = result.total_vesting_fund_steem.replace(' STEEM', '')
    //   })
    // },
    // getCurrentPrice: function () {
    //   let vm = this
    //   this.$steem.api.getCurrentMedianHistoryPrice(function (err, result) {
    //     if (err) {}
    //     vm.steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
    //   })
    // },
    getVoted: function () {
      let vm = this
      let voted = false
      this.item.content.active_votes.forEach(function (obj) {
        if (obj.voter === vm.$store.state.account.name) {
          voted = true
          return false
        }
      })
      return voted
    },
    getMe: function () {
      let vm = this
      steem.callAsync('get_accounts', [[this.$store.state.account.name]])
        .then(function (result) {
          vm.me = result[0]
        })
    },
    getRewardFund: function () {
      let vm = this
      steem.callAsync('get_reward_fund', ['post'])
        .then(function (result) {
          vm.rewardFund.recentClaims = result.recent_claims
          vm.rewardFund.rewardBalance = result.reward_balance.replace(' STEEM', '')
        })
    },
    getVestingShares: function () {
      return parseFloat(this.me.vesting_shares) +
        parseFloat(this.me.received_vesting_shares) +
        -parseFloat(this.me.delegated_vesting_shares)
    },
    getSteemPower: function () {
      const vestingShares = this.getVestingShares()
      return steem.formatter.vestToSteem(vestingShares, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
    },
    getVoteValue: function () {
      const sp = this.getSteemPower()
      const vp = this.me.voting_power
      const i = this.rewardFund.rewardBalance / this.rewardFund.recentClaims
      const a = this.steemGlobalProperties.totalVestingFund / this.steemGlobalProperties.totalVestingShares
      const r = sp / a
      const m = parseInt(((vp * this.weight / 100) + 49) / 50)
      const l = parseInt(r * m * 100) * i * this.steemPrice
      // console.log(l)

      return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
    },
    openVote: function () {
      this.dialog = true
      this.getMe()
      this.getRewardFund()
    },
    vote: function () {
      let vote = {
        voter: this.$store.state.steemconnect.user.user,
        author: this.item.content.author,
        permlink: this.item.content.permlink,
        weight: this.weight * 100
      }
      console.log(vote)
      let vm = this
      this.isVoting = true
      steem.setAccessToken(this.$store.state.steemconnect.accessToken)
      // old steemconnect
      steem.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
        if (!err) {
          console.log('ok')
          vm.isVoted = true
        }
        vm.isVoting = false
      })
    }
  }
}
</script>
