<template>
  <!--보상영역 스팀보상 스틱보상-->
  <v-container grid-list-xl v-else>
    <div class="my-profile text-xs-center">
      <v-avatar size="80" color="grey lighten-4">
        <img :src="'https://steemitimages.com/u/' + username + '/avatar'" alt="avatar">
      </v-avatar>
      <div class="my-me-name">{{ username }}</div>
      <div class="my-me-about">
        {{ me.json_metadata.profile.about }}
      </div>
      <v-layout align-center justify-center row class="text-xs-center">
        <v-flex xs2 md1>
          <div class="my-me-follow-count">{{ follow.follower_count }}</div>
          <div class="my-me-follow-text">팔로워</div>
        </v-flex>
        <v-flex xs2 md1>
          <div class="my-me-follow-count">{{ follow.following_count }}</div>
          <div class="my-me-follow-text">팔로잉</div>
        </v-flex>
      </v-layout>
      <div class="my-me-created">가입일 {{ created }}</div>
      <div class="my-me-link">
        <a :href="me.json_metadata.profile.website" target="website">{{ me.json_metadata.profile.website }}</a>
      </div>
      <div v-if="username !== $store.state.me.account.name">
        <v-btn dark color="deep-purple" v-if="$store.state.me.following.indexOf(username) === -1" @click="addFollowing" :loading="page.isFollowProcessing">팔로우</v-btn>
        <v-btn dark color="deep-purple" v-else @click="removeFollowing"  :loading="page.isFollowProcessing">팔로우 취소</v-btn>
        <v-btn dark color="light-blue lighten-1">송금</v-btn>
        <v-btn color="error">차단</v-btn>
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
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading && !page.isLoading"></infinite-loading>
          <v-flex xs12 justify-center text-xs-center v-if="page.ableLoading && page.isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
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
          <v-flex xs12 justify-center text-xs-center v-if="page.ableLoading && page.isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-list>
        <v-flex key="'empty'" v-else>글이 없습니다.</v-flex>
      </v-slide-y-transition>

      <!--보상 관련 내용-->
      <v-slide-y-transition class="py-0" group tag="v-flex" v-if="page.midSelect === 'reward'">
        <!--스팀보상 스틱보상 선택 -->
        <v-flex sm12 justify-center class="area-submenu"  transition="slide-y-transition" key="'reward'">
          <v-flex text-xs-left>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'steemReward'}" @click="setSubMenu('steemReward')">STEEM 보상</v-flex>
            <v-flex d-inline-block class="item-separator">|</v-flex>
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'steeckReward'}" @click="setSubMenu('steeckReward')">STEECK 보상</v-flex>
          </v-flex>
        </v-flex>

        <v-list v-if="page.subSelect === 'steemReward' && page.steemRewardList.length > 0" key="'reward-curationReward'">
          <v-data-table :items="page.steemRewardList" class="elevation-5 table-steem-reward" hide-headers hide-actions>
            <template slot="items" slot-scope="props">
              <td class="reward-time">{{ props.item[1].timestamp | convdate | ago }}</td>
              <td class="reward-title">{{ props.item[1].op[0] === 'curation_reward' ? '큐레이션 보상' : '저자 보상' }}</td>
              <td v-if="props.item[1].op[0] === 'curation_reward'" class="reward-detail">
                <span>{{ sp(props.item[1].op[1].reward) }} STEEM POWER</span>
                <span class="tc-import">for {{ props.item[1].op[1].comment_author}} / {{ props.item[1].op[1].comment_permlink}}</span>
              </td>
              <td v-else-if="props.item[1].op[0] === 'author_reward'" class="reward-detail">
                <span>{{ props.item[1].op[1].sbd_payout }} and {{ sp(props.item[1].op[1].vesting_payout) }} STEEM POWER</span>
                <span class="tc-import">for {{ props.item[1].op[1].author}} / {{ props.item[1].op[1].permlink}}</span>
              </td>
            </template>
          </v-data-table>
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading && !page.isLoading"></infinite-loading>
          <v-flex xs12 justify-center text-xs-center v-if="page.ableLoading && page.isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-list>
        <v-list v-else key="reward-none">
          <v-flex>조회된 정보가 없습니다.</v-flex>
        </v-list>

      </v-slide-y-transition>

    </div>
    <!--My 페이지 종료-->

  </v-container>
</template>

