<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-btn>출석체크</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table :items="history" class="elevation-5" hide-headers hide-actions v-if="history.length > 0">
      <template slot="items" slot-scope="props">
        <td><activity :type="props.item[1].op[0]" :data="props.item[1]"></activity></td>
      </template>
    </v-data-table>
    <infinite-loading @infinite="infiniteHandler" v-if="ableLoading && !isLoading"></infinite-loading>
    <v-flex xs12 justify-center text-xs-center v-if="ableLoading && isLoading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-flex>
    <!--<div v-for="(item, i) in history">-->
      <!--<activity :type="item[1].op[0]" :data="item[1]"></activity>-->
    <!--</div>-->
    <!--<v-btn :disabled="limit === -1" @click="fetchBlog()">more</v-btn>-->
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
      isLoading: false
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchBlog()
  },
  methods: {
    fetchBlog: function () {
      let vm = this
      steem.api.getAccountHistory('smtion', this.lastId, this.limit, function (err, result) {
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
