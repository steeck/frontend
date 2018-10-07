<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      SP : {{ sp }}
    </div>
    <div>
      Delegatee : <input type="text" v-model="data.to">
    </div>
    <div>
      보낼SP : <input type="text" v-model="data.amount">
    </div>
    <div>
      Active Key : <input type="text" v-model="data.wif">
    </div>
    <div>
      임대기간 : <input type="text" v-model="data.weeks">
    </div>
    <div>
      예상수익
    </div>
    <div>
      사용자 동의 <input type="checkbox">
    </div>
    <div>
      약관...<br>...
    </div>
  </v-container>
</template>

<style scoped>
.my-profile {
  border: 0.5px solid #c3c3c3;
  padding-top: 15px;
  padding-bottom: 20px;
}
.my-me-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #425363;
}
.my-me-about {
  font-size: .9rem;
  color: #989898;
}
.my-me-follow-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #425363;
}
.my-me-follow-text {
  color: #425363;
}
.my-me-created {
  color: #425363;
}
.my-me-link a {
  color: #425363;
}
</style>

<script>
export default {
  data () {
    return {
      data: {},
      me: {},
      steempowers: {},
      steemGlobalProperties: {},
      delegations: []
    }
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.getSteemGlobalProperties()
    this.getMe()
    this.getVestingDelegations()
    this.$nextTick(function () {

    })
  },
  computed: {
    created: function () {
      return this.me.created ? this.me.created.substr(0, 10).replace(/-/g, '/') : ''
    },
    sp: function () {
      const sp = this.getSteemPower()
      return isNaN(sp) ? '' : sp
    }
  },
  methods: {
    getSteemGlobalProperties: function () {
      let vm = this
      this.$steem.api.getDynamicGlobalProperties(function (err, result) {
        if (err) {}
        vm.steemGlobalProperties = {
          totalVestingShares: result.total_vesting_shares.replace(' VESTS', ''),
          totalVestingFund: result.total_vesting_fund_steem.replace(' STEEM', '')
        }
        vm.$store.commit('setSteemGlobalProperties', vm.steemGlobalProperties)
      })
    },
    getMe: function () {
      let vm = this
      this.$client.database
        .call('get_accounts', [[this.$store.state.steemconnect.user.user]])
        .then(function (result) {
          vm.me = result[0]
        })
    },
    getSteemPowers: function () {
      const a = parseFloat(this.me.vesting_shares)
      const b = parseFloat(this.me.received_vesting_shares)
      const c = -parseFloat(this.me.delegated_vesting_shares)
      this.steempowers.mine = this.$steem.formatter.vestToSteem(a, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
      this.steempowers.received = this.$steem.formatter.vestToSteem(b, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
      this.steempowers.delegated = this.$steem.formatter.vestToSteem(c, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
    },
    getVestingShares: function () {
      return parseFloat(this.me.vesting_shares) +
        parseFloat(this.me.received_vesting_shares) +
        -parseFloat(this.me.delegated_vesting_shares)
    },
    getSteemPower: function () {
      this.getSteemPowers()
      const vestingShares = this.getVestingShares()
      return this.$steem.formatter.vestToSteem(vestingShares, this.steemGlobalProperties.totalVestingShares, this.steemGlobalProperties.totalVestingFund)
    },
    getVestingDelegations: function () {
      let vm = this
      let user = this.$store.state.steemconnect.user.user
      this.$steem.api.getVestingDelegations(user, '', 50, function (err, result) {
        if (err) {}
        vm.delegations = result
      })
    },
    transfer: function () {
      let from = this.$store.state.steemconnect.user.user
      this.$steem.api.broadcast.transferToVesting(this.data.wif, from, this.data.to, this.data.amount, function (err, result) {
        if (err) {}
        console.log(err, result)
      })
    }
  }
}
</script>
