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
        가입일 {{ me.created }}
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

  export default {
    name: 'My',
    components: {
      'card-my': CardMy
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
          list: [] // post arr
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.me.json_metadata.profile.name = this.$store.state.steemconnect.user.user
        this.getMe()
        this.getFollow()
      })
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
        this.$client.database
          .call('get_accounts', [[this.$store.state.steemconnect.user.user]])
          // .call('get_accounts', [['ura-soul']])
          .then(function (result) {
            result[0].json_metadata = Object.assign(vm.me.json_metadata, JSON.parse(result[0].json_metadata))
            vm.me = result[0]
            vm.me.created = vm.me.created.substr(0, 10).replace(/-/g, '/')
            vm.getMyPost()
          })
      },
      getFollow: function () {
        let vm = this
        this.$client.database
          .call('get_follow_count', [this.$store.state.steemconnect.user.user])
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
      getMyPost: function () {
        this.resetPageContent()
        console.log('get my post')
        console.log(this.me)
        let filter = 'blog'
        let query = {
          tag: this.me.name,
          limit: 5
        }
        this.$client.database.getDiscussions(filter, query)
          .then(result => {
            this.page.list = result
            // console.log(result)
          })
          .catch(err => {
            console.log('Error occured ' + err)
          })
      },
      getBookMark: function () {
        this.resetPageContent()
        console.log('get bookmark')
      },
      resetPageContent: function () {
        this.page.list = []
      }
    }
  }
</script>
