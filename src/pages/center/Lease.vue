<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 md5>
        <my-status
          :username="'steeck'"
          class="mb-5"
        ></my-status>
        <v-text-field
          label="Borrower"
          v-model="data.to"
          readonly
        ></v-text-field>
        <v-form ref="form" v-model="valid" lazy-validation class="mb-5">
          <v-text-field
            label="빌릴 SP"
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
            label="빌릴기간"
            v-model="data.weeks"
            mask="###"
            suffix="주"
            :rules="rules.weeks"
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
              @click="lease"
            >
              SP 빌리기 신청
            </v-btn>
          </div>
        </v-form>
      </v-flex>
      <v-flex xs12 md7>
        <v-data-table
          :headers="headers"
          :items="leases"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.from }}</td>
            <td class="text-xs-center">{{ props.item.to }}</td>
            <td class="text-xs-center">{{ props.item.sp }}</td>
            <td class="text-xs-center">{{ props.item.weeks }}</td>
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
        sp: [v => !!v || 'SP를 입력하세요'],
        weeks: [v => !!v || '빌릴기간을 입력하세요'],
        agree: [v => !!v || '사용자 동의가 필요합니다']
      },
      headers: [
        {text: 'Delegator', align: 'center', sortable: false, value: 'to'},
        {text: 'Delegatee', align: 'center', sortable: false, value: 'from'},
        {text: 'Steem Power', align: 'center', sortable: false, value: 'sp'},
        {text: 'Weeks', align: 'center', sortable: false, value: 'weeks'},
        {text: 'Date', align: 'center', sortable: false, value: 'created_at'}
      ],
      leases: []
    }
  },
  mounted () {
    this.init()
    this.getLeases()
    // this.getVestingDelegations()
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
        type: 'lease',
        from: 'steeck',
        to: this.$store.state.auth.username
      }
    },
    getVestingDelegations: function () {
      let vm = this
      steem.api.getVestingDelegations(this.$store.state.username, '', 50, (err, res) => {
        if (err) {}
        vm.delegations = res
      })
    },
    lease: function () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.data.vests = this.vests
      api.lease(this.data).then(res => {
        if (res.status === 200) {
          alert('신청이 완료되었습니다.')
          this.init()
        }
      }).catch(error => {
        if (error) {}
        alert('신청을 실패했습니다. 입력값들을 확인하세요.')
      })
    },
    getLeases: function () {
      let vm = this

      api.getLeases(this.$store.state.auth.username).then(res => {
        vm.leases = res.data
      })
    }
  }
}
</script>
