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
        readonly
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        label="보낼SP"
        v-model="data.sp"
        suffix="SP"
        type="number"
      ></v-text-field>
      <div v-if="data.sp">
        {{ vests + ' VESTS' }}
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
        mask="###"
        suffix="주"
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
      <v-btn @click="delegate">임대</v-btn>
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
import api from '@/api/center'
import steem from '@/services/steem'
import steemutil from '@/mixins/steemutil'

export default {
  data () {
    return {
      data: {},
      delegations: []
    }
  },
  mixins: [steemutil],
  mounted () {
    this.init()
    this.$store.dispatch('me/getAccount')
    this.getVestingDelegations()
  },
  computed: {
    me () {
      return this.$store.state.me.account
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
    vests () {
      return this.spToVests(this.data.sp)
    }
  },
  methods: {
    init: function () {
      this.data = {
        type: 'delegate',
        to: 'steeck',
        from: this.$store.state.auth.username
      }
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
    },
    delegate: function () {
      this.data.vests = this.vests
      console.log(this.data)
      api.delegate(this.data).then(res => {
        if (res.status === 200) {
          alert('임대가 완료되었습니다. 임대한 SP를 회수할 경우 7일이 소요됩니다.')
          this.init()
        }
      }).catch(error => {
        if (error) {}
        alert('임대를 실패했습니다. 입력값들을 확인하세요.')
      })
    }
  }
}
</script>
