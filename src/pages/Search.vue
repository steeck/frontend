<template>
  <v-container grid-list-xl>
    <v-flex v-if="!isAllow">
      <h3 class="text-xs-center">{{ errorText }}</h3>
    </v-flex>
    <v-flex v-if="isAllow">
      <v-flex mb-5>
        <div>'{{ q }}' 키워드로 총 {{ searchResult.totalCount }} 건의 검색결과가 있습니다.</div>
      </v-flex>
      <v-flex v-if="list.length > 0">
        <v-flex v-for="(item, i) in list" :key="i+1">
          <content-card :item="item" :viewWide="false"></content-card>
        </v-flex>
        <infinite-loading @infinite="infiniteHandler" v-if="list.length < searchResult.totalCount && !page.isLoading"></infinite-loading>
        <v-flex xs12 justify-center text-xs-center v-if="list.length < searchResult.totalCount && page.isLoading">
          <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
        </v-flex>
      </v-flex>
    </v-flex>

    <!--<v-flex v-for="(item, i) in list" :key="i">-->
    <!--<list-card :item="item"></list-card>-->
    <!--</v-flex>-->
  </v-container>
</template>

<style scoped>
  .span-more {
    text-decoration: none;
    color: gray;
    cursor: pointer;
  }

  .title-list {
    border-bottom: 2px solid #999999;
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

  /**
   * @property {number} totalCount
   */

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
    props: ['q'],
    data () {
      return {
        isAllow: false,
        errorText: '',
        viewDetail: false,
        list: [],
        page: {
          lastPermlink: '', // 조회시 조회된 마지막 게시글
          lastAuthor: '', // 조회시 조회된 마지막 유저이름
          loadingForOnce: 20, // 한번에 조회할 양
          ableLoading: true, // default true
          isLoading: true
        },
        searchResult: {}
      }
    },
    mounted () {
      if (this.searchResult.q) {
        if (this.searchResult.q !== this.q) {
          this.getContents()
        } else {
          this.isAllow = true
        }
      } else {
        this.getContents()
      }
    },
    watch: {
      q: function () {
        this.searchResult.q = this.q
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      },
      searchResult: {
        handler: function (val, oldVal) {
          if (this.searchResult.totalCount === 0) {
            this.isAllow = false
            this.errorText = '검색결과가 없습니다.'
          } else {
            this.isAllow = true
          }
        },
        deep: true
      },
      'searchResult.q': function () {
        this.getContents()
      }
    },
    methods: {
      getContents: function () {
        if (this.q.length < 2) {
          this.isAllow = false
          this.errorText = '검색어는 2글자 이상 입력해주세요'
          return
        }
        api.getSearch(this.q)
          .then(res => {
            this.searchResult = res.data
            this.list = res.data.list
            this.isAllow = true
            this.page.isLoading = false
          })
          .catch(error => {
            console.log(error)
            this.page.isLoading = false
          })
      },
      moreSearch: function () {
        console.log('i')
        let targetPage = this.searchResult.page + 1
        let params = {
          moreType: 'more',
          page: targetPage
        }
        let url = '/posts/search/' + this.searchResult.q
        api.moreSearch(url, params)
          .then(res => {
            this.searchResult.page ++
            this.searchResult.list = this.searchResult.list.concat(res.data)
            this.list = this.list.concat(res.data)
          })
          .catch(err => {
            console.log(err)
            this.page.isLoading = false
          })
      },
      infiniteHandler: function ($state) {
        this.page.isLoading = true
        this.moreSearch()
        $state.loaded()
      }
    }
  }
</script>
