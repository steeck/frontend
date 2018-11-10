<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 md5>
        <my-status
          :username="this.$store.state.auth.username"
          class="mb-5"
        ></my-status>
        <v-text-field
          label="임대요청 계정"
          v-model="data.to"
          readonly
        ></v-text-field>
        <v-form ref="form" v-model="valid" lazy-validation class="mb-5">
          <v-text-field
            label="보낼 SP"
            v-model="data.sp"
            suffix="SP"
            type="number"
            :rules="rules.sp"
            required
          ></v-text-field>
          <div v-if="data.sp">
            {{ vests + ' VESTS' }}
          </div>
          <v-text-field
            type="password"
            label="Active Key"
            v-model="data.wif"
            :rules="rules.wif"
            required
          ></v-text-field>
          <v-text-field
            label="임대기간"
            v-model="data.days"
            mask="####"
            suffix="일"
            :rules="rules.days"
            required
          ></v-text-field>
          <v-checkbox
            label="사용자 동의"
            :rules="rules.agree"
            required
          ></v-checkbox>
          <div class="text-xs-center">
            <v-btn
              color="info"
              @click="delegate"
              :loading="isDelegating"
            >
              임대하기
            </v-btn>
          </div>
        </v-form>
      </v-flex>
      <v-flex xs12 md7>
        <v-data-table
          :headers="headers"
          :items="delegations"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.from }}</td>
            <td class="text-xs-center">{{ props.item.to }}</td>
            <td class="text-xs-center">{{ props.item.sp }}</td>
            <td class="text-xs-center">
              <span v-if="restDays(props.item) > 0">{{ restDays(props.item) }}일 남음</span>
              <v-menu
                v-else
                offset-x
                :close-on-content-click="false"
                :disabled="isVoted"
                v-model="show"
              >
                <v-btn
                  round
                  outline
                  color="#6633ff"
                  slot="activator"
                >
                  임대회수
                </v-btn>
                <!-- <v-list>
                  <v-list-tile> -->
                <div class="px-3">
                  <v-layout row wrap align-center>
                    <v-flex xs8>
                      <v-text-field
                        type="password"
                        label="Active Key"
                        v-model="wif2"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs4 class="text-xs-right">
                      <v-btn class="btn-upvote" outline color="deep-purple" round small flat @click="withdraw()" :loading="isWithdrawing">임대회수</v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex class="pt-1 vote-text">임대회수에는 7일이 소요됩니다</v-flex>
                </div>
              </v-menu>
            </td>
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

.v-menu__content {
  background-color: #fff;
  padding-bottom: 8px;
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
      wif2: '',
      valid: true,
      rules: {
        sp: [v => !!v || 'SP를 입력하세요'],
        wif: [v => !!v || 'Private Active Key를 입력하세요'],
        days: [v => !!v || '임대기간을 입력하세요'],
        agree: [v => !!v || '사용자 동의가 필요합니다']
      },
      headers: [
        {text: '빌려준 계정', align: 'center', sortable: false, value: 'from'},
        {text: '임대한 계정', align: 'center', sortable: false, value: 'to'},
        {text: '임대 스팀파워량', align: 'center', sortable: false, value: 'sp'},
        {text: '남은 임대기간', align: 'center', sortable: false, value: 'days'},
        {text: '임대일시', align: 'center', sortable: false, value: 'created_at'}
      ],
      delegations: [],
      show: false,
      isDelegating: false,
      isWithdrawing: false
    }
  },
  mounted () {
    this.init()
    // this.getVestingDelegations()
    // this.$store.dispatch('me/getAccount')
    this.getDelegations()
  },
  computed: {
    vests () {
      return this.spToVests(this.data.sp)
    }
  },
  methods: {
    restDays (item) {
      const created = new Date(item.created_at)
      const today = new Date()
      const duration = parseInt((today - created) / 86400 / 1000)
      const rest = item.days - duration
      return rest > 0 ? rest : 0
    },
    init: function () {
      this.$refs.form.reset()
      this.data = {
        type: 'delegate',
        to: 'steeck',
        from: this.$store.state.auth.username
      }
      this.wif2 = ''
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
      if (!this.$refs.form.validate()) {
        return
      }

      this.data.vests = this.vests
      this.isDelegating = true
      api.delegate(this.data).then(res => {
        if (res.status === 200) {
          alert('임대가 완료되었습니다. 임대한 SP를 회수할 경우 7일이 소요됩니다.')
          this.init()
          this.getDelegations()
          this.isDelegating = false
        }
      }).catch(error => {
        if (error) {}
        alert('임대를 실패했습니다. 입력값들을 확인하세요.')
        this.isDelegating = false
      })
    },
    withdraw: function () {
      if (!this.wif2) {
        alert('Private Active Key를 입력하세요')
        return
      }

      const data = {
        type: 'delegate',
        to: 'steeck',
        from: this.$store.state.auth.username,
        wif: this.wif2,
        sp: 0,
        vests: '0.000000'
      }
      this.isWithdrawing = true
      api.delegate(data).then(res => {
        if (res.status === 200) {
          alert('임대회수가 완료되었습니다. 임대회수에는 7일이 소요됩니다.')
          this.init()
          this.delegations = []
          this.show = false
          this.isWithdrawing = false
        }
      }).catch(error => {
        if (error) {}
        alert('임대회수를 실패했습니다. 입력값들을 확인하세요.')
        this.isWithdrawing = false
      })
    },
    getDelegations: function () {
      let vm = this

      api.getDelegations(this.$store.state.auth.username).then(res => {
        if (res.data.length > 0 && res.data[0].vests > 0) {
          vm.delegations = res.data.slice(0, 1)
        }
      })
    }
  }
}
</script>
