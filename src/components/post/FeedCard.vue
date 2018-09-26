<template>
  <v-card>
    <v-card-actions>
      <v-flex
        align-center
        justify-center
        layout
      >
        <v-avatar
          color="grey lighten-4"
        >
          <img :src="item.profile" alt="avatar">
        </v-avatar>
        <v-flex
          align-center
          justify-center
        >
          <div>
            {{ item.account.name }}
          </div>
          <div>
            {{ item.created | ago }}
          </div>
        </v-flex>
        <v-btn>
          +팔로우
        </v-btn>
      </v-flex>
      <v-menu bottom left>
        <v-btn
          slot="activator"
          icon
        >
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile
            @click=""
          >
            <v-list-tile-title>공유하기</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click=""
          >
            <v-list-tile-title>팔로우 취소</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click=""
          >
            <v-list-tile-title>다운보트</v-list-tile-title>
          </v-list-tile>
          <v-list-tile
            @click=""
          >
            <v-list-tile-title>신고하기</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-actions>
    <v-card-title primary-title>
      {{ item.content.title }}
    </v-card-title>
    <v-card-text>
      <v-carousel
        hide-delimiters
      >
        <v-carousel-item
          v-for="(image, i) in item.images"
          :key="i"
          :src="image"
        ></v-carousel-item>
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
      }
    }
  },
  mounted () {
    // this.getSteemGlobalProperties()
    // this.getCurrentPrice()
    this.steemGlobalProperties = this.$store.getters.steemGlobalProperties
    this.steemPrice = this.$store.getters.steemPrice
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
    getMe: function () {
      let vm = this
      this.$client.database
        .call('get_accounts', [[this.$store.state.steemconnect.user.user]])
        .then(function (result) {
          vm.me = result[0]
        })
    },
    getRewardFund: function () {
      let vm = this
      this.$client.database
        .call('get_reward_fund', ['post'])
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
      return this.$steem.formatter.vestToSteem(vestingShares, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
    },
    getVoteValue: function () {
      const sp = this.getSteemPower()
      const vp = this.me.voting_power

      const i = this.rewardFund.rewardBalance / this.rewardFund.recentClaims
      const a = this.steemGlobalProperties.totalVestingFund / this.steemGlobalProperties.totalVestingShares

      const r = sp / a
      const m = parseInt(((vp * this.weight / 100) + 49) / 50)
      const l = parseInt(r * m * 100) * i * this.steemPrice

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
        author: this.blog.content.author,
        permlink: this.blog.content.permlink,
        weight: 10000
      }
      this.$steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
        if (!err) {
          console.log('ok')
        }
      })
    }
  }
}
</script>
