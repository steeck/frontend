<template>
  <v-container grid-list-xl>
    <v-flex>
      <!--팔로잉 XX-->
      <!--에디터 | 태그-->
      <div class="list-group" id="postList"></div>
      <v-flex v-for="(item, i) in list" :key="'c1'+i">
        <!--<feed-card :item="card"></feed-card>-->
        <!-- <card-feed :item="card"></card-feed> -->
        <content-card :item="item"></content-card>
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
import api from '@/api/posts'
import FeedCard from '@/components/post/FeedCard'
import CardFeed from '@/components/post/CardFeed'
import ContentCard from '@/components/post/ContentCard'
// import steem from '@/services/steem'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    FeedCard,
    CardFeed,
    InfiniteLoading,
    ContentCard
  },
  data () {
    return {
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
  mounted () {
    this.getMyFeed()
  },
  methods: {
    getMyFeed: function () {
      let vm = this
      api.getFeed({ following: this.$store.state.me.following })
        .then(res => {
          vm.list = vm.list.concat(res.data)
          // vm.page.isLoading = false

          this.page.ableLoading = res.length === this.page.loadingForOnce
          this.page.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
      // let name = this.$store.state.me.account.name
      // let query = {
      //   tag: name,
      //   start_author: this.page.lastAuthor,
      //   start_permlink: this.page.lastPermlink,
      //   limit: this.page.loadingForOnce
      // }
      // steem.api.getDiscussionsByFeedAsync(query)
      //   .then(result => {
      //     let resultLength = result.length
      //     if (this.list.length > 0) {
      //       result.shift()
      //       this.list = this.list.concat(result)
      //     } else {
      //       this.list = result
      //     }
      //     this.page.ableLoading = resultLength === this.page.loadingForOnce
      //     if (result.length > 0) {
      //       this.page.lastPermlink = result[result.length - 1].permlink
      //       this.page.lastAuthor = result[result.length - 1].author
      //     }
      //     this.page.isLoading = false
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    infiniteHandler: function ($state) {
      this.page.isLoading = true
      this.getMyFeed()
      $state.loaded()
    }
  },
  beforeDestroy () {
    this.page.lastPermlink = ''
    this.page.lastAuthor = ''
    this.list = []
  }
}
</script>
