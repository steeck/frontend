<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      SP : {{ mineSP }}
      received : {{ receivedSP }}
      delegated : {{ delegatedSP }}
    </div>
    <div>
      <v-text-field
        label="Delegatee"
        v-model="data.to"
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        label="보낼SP"
        v-model="data.amount"
      ></v-text-field>
      <div v-if="data.amount">
        {{ spToVests(data.amount) + ' VESTS' }}
      </div>
    </div>
    <div>
      <v-text-field
        label="Active Key"
        v-model="data.wif"
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        label="임대기간"
        v-model="data.weeks"
      ></v-text-field>
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
    <div>
      <v-btn @click="transfer">임대</v-btn>
    </div>
    <div>
      <ul>
        <li v-for="(item, i) in delegations">{{ item }}</li>
      </ul>
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
import steem from '@/services/steem'
import steemconnect from '@/services/steemconnect'
import steemutil from '@/mixins/steemutil'

export default {
  data () {
    return {
      data: {},
      me: {},
      sp: {},
      steemGlobalProperties: {},
      delegations: []
    }
  },
  mixins: [steemutil],
  components: {
  },
  created () {
  },
  mounted () {
    steemconnect.setAccessToken(this.$store.state.accessToken)
    this.getMe()
    this.getVestingDelegations()
  },
  computed: {
    created: function () {
      return this.me.created ? this.me.created.substr(0, 10).replace(/-/g, '/') : ''
    },
    // sp: function () {
    //   const sp = this.getSteemPower()
    //   return isNaN(sp) ? '' : sp
    // }
    mineSP () {
      return steem.formatter.vestToSteem(parseFloat(this.me.vesting_shares), this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund).toFixed(3)
    },
    receivedSP () {
      return steem.formatter.vestToSteem(parseFloat(this.me.received_vesting_shares), this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund).toFixed(3)
    },
    delegatedSP () {
      return steem.formatter.vestToSteem(-parseFloat(this.me.delegated_vesting_shares), this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund).toFixed(3)
    }
  },
  methods: {
    getMe: function () {
      let vm = this
      steemconnect.me((err, res) => {
        if (err) {}
        vm.me = res.account
      })
    },
    getVestingDelegations: function () {
      let vm = this
      steem.api.getVestingDelegations(this.$store.state.username, '', 50, (err, res) => {
        if (err) {}
        vm.delegations = res
      })
    },
    transfer: function () {
      let vm = this
      steem.broadcast.delegateVestingShares(this.data.wif, this.$store.state.username, this.data.to, this.spToVests(this.data.amount) + ' VESTS', (err, res) => {
        if (err) {
        } else {
          vm.getMe()
          vm.getVestingDelegations()
        }
        console.log(err, res)
      })
    }
  }
}
</script>
