<template>
  <v-container grid-list-xl>
    <v-flex>
      팔로잉 XX
      에디터 | 태그
      <div class="list-group" id="postList"></div>
      <v-flex v-for="(card, i) in list" :key="'c1'+i">
        <feed-card :item="card"></feed-card>
      </v-flex>
      <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading"></infinite-loading>
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
        loadForPage: 20, // 한번에 조회할 양
        ableLoading: false, // default false
        isLoading: false
      }
    }
  },
  components: {
    TagList,
    FeedCard,
    Vote,
    InfiniteLoading
  },
  mounted () {
    this.getSteemGlobalProperties()
    this.getCurrentPrice()
    this.fetchBlog()
    // this.getMyFeed() // 피드 로딩방식 변경 manbok
  },
  methods: {
    getSteemGlobalProperties: function () {
      let vm = this
      steem.api.getDynamicGlobalProperties(function (err, result) {
        if (err) {}
        // vm.steemGlobalProperties.totalVestingShares = result.total_vesting_shares.replace(' VESTS', '')
        // vm.steemGlobalProperties.totalVestingFund = result.total_vesting_fund_steem.replace(' STEEM', '')
        console.log(result.total_vesting_shares)
        console.log(parseFloat(result.total_vesting_shares))
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
    getMyFeed: async function () {
      let name = this.$store.state.username
      // let name = 'clayop'
      let query = {
        tag: name,
        start_author: this.page.lastCommentAuthor,
        start_permlink: this.page.lastPermlink,
        limit: this.page.loadForPage
      }
      await steem.api.getDiscussionsByFeedAsync(query)
        .then(result => {
          console.log(result)
          let resultLength = result.length
          // console.log(this.page.list.length)
          if (this.list.length > 0) {
            result.shift()
            this.list = this.page.list.concat(result)
          } else {
            this.list = result
          }
          // console.log(resultLength)
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
    infiniteHandler: async function ($state) {
      this.page.isLoading = true
      await this.getMyFeed()
      $state.loaded()
    },
    fetchBlog: function () {
      // const query = {
      //   tag: 'tasteem-kr',
      //   limit: 20
      // }
      steem.api
        .getStateAsync('/hot/tasteem')
        .then(result => {
          console.log(result)
          let idxes = result.discussion_idx.tasteem.hot
          idxes.forEach(idx => {
            // return
            // const { username, permlink } = post.split('/')
            const username = idx.split('/')[0]
            const permlink = idx.split('/')[1]
            const account = result.accounts[username]
            const accountJson = JSON.parse(account.json_metadata)
            const accountImage = accountJson.profile ? accountJson.profile.profile_image : ''
            const content = result.content[idx]
            // const title = content.title
            const contentJson = JSON.parse(content.json_metadata)
            const contentImage = contentJson.image ? contentJson.image[0] : ''
            const contentImages = contentJson.image ? contentJson.image : ''
            let created = new Date(content.created)// .toDateString()
            let convTime = new Date(created.setHours(created.getHours() + 9))

            let post = {
              permlink: permlink,
              account: account,
              content: content,
              thumbnail: contentImage,
              profile: accountImage,
              images: contentImages,
              created: convTime
            }

            this.list.push(post)
            // const title = post.title
            // const author = post.author
            // this.list.push(
            //   `<div class="list-group-item"><h4 class="list-group-item-heading">${content.title}</h4><p>by ${account.name}</p><center><img src="${image}" class="img-responsive center-block" style="max-width: 450px"/></center><p class="list-group-item-text text-right text-nowrap">${created}</p></div>`
            // )
          })

          // document.getElementById('postList').innerHTML = this.list.join('')
        })
        .catch(err => {
          console.log('Error occured' + err)
        })
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
