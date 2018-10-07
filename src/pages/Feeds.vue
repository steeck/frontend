<template>
  <v-container grid-list-xl>
    <v-flex>
      팔로잉 XX
      에디터 | 태그
      <div class="list-group" id="postList"></div>
      <v-flex v-for="(card, i) in list" :key="'c1'+i">
        <feed-card :item="card"></feed-card>
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
import steem from '@/services/steem'

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
      value: 1
    }
  },
  components: {
    TagList,
    FeedCard,
    Vote
  },
  mounted () {
    this.getSteemGlobalProperties()
    this.getCurrentPrice()
    this.fetchBlog()
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
    }
  }
}
</script>
