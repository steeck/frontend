<template>
  <v-container grid-list-xl>
    <v-flex v-if="!isAllow">
      <h3 class="text-xs-center">{{ errorText }}</h3>
    </v-flex>
    <v-flex v-if="isAllow">
      <v-flex mb-5>
        <div>'{{ q }}' 키워드로 총 {{ searchResult.totalCount }} 건의 검색결과가 있습니다. <span @click="viewDetail = !viewDetail" class="span-more">..more</span>
        </div>
        <v-slide-y-transition class="py-0">
          <ul v-if="viewDetail && searchResult.q && searchResult.totalCount > 0">
            <li>
              글제목 부분으로 총 {{ searchResult.title.length }} 건의 결과를 찾았습니다.
              <span v-if="searchResult.title.length > 0" @click="$vuetify.goTo('#titleElement', { offset: -100 })" class="span-more">..이동</span>
            </li>
            <li>
              카테고리부분으로 총 {{ searchResult.category.length }} 건의 결과를 찾았습니다.
              <span v-if="searchResult.category.length > 0" @click="$vuetify.goTo('#categoryElement', { offset: -100 })" class="span-more">..이동</span>
            </li>
            <li>
              작성자 부분으로 총 {{ searchResult.author.length }} 건의 결과를 찾았습니다.
              <span v-if="searchResult.author.length > 0" @click="$vuetify.goTo('#authorElement', { offset: -100 })" class="span-more">..이동</span>
            </li>
          </ul>
        </v-slide-y-transition>
      </v-flex>
      <v-flex v-if="searchResult.title.length > 0">
        <v-flex tag="h2" mb-4 mt-2 class="title-list" id="titleElement">Title ... 총 {{ searchResult.title.length }}건</v-flex>
        <v-flex v-for="(item, i) in searchResult.title" :key="i+1">
          <content-card :item="item" :viewWide="false"></content-card>
        </v-flex>
      </v-flex>
      <v-flex v-if="searchResult.category.length > 0">
        <v-flex tag="h2" mb-4 mt-2 class="title-list" id="categoryElement">Category ... 총 {{ searchResult.category.length }}건</v-flex>
        <v-flex v-for="(item, i) in searchResult.category" :key="i+1">
          <content-card :item="item" :viewWide="false"></content-card>
        </v-flex>
      </v-flex>
      <v-flex v-if="searchResult.author.length > 0">
        <v-flex tag="h2" mb-4 mt-2 class="title-list" id="authorElement">Author ... 총 {{ searchResult.author.length }}건</v-flex>
        <v-flex v-for="(item, i) in searchResult.author" :key="i+1">
          <content-card :item="item" :viewWide="false"></content-card>
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
        }
      }
    },
    computed: {
      searchResult: function () {
        return this.$store.state.searchObj
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
            this.$store.state.searchObj = res.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>
