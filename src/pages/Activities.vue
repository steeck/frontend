<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-btn>출석체크</v-btn>
      </v-flex>
    </v-layout>
    <div v-for="(item, i) in history">
      <activity :type="item[1].op[0]" :data="item[1].op[1]"></activity>
    </div>
    <v-btn :disabled="limit === -1" @click="fetchBlog()">more</v-btn>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<script>
import Activity from '@/components/activities/Activity'
export default {
  data () {
    return {
      date: '2018-04-04',
      history: [],
      lastId: -1,
      limit: 29
    }
  },
  components: {
    Activity
  },
  filters: {
    ago: function (date) {
      date = new Date(date)
      const diff = (new Date() - date) / 1000 / 60  // min
      // console.log(now, date, diff)
      if (diff < 60) return Math.floor(diff) + '분 전'
      else if (diff < 60 * 24) return Math.floor(diff / 60) + '시간 전'
      else return Math.floor(diff / 60 / 24) + '일 전'
    }
  },
  mounted () {
    this.fetchBlog()
  },
  computed: {
    getDate: function () {

    }
  },
  methods: {
    fetchBlog: function () {
      let vm = this
      this.$steem.api.getAccountHistory('smtion', this.lastId, this.limit, function (err, result) {
        if (err) {}
        vm.lastId = result[0][0] - 1
        if (vm.lastId < vm.limit) vm.limit = vm.lastId
        // console.log(vm.lastId, vm.limit)
        vm.history = vm.history.concat(result.slice().reverse())
      })
    }
  }
}
</script>
