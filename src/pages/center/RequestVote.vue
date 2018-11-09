<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 md5>
        <my-status
          :username="'steeck'"
          class="mb-5"
        ></my-status>
        <v-text-field
          label="보팅요청 계정"
          v-model="data.username"
          readonly
        ></v-text-field>
        <v-form ref="form" v-model="valid" lazy-validation class="mb-5">
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
          <div class="text-xs-center">
            <v-btn
              color="info"
              @click="requestVote"
            >
              보팅 신청
            </v-btn>
          </div>
        </v-form>
      </v-flex>
      <v-flex xs12 md7>
        <v-data-table
          :headers="headers"
          :items="requests"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.url }}</td>
            <td class="text-xs-center">{{ props.item.amount }}</td>
            <td class="text-xs-center">{{ props.item.payment_type }}</td>
            <td class="text-xs-center">{{ props.item.created_at | moment('YYYY-MM-DD HH:mm:ss') }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
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
import MyStatus from '@/components/center/MyStatus'

export default {
  components: {
    MyStatus
  },
  mixins: [steemutil],
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
      headers: [
        {text: '스티커 주소', align: 'center', sortable: false, value: 'url'},
        {text: '송금액', align: 'center', sortable: false, value: 'amount'},
        {text: '송금액 종류', align: 'center', sortable: false, value: 'payment_type'},
        {text: '요청일시', align: 'center', sortable: false, value: 'created_at'}
      ],
      requests: []
    }
  },
  mounted () {
    this.init()
    this.$store.dispatch('me/getAccount')
    this.getRequestVotes()
  },
  computed: {
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
    },
    getRequestVotes: function () {
      let vm = this

      api.getRequestVotes(this.$store.state.auth.username).then(res => {
        vm.requests = res.data
      })
    }
  }
}
</script>
