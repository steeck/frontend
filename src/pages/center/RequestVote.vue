<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      SP : {{ mineSP }}
      received : {{ receivedSP }}
      delegated : {{ delegatedSP }}
    </div>
    <div>
      <v-text-field
        label="Username"
        v-model="data.username"
        readonly
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        label="보팅할 포스트 URL"
        v-model="data.url"
      ></v-text-field>
    </div>
    <div>
      <v-text-field
        label="송금액"
        v-model="data.amount"
        type="number"
      ></v-text-field>
    </div>
    <div>
      <v-radio-group v-model="data.payment_type">
        <v-radio
          label="STEEM"
          value="STEEM"
        ></v-radio>
        <v-radio
          label="SBD"
          value="SBD"
        ></v-radio>
      </v-radio-group>
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
      <v-btn @click="requestVote">보팅 요청</v-btn>
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
        username: this.$store.state.auth.username
      }
    },
    getVestingDelegations: function () {
      let vm = this
      steem.api.getVestingDelegations(this.$store.state.username, '', 50, (err, res) => {
        if (err) {}
        vm.delegations = res
      })
    },
    requestVote: function () {
      console.log(this.data)
      api.requestVote(this.data).then(res => {
        if (res.status === 200) {
          alert('신청이 완료되었습니다.')
          this.init()
        }
      }).catch(error => {
        if (error) {}
        alert('신청을 실패했습니다. 입력값들을 확인하세요.')
      })
    }
  }
}
</script>
