<template>
  <v-container grid-list-xl>
    <v-flex v-for="(item, i) in list" :key="i+1">
      <content-card :item="item"></content-card>
    </v-flex>
    <!--<v-flex v-for="(item, i) in list" :key="i">-->
      <!--<list-card :item="item"></list-card>-->
    <!--</v-flex>-->
  </v-container>
</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>

<script>
import api from '@/api/posts'
import TagList from '@/components/TagList'
import Vote from '@/components/Vote'
import FeedCard from '@/components/post/FeedCard'
import ListCard from '@/components/post/ListCard'
import CardFeed from '@/components/post/CardFeed'
import InfiniteLoading from 'vue-infinite-loading'
import ContentCard from '@/components/post/ContentCard'

export default {
  components: {
    TagList,
    FeedCard,
    CardFeed,
    Vote,
    ListCard,
    InfiniteLoading,
    ContentCard
  },
  props: ['category'],
  data () {
    return {
      list: [],
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
    if (!this.category) {
      this.category = 'hot'
    }
    this.getContents()
  },
  watch: {
    category () {
      console.log(this.category)
      this.list = []
      this.getContents()
    }
  },
  methods: {
    getContents: function () {
      let data = {
        category: this.category
      }
      let vm = this
      api.getByCategory(data)
        .then(res => {
          vm.list = res.data
          this.page.isLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    view: function () {
      // $this.router('')
    }
  }
}
</script>
