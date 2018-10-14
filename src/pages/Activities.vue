<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center justify-space-between>
      <v-flex class="font-weight-bold body-2">{{ today }}</v-flex>
      <v-flex justify-end class="text-xs-right">
        <v-btn outline dark round color="deep-purple darken-1" class="font-weight-medium">출석체크</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table :items="history" class="elevation-5" hide-headers hide-actions v-if="history.length > 0">
      <template slot="items" slot-scope="props">
        <td><activity :type="props.item[1].op[0]" :data="props.item[1]"></activity></td>
      </template>
    </v-data-table>
    <infinite-loading @infinite="infiniteHandler" v-if="ableLoading && !isLoading"></infinite-loading>
    <v-flex xs12 justify-center text-xs-center v-if="ableLoading && isLoading">
      <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
    </v-flex>
  </v-container>
</template>

<style scoped>
</style>

<script>
import steem from '@/services/steem'
import Activity from '@/components/activities/Activity'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Activities',
  components: {
    Activity,
    InfiniteLoading
  },
  data () {
    return {
      history: [],
      lastId: -1,
      limit: 29,
      allowed: [
        'vote', 'curation_reward', 'author_reward', 'claim_reward_balance', 'comment', 'transfer', 'transfer_to_vesting', 'custom_json'
      ],
      ableLoading: true,
      isLoading: false,
      today: ''
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchBlog()
    let todayDate = new Date()
    let dd = todayDate.getDate()
    let mm = todayDate.getMonth() + 1
    let yyyy = todayDate.getFullYear()
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    this.today = yyyy + '년 ' + mm + '월' + dd + '일'
  },
  methods: {
    fetchBlog: function () {
      let vm = this
      let username = this.$store.state.me.account.name
      // let username = 'smtion'
      if (!username) {
        return
      }
      steem.api.getAccountHistory(username, this.lastId, this.limit, function (err, result) {
        if (err) {
          vm.ableLoading = false
          return
        }
        vm.lastId = result[0][0] - 1
        if (vm.lastId < vm.limit) vm.limit = vm.lastId
        // console.log(vm.lastId, vm.limit)
        result = result.filter(item => {
          return vm.allowed.indexOf(item[1].op[0]) !== -1
          // const isAllowed = vm.allowed.indexOf(item[1].op[0]) !== -1
          // if (!isAllowed) {
          //   console.info(item[1].op[0])
          // }
          // return isAllowed
        })
        vm.history = vm.history.concat(result.slice().reverse())
        vm.isLoading = false
      })
    },
    infiniteHandler: async function ($state) {
      if (!this.isLoading) {
        this.isLoading = true
        await this.fetchBlog()
        $state.loaded()
      } else {
        $state.loaded()
        console.log('call infiny other')
        this.ableLoading = false
      }
    }
  }
}
</script>
