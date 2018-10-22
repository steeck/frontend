<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center mb-5">
      <h3>Steem Power : {{ mineSP }} SP (+{{ receivedSP - delegatedSP }} SP)</h3>
      <h4>Steem : {{ me.vesting_balance }}</h4>
      <h4>Steem Dollor : {{ me.sbd_balance }}</h4>
      <h4>Saving Steem : {{ me.savings_balance }}</h4>
      <h4>Saving SBD : {{ me.savings_sbd_balance }}</h4>
    </div>
    <v-text-field
      label="Username"
      v-model="data.username"
      readonly
    ></v-text-field>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        label="보팅할 포스트 URL"
        v-model="data.url"
        :rules="rules.url"
        required
      ></v-text-field>
      <v-text-field
        label="송금액"
        v-model="data.amount"
        type="number"
        :rules="rules.amount"
        required
      ></v-text-field>
      <v-radio-group
        v-model="data.payment_type"
        :rules="rules.payment_type"
        required
      >
        <v-radio
          label="STEEM"
          value="STEEM"
        ></v-radio>
        <v-radio
          label="SBD"
          value="SBD"
        ></v-radio>
      </v-radio-group>
      <v-checkbox
        label="사용자 동의"
        :rules="rules.agree"
        required
      ></v-checkbox>
      <v-btn
        color="info"
        @click="requestVote"
      >
        보팅 신청
      </v-btn>
    </v-form>
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
      valid: true,
      rules: {
        url: [v => !!v || '보팅할 포스트 URL'],
        amount: [v => !!v || '송금액을 입력하세요'],
        payment_type: [v => !!v || '송금액 종류를 선택하세요'],
        agree: [v => !!v || '사용자 동의가 필요합니다']
      },
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
      this.$refs.form.reset()
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
      if (!this.$refs.form.validate()) {
        return
      }

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
