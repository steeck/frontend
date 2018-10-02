<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      <v-avatar
        size="80"
        color="grey lighten-4"
      >
        <img :src="me.json_metadata.profile.profile_image" alt="avatar">
      </v-avatar>
      <div class="my-me-name">
        {{ me.name }}
      </div>
      <div class="my-me-about">
        {{ me.json_metadata.profile.about }}
      </div>
      <v-layout
        align-center
        justify-center
        row
        class="text-xs-center"
      >
        <v-flex xs2 md1>
          <div class="my-me-follow-count">
            {{ follow.follower_count }}
          </div>
          <div class="my-me-follow-text">
            팔로워
          </div>
        </v-flex>
        <v-flex xs2 md1>
          <div class="my-me-follow-count">
            {{ follow.following_count }}
          </div>
          <div class="my-me-follow-text">
            팔로잉
          </div>
        </v-flex>
      </v-layout>
      <div class="my-me-created">
        가입일 {{ created }}
      </div>
      <div class="my-me-link">
        <a :href="me.json_metadata.profile.website" target="website">{{ me.json_metadata.profile.website }}</a>
      </div>
      <div>
        <v-btn
          dark
          color="deep-purple"
        >
          팔로우
        </v-btn>
        <v-btn
          dark
          color="light-blue lighten-1"
        >
          송금
        </v-btn>
        <v-btn
          color="error"
        >
          차단
        </v-btn>
      </div>
    </div>

    <!--my 페이지 중앙 메뉴 -->
    <div class="area-my-mid-menu">
      <v-flex sm12 justify-center text-xs-center class="my-mid-menu">
        <v-flex  d-inline-block class="item" :class="{'active' : page.midSelect === 'sticker'}" @click="setMidMenu('sticker')">스티커</v-flex>
        <v-flex  d-inline-block class="item" :class="{'active' : page.midSelect === 'comment'}" @click="setMidMenu('comment')">댓글</v-flex>
        <v-flex  d-inline-block class="item" :class="{'active' : page.midSelect === 'reward'}" @click="setMidMenu('reward')">보상</v-flex>
        <v-flex  d-inline-block class="item" :class="{'active' : page.midSelect === 'wallet'}" @click="setMidMenu('wallet')">지갑</v-flex>
      </v-flex>


      <!--스티커 관련 영역 -->
      <v-slide-y-transition
        class="py-0"
        group
        tag="v-flex"
        v-if="page.midSelect === 'sticker'"
      >
        <!--MY or 북마크 선택 -->
        <v-flex sm12 justify-center class="area-sticker"  transition="slide-y-transition" key="'menu'">
          <v-flex text-xs-left>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'my'}" @click="setSubMenu('my')">MY</v-flex>
            <v-flex d-inline-block class="item-separator">|</v-flex>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'bookmark'}" @click="setSubMenu('bookmark')">북마크</v-flex>
          </v-flex>
        </v-flex>

        <v-flex key="'list'" v-if="page.list.length > 0">
          <div v-for="item in page.list" >
            <card-my :item="item"></card-my>
          </div>
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading"></infinite-loading>
        </v-flex>
        <v-flex key="'empty'" v-else>글이 없습니다.</v-flex>


      </v-slide-y-transition>

    </div>



  </v-container>
</template>

