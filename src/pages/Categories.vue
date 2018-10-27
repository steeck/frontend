<template>
  <v-container grid-list-xl>
    <v-flex v-for="(item, i) in list" :key="i">
      {{ item.title}}
      <v-carousel>
        <v-carousel-item
          v-for="(card, i) in item.contents"
          :key="i"
          :src="card.url ? card.url : ''"
        >
          <pre>{{ card.text }}</pre>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<style scoped>
</style>

<script>
import api from '@/api/posts'
import TagList from '@/components/TagList'
import Vote from '@/components/Vote'
import FeedCard from '@/components/post/FeedCard'
import CardFeed from '@/components/post/CardFeed'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  components: {
    TagList,
    FeedCard,
    CardFeed,
    Vote,
    InfiniteLoading
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
    console.log(this.category)
    if (!this.category) {
      this.category = 'hot'
    }
    this.getContents()
  },
  watch: {
    category () {
      console.log(this.category)
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
    }
  }
}
</script>
