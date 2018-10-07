<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-btn>출석체크</v-btn>
      </v-flex>
    </v-layout>
    <div v-for="(item, i) in history">
      <activity :type="item[1].op[0]" :data="item[1]"></activity>
    </div>
    <v-btn :disabled="limit === -1" @click="fetchBlog()">more</v-btn>
  </v-container>
</template>

<style scoped>
</style>

<script>
import steem from '@/services/steem'
import Activity from '@/components/activities/Activity'

export default {
  data () {
    return {
      date: '2018-04-04',
      history: [],
      lastId: -1,
      limit: 29,
      allowed: [
        'vote', 'curation_reward', 'author_reward', 'claim_reward_balance', 'comment', 'transfer', 'transfer_to_vesting', 'custom_json'
      ]
    }
  },
  components: {
    Activity
  },
  mounted () {
    this.fetchBlog()
  },
  methods: {
    fetchBlog: function () {
      let vm = this
      steem.api.getAccountHistory('smtion', this.lastId, this.limit, function (err, result) {
        if (err) {}
        vm.lastId = result[0][0] - 1
        if (vm.lastId < vm.limit) vm.limit = vm.lastId
        // console.log(vm.lastId, vm.limit)
        result = result.filter(item => {
          const isAllowed = vm.allowed.indexOf(item[1].op[0]) !== -1
          if (!isAllowed) {
            console.info(item[1].op[0])
          }
          return isAllowed
        })
        vm.history = vm.history.concat(result.slice().reverse())
      })
    }
  }
}
</script>