<script>
  import CardMy from '@/components/post/CardMy'
  import InfiniteLoading from 'vue-infinite-loading'
  import steem from '@/services/steem'
  import steemutil from '@/mixins/steemutil'
  import steemconnect from '@/services/steemconnect'

  export default {
    name: 'UserView',
    props: {
      name: {
        default: '',
        type: String
      }
    },
    components: {
      'card-my': CardMy,
      InfiniteLoading
    },
    data () {
      return {
        username: '',
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
          subSelect: 'my', // able : {sticker : ['my','bookmark'], comment : ['myComment', 'receivedComment'], reward: ['steemReward', 'steeckReward']}
          list: [], // post arr
          commentList: [], // comment arr
          steemRewardList: [],
          steemRewardLoadingCount: 30,
          loadingForOnce: 5,
          ableLoading: false, // 로딩 가능한지 확인하는 변수
          lastPermlink: '', // sticker post 조회시 조회된 마지막 게시글
          lastAuthor: '', // sticker post 조회시 조회된 마지막 유저이름
          lastCommentPermlink: '',
          lastCommentAuthor: '',
          isLoading: false, // 인피니티 로딩 구동 토글 변수
          reward: {
            lastId: -1
          },
          isFollowProcessing: false // 팔로잉 추가제거 (유저정보창, 자신이 다른유저를 볼떄 사용) 상태 값
        }
      }
    },
    mixins: [steemutil],
    computed: {
      created: function () {
        return this.me.created ? this.me.created.substr(0, 10).replace(/-/g, '/') : ''
      }
    },
    watch: {
      '$route.params.username': function () {
        this.username = this.$route.params.username
        this.resetPageContent()
        this.$nextTick(function () {
          this.getMe()
          this.getFollow()
        })
      },
      'page.midSelect': function () {
        this.resetPageContent()
        if (this.page.midSelect === 'sticker') {
          this.page.subSelect = 'my'
        } else if (this.page.midSelect === 'comment') {
          this.page.subSelect = 'myComment'
        } else if (this.page.midSelect === 'reward') {
          this.page.subSelect = 'steemReward'
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
          if (this.page.subSelect === 'steemReward') {
            this.loadingSteemReward()
          } else if (this.page.subSelect === 'steeckReward') {
            console.log('TODO steeckReward loading')
          }
        }
      }
    },
    methods: {
      getMe: function () {
        let vm = this
        console.log('check steem api: ', steem)
        steem.api
          .callAsync('get_accounts', [[this.username]])
          .then(function (result) {
            result[0].json_metadata = Object.assign(vm.me.json_metadata, JSON.parse(result[0].json_metadata))
            vm.me = result[0]
            vm.getMyPost()
          })
      },
      getFollow: function () {
        let vm = this
        steem.api
          .callAsync('get_follow_count', [this.username])
          .then(function (result) {
            vm.follow = result
          })
      },
      addFollowing: function () {
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.follow(this.$store.state.me.account.name, this.username, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.username)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
            vm.getFollow()
          }
          vm.page.isFollowProcessing = false
        })
      },
      removeFollowing: function () {
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.unfollow(this.$store.state.me.account.name, this.username, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeFollowing', vm.username)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
            vm.getFollow()
          }
          vm.page.isFollowProcessing = false
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
        // let author = 'clayop'
        let author = this.username
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
            if (this.page.list.length > 0) {
              result.shift()
              this.page.list = this.page.list.concat(result)
            } else {
              this.page.list = result
            }
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
        // let author = 'clayop'
        let author = this.username
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
          await steem.api.getDiscussionsByCommentsAsync(query)
            .then(result => {
              let resultLength = result.length
              if (vm.page.commentList.length > 0) {
                result.shift()
                vm.page.commentList = vm.page.commentList.concat(result)
              } else {
                vm.page.commentList = result
              }
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
          try {
            steem.api.getRepliesByLastUpdate(query.start_author, query.start_permlink, this.page.loadingForOnce, (error, result) => {
              if (error) {
                console.log(error)
              }
              if (result) {
                let resultLength = result.length
                if (vm.page.commentList.length > 0) {
                  result.shift()
                  vm.page.commentList = vm.page.commentList.concat(result)
                } else {
                  vm.page.commentList = result
                }
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
      loadingSteemReward: function () {
        console.log('get author and curation reward')
        let vm = this
        let allowed = ['curation_reward', 'author_reward']
        steem.api.getAccountHistory(this.me.name, vm.page.reward.lastId, this.page.steemRewardLoadingCount, function (err, result) {
          if (err) {
            vm.page.ableLoading = false
            return
          }
          vm.page.reward.lastId = result[0][0] - 1
          if (vm.page.reward.lastId < vm.page.steemRewardLoadingCount) {
            vm.page.steemRewardLoadingCount = vm.page.reward.lastId
            vm.page.ableLoading = false
          }
          result = result.filter(item => {
            return item[1] && allowed.indexOf(item[1].op[0]) !== -1
          })
          vm.page.steemRewardList = vm.page.steemRewardList.concat(result.slice().reverse())
          vm.$nextTick(() => {
            vm.page.isLoading = false
          })
        })
      },
      sp: function (vests) {
        return (this.getSP(vests)).toFixed(3)
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
        } else if (this.page.midSelect === 'reward' && this.page.subSelect === 'steemReward') {
          if (!this.page.isLoading) {
            this.page.isLoading = true
            await this.loadingSteemReward()
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
        this.page.steemRewardList = []
        this.page.lastPermlink = ''
        this.page.lastCommentPermlink = ''
        this.page.reward.lastId = -1
        this.page.isLoading = false
        this.page.ableLoading = true
        this.page.steemRewardLoadingCount = 30
      }
    },
    mounted () {
      this.username = this.name ? this.name : this.$route.params.username
      this.$nextTick(function () {
        this.getMe()
        this.getFollow()
      })
    }
  }
</script>


<style lang="scss" scoped>
  @import "../colorset";
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


  /* 스팀 보상 테이블 */
  .table-steem-reward {
    .reward-time {
      min-width: 8rem;
    }
    .reward-title {
      min-width: 10rem;
    }
    .tc-import {
      color: $colorForce;
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

