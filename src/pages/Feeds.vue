<template>
  <v-container grid-list-xl>
    <v-flex>
      <!--팔로잉 XX-->
      <!--에디터 | 태그-->
      <div class="list-group" id="postList"></div>
      <v-flex v-for="(card, i) in list" :key="'c1'+i">
        <!--<feed-card :item="card"></feed-card>-->
        <card-feed :item="card"></card-feed>
      </v-flex>
      <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading && !page.isLoading"></infinite-loading>
      <v-flex xs12 justify-center text-xs-center v-if="page.ableLoading && page.isLoading">
        <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
      </v-flex>
    </v-flex>
    <!-- <feed-card :item="item"></feed-card> -->
  </v-container>
</template>

<style scoped>
</style>

<script>
import TagList from '@/components/TagList'
import Vote from '@/components/Vote'
import FeedCard from '@/components/post/FeedCard'
import CardFeed from '@/components/post/CardFeed'
import steem from '@/services/steem'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  data () {
    return {
      item: {
        profile: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        images: ['https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'],
        account: {
          name: 'test'
        },
        created: new Date(),
        content: {
          title: 'test'
        }
      },
      list: [],
      value: 1,
      page: {
        lastPermlink: '', // 조회시 조회된 마지막 게시글
        lastAuthor: '', // 조회시 조회된 마지막 유저이름
        loadingForOnce: 20, // 한번에 조회할 양
        ableLoading: true, // default true
        isLoading: true
      }
    }
  },
  components: {
    TagList,
    FeedCard,
    CardFeed,
    Vote,
    InfiniteLoading
  },
  mounted () {
    this.getSteemGlobalProperties()
    this.getCurrentPrice()
    this.getMyFeed()
  },
  methods: {
    getSteemGlobalProperties: function () {
      let vm = this
      steem.api.getDynamicGlobalProperties(function (err, result) {
        if (err) {}
        // vm.steemGlobalProperties.totalVestingShares = result.total_vesting_shares.replace(' VESTS', '')
        // vm.steemGlobalProperties.totalVestingFund = result.total_vesting_fund_steem.replace(' STEEM', '')
        // console.log(result.total_vesting_shares)
        // console.log(parseFloat(result.total_vesting_shares))
        const steemGlobalProperties = {
          totalVestingShares: result.total_vesting_shares.replace(' VESTS', ''),
          totalVestingFund: result.total_vesting_fund_steem.replace(' STEEM', '')
        }
        vm.$store.commit('setSteemGlobalProperties', steemGlobalProperties)
      })
    },
    getCurrentPrice: function () {
      let vm = this
      steem.api.getCurrentMedianHistoryPrice(function (err, result) {
        if (err) {}
        // vm.steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
        const steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
        vm.$store.commit('setSteemPrice', steemPrice)
      })
    },
    getMyFeed: function () {
      // let name = this.$store.state.username
      let name = 'smtion'
      // let name = 'clayop'
      let query = {
        tag: name,
        start_author: this.page.lastAuthor,
        start_permlink: this.page.lastPermlink,
        limit: this.page.loadingForOnce
      }
      steem.api.getDiscussionsByFeedAsync(query)
        .then(result => {
          // console.log(result)
          let resultLength = result.length
          // console.log(this.page.list.length)
          if (this.list.length > 0) {
            result.shift()
            this.list = this.list.concat(result)
          } else {
            this.list = result
          }
          this.page.ableLoading = resultLength === this.page.loadingForOnce
          if (result.length > 0) {
            this.page.lastPermlink = result[result.length - 1].permlink
            this.page.lastAuthor = result[result.length - 1].author
          }
          this.page.isLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    infiniteHandler: function ($state) {
      this.page.isLoading = true
      this.getMyFeed()
      $state.loaded()
    },
    getMyFallowdStatus: function () {

    }
  },
  beforeDestroy () {
    this.page.lastPermlink = ''
    this.page.lastAuthor = ''
    this.list = []
  }
}
</script>
