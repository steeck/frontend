<template>
  <!--보상영역 스팀보상 스틱보상-->
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
        <v-flex sm12 justify-center class="area-submenu"  transition="slide-y-transition" key="'menu'">
          <v-flex text-xs-left>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'my'}" @click="setSubMenu('my')">MY</v-flex>
            <v-flex d-inline-block class="item-separator">|</v-flex>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'bookmark'}" @click="setSubMenu('bookmark')">북마크</v-flex>
          </v-flex>
        </v-flex>

        <v-list key="'list'" v-if="page.list.length > 0">
          <div v-for="item in page.list" >
            <card-my :item="item" :post-type="'post'"></card-my>
          </div>
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading"></infinite-loading>
        </v-list>
        <v-flex key="'empty'" v-else>글이 없습니다.</v-flex>
      </v-slide-y-transition>

      <!--댓글 관련 내용-->
      <v-slide-y-transition
        class="py-0"
        group
        tag="v-flex"
        v-if="page.midSelect === 'comment'"
      >
        <!--내가 쓴 댓글 or 받은 댓글 선택 -->
        <v-flex sm12 justify-center class="area-submenu"  transition="slide-y-transition" key="'menu'">
          <v-flex text-xs-left>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'myComment'}" @click="setSubMenu('myComment')">내가 쓴 댓글</v-flex>
            <v-flex d-inline-block class="item-separator">|</v-flex>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'receivedComment'}" @click="setSubMenu('receivedComment')">받은 댓글</v-flex>
          </v-flex>
        </v-flex>
        <v-list key="'list'" v-if="page.commentList.length > 0">
          <div v-for="item in page.commentList" >
            <card-my :item="item" :post-type="'comment'"></card-my>
          </div>
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading && !page.isLoading"></infinite-loading>
          <div v-if="page.ableLoading && page.isLoading">로딩중...</div>
        </v-list>
        <v-flex key="'empty'" v-else>글이 없습니다.</v-flex>
      </v-slide-y-transition>

      <!--보상 관련 내용-->
      <v-slide-y-transition
        class="py-0"
        group
        tag="v-flex"
        v-if="page.midSelect === 'reward'"
      >
        <!--보상 or 큐레이션 보상 선택 -->
        <v-flex sm12 justify-center class="area-submenu"  transition="slide-y-transition" key="'reward'">
          <v-flex text-xs-left>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'reward'}" @click="setSubMenu('reward')">보상</v-flex>
            <v-flex d-inline-block class="item-separator">|</v-flex>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'curationReward'}" @click="setSubMenu('curationReward')">큐레이션 보상</v-flex>
          </v-flex>
        </v-flex>

        <v-list v-if="page.subSelect === 'curationReward' && page.curationRewardList.length > 0" key="'reward-curationReward'">
          <v-data-table
            :items="page.curationRewardList"
            class="elevation-5"
            hide-headers
            no-data-text="'조회 결과가 없습니다.'"
            :rows-per-page-items="[10, 20, 30]"
            :rows-per-page-text="'보상목록 표시 개수'"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.timestamp | ago }}</td>
              <td>
                <span>({{ props.item.reward}} _todo)STEEM POWER</span>
                <span>for {{ props.item.comment_author}} / {{ props.item.comment_permlink}}</span>
              </td>
            </template>
            <template slot="pageText" slot-scope="props">
              {{ props.pageStart }} - {{ props.pageStop }} / 총 {{ props.itemsLength }}
            </template>
          </v-data-table>

          <!--<div v-for="item in page.curationRewardList">-->
            <!--<v-card class="my-3">-->
              <!--<v-card-text>-->
                <!--<v-layout row>-->
                  <!--<v-flex xs3>{{ item.timestamp | ago}}</v-flex>-->
                  <!--<v-flex xs9>-->
                    <!--<span>{{ item.reward}} STEEM POWER (계산필요)</span>-->
                    <!--<span>for {{ item.comment_author}} / {{ item.comment_permlink}}</span>-->
                  <!--</v-flex>-->
                <!--</v-layout>-->
              <!--</v-card-text>-->
            <!--</v-card>-->
          <!--</div>-->
        </v-list>

      </v-slide-y-transition>



    </div>
    <!--My 페이지 종료-->



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

  /* 컨텐츠 내 메뉴 선택시 생성되는 영역 */
  .area-submenu {
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
          subSelect: 'my', // able : {sticker : ['my','bookmark'], comment : ['myComment', 'receivedComment'], reward: ['reward', 'curationReward']}
          list: [], // post arr
          commentList: [], // comment arr
          curationRewardList: [],
          loadingForOnce: 5,
          ableLoading: false, // 로딩 가능한지 확인하는 변수
          lastPermlink: '', // sticker post 조회시 조회된 마지막 게시글
          lastAuthor: '', // sticker post 조회시 조회된 마지막 유저이름
          lastCommentPermlink: '',
          lastCommentAuthor: '',
          isLoading: false // 인피니티 로딩 구동 토글 변수
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
      'page.midSelect': function () {
        this.resetPageContent()
        if (this.page.midSelect === 'sticker') {
          this.page.subSelect = 'my'
        } else if (this.page.midSelect === 'comment') {
          this.page.subSelect = 'myComment'
        } else if (this.page.midSelect === 'reward') {
          this.page.subSelect = 'reward'
        }
      },
      'page.subSelect': function () {
        this.resetPageContent()
        if (this.page.midSelect === 'sticker') {
          if (this.page.subSelect === 'my') {
            this.getMyPost()
          }
          if (this.page.subSelect === 'bookmark') {
            this.getBookMark()
          }
        } else if (this.page.midSelect === 'comment') {
          this.getComment()
        } else if (this.page.midSelect === 'reward') {
          this.getReward()
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
      /**
       * 내 글 가져오기
       * @returns {Promise<void>}
       */
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
      /**
       * 댓글 로딩
       * @returns {Promise<void>}
       */
      getComment: async function () {
        // console.log('getComment ' + this.page.subSelect)
        // let methodStr = this.page.subSelect === 'myComment' ? '' : ''
        // console.log(methodStr)
        let author = 'clayop'
        // let author = this.me.name
        let query = {
          tag: author,
          limit: this.page.loadingForOnce
        }
        if (this.page.lastCommentPermlink !== '') {
          query.start_author = this.page.lastCommentAuthor
          query.start_permlink = this.page.lastCommentPermlink
        } else {
          query.start_author = author
          query.start_permlink = ''
        }
        let vm = this
        if (this.page.subSelect === 'myComment') {
          // my comment
          await steem.api.getDiscussionsByCommentsAsync(query)
            .then(result => {
              // console.log(result)
              let resultLength = result.length
              if (vm.page.commentList.length > 0) {
                result.shift()
                vm.page.commentList = vm.page.commentList.concat(result)
              } else {
                vm.page.commentList = result
              }
              // console.log(resultLength)
              vm.page.ableLoading = resultLength === vm.page.loadingForOnce
              if (result.length > 0) {
                vm.page.lastCommentPermlink = result[result.length - 1].permlink
                vm.page.lastCommentAuthor = result[result.length - 1].author
              }
              vm.page.isLoading = false
            })
            .catch(error => {
              console.log(error)
            })
        } else if (this.page.subSelect === 'receivedComment') {
          // received comment
          try {
            steem.api.getRepliesByLastUpdate(query.start_author, query.start_permlink, this.page.loadingForOnce, (error, result) => {
              if (error) {
                console.log(error)
              }
              if (result) {
                // console.log(result)
                let resultLength = result.length
                if (vm.page.commentList.length > 0) {
                  result.shift()
                  vm.page.commentList = vm.page.commentList.concat(result)
                } else {
                  vm.page.commentList = result
                }
                // console.log(resultLength)
                vm.page.ableLoading = resultLength === vm.page.loadingForOnce
                if (result.length > 0) {
                  vm.page.lastCommentPermlink = result[result.length - 1].permlink
                  vm.page.lastCommentAuthor = result[result.length - 1].author
                }
                vm.page.isLoading = false
              }
            })
          } catch ($e) {
            console.log($e)
          }
        }
      },
      getReward: async function () {
        console.log('get reward')
        // let name = 'clayop'
        let name = this.me.name
        let vm = this
        await steem.api.getStateAsync('/@' + name + '/transfers')
          .then(result => {
            console.log(result.accounts[name].transfer_history)
            if (!result.accounts[name].transfer_history || result.accounts[name].transfer_history.length === 0) {
              return
            }
            // 큐레이션 보상과 기타 보상을 추출
            let curationArrTmp = []
            result.accounts[name].transfer_history.forEach(line => {
              console.log(line[1] && line[1].op[0])
              if (line[1] && line[1].op[0] === 'curation_reward') {
                curationArrTmp.push(Object.assign({timestamp: line[1].timestamp}, line[1].op[1]))
              }
            })
            vm.page.curationRewardList = curationArrTmp.reverse()
            console.log(vm.page.curationRewardList)
          })
          .catch(error => {
            console.log(error)
          })
        console.log('get reward done')
      },
      infiniteHandler: async function ($state) {
        if (this.page.midSelect === 'sticker' && this.page.subSelect === 'my') {
          if (!this.page.isLoading) {
            this.page.isLoading = true
            await this.getMyPost()
            $state.loaded()
          }
        } else if (this.page.midSelect === 'comment' && ['myComment', 'receivedComment'].indexOf(this.page.subSelect) > -1) {
          if (!this.page.isLoading) {
            this.page.isLoading = true
            await this.getComment()
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
        this.page.commentList = []
        this.page.lastPermlink = ''
        this.page.lastCommentPermlink = ''
        this.page.isLoading = false
      }
    }
  }
</script>