<style lang="scss" scoped>
  @import "../colorset.scss";
  .my-profile {
  border: 0.5px solid #c3c3c3;
  padding-top: 15px;
  padding-bottom: 20px;
  .my-me-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: #425363;
  }
  .my-me-about {
    font-size: .9rem;
    color: #989898;
  }
  .my-me-follow-count {
    font-size: 1.5rem;
    font-weight: 600;
    color: #425363;
  }
  .my-me-follow-text {
    color: #425363;
  }
  .my-me-created {
    color: #425363;
  }
  .my-me-link a {
    color: #425363;
  }
}

  /* 마치페이지 중단 선택 메뉴 */
  .area-my-mid-menu {
    .my-mid-menu {
      border-bottom: 0.5px solid $defaultRightBorderColor;
      padding-bottom: 0 !important;
      .item {
        @extend .basic-item;
        padding: 12px 12px 11.5px;
        position: relative;
        top: 0.5px;
        &.active {
          border-bottom: 0.5px solid $colorForce !important;
        }
        &:hover {
          border-bottom: 0.5px solid $colorBeforeForce;
        }
      }
    }
  }

  /* 스티커 선택시 생성되는 영역 */
  .area-sticker {
    .item {
      @extend .basic-item;
      padding: 0.4rem;
    }

  }


  /* css class var for extend */
  .basic-item {
    transition: 0.2s;
    cursor: pointer;
    color: $colorNoneForce;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &.active {
      color: $colorForce !important;
      font-weight: bold;
    }
    &:hover {
      color: $colorBeforeForce;
      font-weight: bold;
    }
  }

  /* In scope all use */
  .item-separator {
    color: $colorNoneForce;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

</style>

<script>
  import CardMy from '../components/post/CardMy'
  import InfiniteLoading from 'vue-infinite-loading'
  import steem from '@/services/steem'

  export default {
    name: 'My',
    components: {
      'card-my': CardMy,
      InfiniteLoading
    },
    data () {
      return {
        me: {
          json_metadata: {
            profile: {
              profile_image: 'https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png',
              about: 'Update about me',
              name: '',
              location: '',
              website: 'https://about.steeck.io',
              cover_image: ''
            }
          }
        },
        follow: {},
        page: {
          midSelect: 'sticker', // able : ['sticker','comment','reward','wallet']
          subSelect: 'my', // able : {sticker : ['my','bookmark']}
          list: [], // post arr
          loadingForOnce: 5,
          ableLoading: false,
          lastPermlink: '',
          lastAuthor: '',
          isLoading: false
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        console.log(this.$store.state.account.name)
        this.me.json_metadata.profile.name = this.$store.state.account.name
        this.getMe()
        this.getFollow()
      })
    },
    computed: {
      created: function () {
        return this.me.created ? this.me.created.substr(0, 10).replace(/-/g, '/') : ''
      }
    },
    watch: {
      'page.subSelect': function () {
        if (this.page.subSelect === 'my' && this.page.midSelect === 'sticker') {
          this.getMyPost()
        }
        if (this.page.subSelect === 'bookmark' && this.page.midSelect === 'sticker') {
          this.getBookMark()
        }
      }
    },
    methods: {
      getMe: function () {
        let vm = this
        console.log(steem)
        steem.api
          .callAsync('get_accounts', [[this.$store.state.account.name]])
          // .call('get_accounts', [['ura-soul']])
          .then(function (result) {
            result[0].json_metadata = Object.assign(vm.me.json_metadata, JSON.parse(result[0].json_metadata))
            vm.me = result[0]
            vm.getMyPost()
          })
      },
      getFollow: function () {
        let vm = this
        steem.api
          .callAsync('get_follow_count', [this.$store.state.account.name])
          // .call('get_follow_count', ['ura-soul'])
          .then(function (result) {
            vm.follow = result
          })
      },
      setMidMenu: function (value) {
        this.page.midSelect = value
      },
      setSubMenu: function (value) {
        this.page.subSelect = value
      },
      getMyPost: async function () {
        if (this.page.lastPermlink === '') {
          this.resetPageContent()
        }
        console.log('get my post')
        // let filter = 'blog'
        let author = 'clayop'
        // let author = this.me.name
        let query = {
          tag: author,
          limit: this.page.loadingForOnce
        }
        if (this.page.lastPermlink !== '') {
          query.start_author = this.page.lastAuthor
          query.start_permlink = this.page.lastPermlink
        }
        await steem.api
          .getDiscussionsByBlogAsync(query)
          .then(result => {
            let resultLength = result.length
            // console.log(this.page.list.length)
            if (this.page.list.length > 0) {
              result.shift()
              this.page.list = this.page.list.concat(result)
            } else {
              this.page.list = result
            }
            // console.log(resultLength)
            this.page.ableLoading = resultLength === this.page.loadingForOnce
            if (result.length > 0) {
              this.page.lastPermlink = result[result.length - 1].permlink
              this.page.lastAuthor = result[result.length - 1].author
            }
            this.page.isLoading = false
          })
          .catch(err => {
            console.log('Error occured ' + err)
            this.page.isLoading = false
          })
      },
      getBookMark: function () {
        this.resetPageContent()
        console.log('get bookmark')
      },
      infiniteHandler: async function ($state) {
        if (this.page.midSelect === 'sticker' && this.page.subSelect === 'my') {
          if (!this.page.isLoading) {
            this.page.isLoading = true
            await this.getMyPost()
            $state.loaded()
          }
        } else {
          $state.loaded()
          console.log('call infiny other')
          this.page.ableLoading = false
        }
      },
      resetPageContent: function () {
        this.page.list = []
        this.page.lastPermlink = ''
      }
    }
  }
</script>
