<template>
  <!--보상영역 스팀보상 스틱보상-->
  <v-container grid-list-xl v-else>
    <div class="my-profile text-xs-center" v-bind:style="[me.json_metadata.profile.profile_image ? { 'background-image': 'url(' + me.json_metadata.profile.profile_image + ')' } : {}]">
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
        <!-- <v-btn dark color="light-blue lighten-1">송금</v-btn> -->
        <v-btn color="error" v-if="$store.state.me.ignore.indexOf(username) === -1" @click="addIgnore" :loading="page.isFollowProcessing">차단</v-btn>
        <v-btn color="error" v-else @click="removeIgnore" :loading="page.isFollowProcessing">차단 해제</v-btn>
      </div>
    </div>

    <!--my 페이지 중앙 메뉴 -->
    <v-flex xs12 class="area-my-mid-menu">
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
        <v-flex key="'empty'" v-else>
          <v-flex v-if="!page.isLoading && page.list.length === 0" justify-center text-xs-center>
            글이 없습니다.
          </v-flex>
          <v-flex v-else justify-center text-xs-center>
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-flex>
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
            <v-flex d-inline-block class="item" :class="{'active' : page.subSelect === 'myComment'}" @click="setSubMenu('myComment')">작성한 댓글</v-flex>
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
        <v-flex key="'empty'" v-else>
          <v-flex v-if="!page.isLoading && page.commentList.length === 0" justify-center text-xs-center>
            글이 없습니다.
          </v-flex>
          <v-flex v-else justify-center text-xs-center>
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-flex>
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
        <v-list v-else-if="page.subSelect === 'steeckReward' && steecky.length" key="'steecktReward'">
          <v-data-table :items="steecky" class="elevation-5 table-steem-reward" hide-headers hide-actions>
            <template slot="items" slot-scope="props">
              <td class="reward-time">{{ props.item.created_at | ago }}</td>
              <td class="reward-title">{{ props.item.type | steeckyType }}</td>
              <td class="reward-detail">{{ props.item.point | number }} STEECKY</td>
            </template>
          </v-data-table>
          <infinite-loading @infinite="infiniteHandler" v-if="page.ableLoading && !page.isLoading"></infinite-loading>
          <v-flex xs12 justify-center text-xs-center v-if="page.ableLoading && page.isLoading">
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-list>
        <v-flex key="'reward-none'" v-else>
          <v-flex v-if="page.ableLoading && page.steemRewardList.length === 0" justify-center text-xs-center>
            조회된 정보가 없습니다.
          </v-flex>
          <v-flex v-else justify-center text-xs-center>
            <v-progress-circular indeterminate color="primary" class="mt-4"></v-progress-circular>
          </v-flex>
        </v-flex>
      </v-slide-y-transition>

      <!--지갑 관련 내용-->
      <v-slide-y-transition class="py-0" group tag="v-flex" v-if="page.midSelect === 'wallet'">
        <v-layout row wrap key="'wallet'" class="mt-3">
          <v-flex xs12 sm8>
            <table class="wallet-summary">
              <tbody>
                <tr>
                  <th>스틱 포인트</th>
                  <td>{{ steeckyPoint | number }} STEECKY <v-btn outline color="#6633ff">포인트 인출 (개발중)</v-btn></td>
                </tr>
                <tr>
                  <th>스팀</th>
                  <td>{{ me.vesting_balance }}</td>
                </tr>
                <tr>
                  <th>스팀파워</th>
                  <td>{{ mineSP }} SP ({{ (receivedSP - delegatedSP).toFixed(3) }} SP)</td>
                </tr>
                <tr>
                  <th>스팀달러</th>
                  <td>{{ me.sbd_balance }}</td>
                </tr>
                <tr>
                  <th>안전금고</th>
                  <td>{{ me.savings_balance }}, {{ me.savings_sbd_balance }}</td>
                </tr>
                <tr>
                  <th>추정 자산 가치</th>
                  <td>{{ getEstAccountValue() | kwn | number }} 원</td>
                </tr>
              </tbody>
            </table>
          </v-flex>
          <v-flex xs12 sm4>
            <div class="wallet-box">
              <div class="wallet-box__title">
                보상
              </div>
              <div class="wallet-box__body">
                <v-layout row wrap>
                  <v-flex xs6 class="title">
                    <span>스팀파워</span>
                  </v-flex>
                  <v-flex xs6 class="value">
                    <span>{{ getSP(me.reward_vesting_balance).toFixed(3) }} SP</span>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs6 class="title">
                    <span>스팀달러</span>
                  </v-flex>
                  <v-flex xs6 class="value">
                    <span>{{ me.reward_sbd_balance }}</span>
                  </v-flex>
                </v-layout>
                <v-btn
                  v-if="$store.state.auth.username === username"
                  block
                  outline
                  color="deep-purple"
                  class="wallet-box__btn"
                  :disabled="parseFloat(me.reward_vesting_balance) === 0"
                  :loading="loading.claim"
                  @click="claimReward()"
                >보상 요청</v-btn>
              </div>
            </div>

            <div class="wallet-box mt-3">
              <div class="wallet-box__title">
                거래소 시세정보
              </div>
              <div class="wallet-box__body">
                <div class="title">
                  스팀
                </div>
                <div class="title mt-2">
                  {{ cryptoPrice.steem.price | kwn | number }}원
                  <span class="trend" :class="{ 'trend-up': cryptoPrice.steem.direction == 'up' }">
                    ({{ cryptoPrice.steem.difference }}%)
                    <v-icon v-if="cryptoPrice.steem.direction == 'up'" class="trend-icon">arrow_drop_up</v-icon>
                    <v-icon v-else class="trend-icon">arrow_drop_down</v-icon>
                  </span>
                </div>
              </div>
              <div class="wallet-box__body">
                <div class="title">
                  스팀달러
                </div>
                <div class="title mt-2">
                  {{ cryptoPrice.sbd.price | kwn | number }}원
                  <span class="trend" :class="{ 'trend-up': cryptoPrice.sbd.direction == 'up' }">
                    ({{ cryptoPrice.sbd.difference }}%)
                    <v-icon v-if="cryptoPrice.steem.direction == 'up'" class="trend-icon">arrow_drop_up</v-icon>
                    <v-icon v-else class="trend-icon">arrow_drop_down</v-icon>
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3" style="color: #414d6b;">출처: cryptocompare.com</div>
          </v-flex>
        </v-layout>
      </v-slide-y-transition>

    </v-flex>
    <!--My 페이지 종료-->

  </v-container>
</template>

<script>
  import CardMy from '@/components/post/CardMy'
  import InfiniteLoading from 'vue-infinite-loading'
  import steem from '@/services/steem'
  import steemconnect from '@/services/steemconnect'
  import steemutil from '@/mixins/steemutil'
  import ProgressBar from '@/components/ui/ProgressBar'
  import api from '@/api/steecky'

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
      InfiniteLoading,
      ProgressBar
    },
    mixins: [steemutil],
    data () {
      return {
        username: '',
        me: {
          json_metadata: {
            profile: {
              profile_image: '',
              about: '',
              name: '',
              location: '',
              website: '',
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
        },
        rc: {},
        fund: {},
        weight: 100,
        cryptoPrice: {
          steem: {},
          sbd: {}
        },
        loading: {
          claim: false
        },
        steecky: []
      }
    },
    mounted () {
      this.username = this.name ? this.name : this.$route.params.username
      this.page.midSelect = this.$route.params.tab ? this.$route.params.tab : 'sticker'
      this.$nextTick(function () {
        this.getMe()
        this.getSteecky()
        this.getFollow()
        this.getRC()
        this.getRewardFund()
        this.getSteemPrice()
        this.getCryptoPrice()
      })
    },
    filters: {
      steeckyType: function (value) {
        if (value === 'daily') return '출석체크'
        else if (value === 'post') return '글쓰기'
        else if (value === 'comment') return '댓글'
        else if (value === 'vote') return '보팅'
        else return '기타'
      }
    },
    computed: {
      created () {
        return this.me.created ? this.me.created.substr(0, 10).replace(/-/g, '/') : ''
      },
      // sp () {
      //   return this.getSP(parseFloat(this.me.vesting_shares) + parseFloat(this.me.received_vesting_shares) - parseFloat(this.me.delegated_vesting_shares))
      // },
      mineSP () {
        return this.getSP(parseFloat(this.me.vesting_shares)).toFixed(3)
      },
      receivedSP () {
        return this.getSP(parseFloat(this.me.received_vesting_shares)).toFixed(3)
      },
      delegatedSP () {
        return this.getSP(parseFloat(this.me.delegated_vesting_shares)).toFixed(3)
      },
      vmana () {
        return (this.me.voting_power / 100).toFixed(2)
      },
      rcmana () {
        if (this.rc.rc_manabar) {
          return (this.rc.rc_manabar.current_mana / this.rc.max_rc * 100).toFixed(2)
        }
      },
      steemPrice () {
        return this.$store.getters.steemPrice
      },
      votingValue () {
        const sp = this.sp()
        const vp = this.me.voting_power
        const i = this.fund.rewardBalance / this.fund.recentClaims
        const a = this.$store.state.global.properties.fund / this.$store.state.global.properties.shares
        const r = sp / a
        const m = parseInt(((vp * 100 / 100) + 49) / 50)
        const l = parseInt(r * m * 100) * i * this.steemPrice
        return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
      },
      steeckyPoint () {
        let point = 0
        this.steecky.forEach(function (item) {
          point += item.point
        })
        return point
      }
    },
    watch: {
      '$route.params.tab': function () {
        this.page.midSelect = this.$route.params.tab
      },
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
      getSteecky: function () {
        let vm = this
        api.get(this.username)
          .then(res => {
            vm.steecky = res.data
          })
          .catch(err => {
            console.log(err)
          })
      },
      getMe: function () {
        let vm = this
        steem.api.callAsync('get_accounts', [[this.username]])
          .then(function (result) {
            if (result[0].json_metadata) {
              result[0].json_metadata = Object.assign(vm.me.json_metadata, JSON.parse(result[0].json_metadata))
            } else {
              result[0].json_metadata = vm.me.json_metadata
            }
            vm.me = result[0]
            vm.getMyPost()
          })
      },
      getFollow: function () {
        let vm = this
        steem.api.callAsync('get_follow_count', [this.username])
          .then(function (result) {
            vm.follow = result
          })
      },
      addFollowing: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.follow(this.$store.state.me.account.name, this.username, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.username)
            vm.$store.commit('me/removeIgnore', vm.username)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
            vm.getFollow()
          }
          vm.page.isFollowProcessing = false
        })
      },
      removeFollowing: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
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
      addIgnore: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.ignore(this.$store.state.me.account.name, this.username, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addIgnore', vm.username)
            vm.$store.commit('me/removeFollowing', vm.username)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
            vm.getFollow()
          }
          vm.page.isFollowProcessing = false
        })
      },
      removeIgnore: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.unfollow(this.$store.state.me.account.name, this.username, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeIgnore', vm.username)
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
      },
      getRC: function () {
        let vm = this
        steem.api.send('rc_api', { method: 'find_rc_accounts', params: { 'accounts': [this.username] } }, function (err, res) {
          if (err) {
            console.log(err)
            return
          }
          vm.rc = res.rc_accounts[0]
        })
      },
      getRewardFund: function () {
        let vm = this
        steem.api.getRewardFund('post', function (err, res) {
          if (err) {}
          vm.fund.recentClaims = res.recent_claims
          vm.fund.rewardBalance = parseFloat(res.reward_balance)
        })
      },
      getSteemPrice: function () {
        let vm = this
        steem.api.getCurrentMedianHistoryPrice(function (err, result) {
          if (err) {}
          // vm.steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
          const steemPrice = result.base.replace(' SBD', '') / result.quote.replace(' STEEM', '')
          vm.$store.commit('setSteemPrice', steemPrice)
        })
      },
      getVoteValue: function () {
        const sp = this.sp
        const vp = this.me.voting_power
        const i = this.fund.rewardBalance / this.fund.recentClaims
        const a = this.$store.state.global.properties.fund / this.$store.state.global.properties.shares
        const r = sp / a
        const m = parseInt(((vp * 100 / 100) + 49) / 50)
        const l = parseInt(r * m * 100) * i * this.steemPrice
        return isNaN(l) ? '(계산 중...)' : l.toFixed(2)
      },
      getEstAccountValue: function () {
        return this.calculateEstAccountValue(this.me, this.cryptoPrice.steem.price, this.cryptoPrice.sbd.price)
      },
      getCryptoPrice: function () {
        let vm = this
        fetch('https://min-api.cryptocompare.com/data/histoday?fsym=STEEM&tsym=USD&limit=1')
          .then(res => {
            return res.text()
          })
          .then(html => {
            const json = JSON.parse(html)
            const diff = (1 - (json.Data[0].close / json.Data[0].open)) * 100
            vm.cryptoPrice.steem = {
              price: json.Data[0].close.toFixed(2),
              difference: Math.abs(diff).toFixed(2),
              direction: diff > 0 ? 'down' : 'up'
            }
          })
        fetch('https://min-api.cryptocompare.com/data/histoday?fsym=SBD*&tsym=USD&limit=1')
          .then(res => {
            return res.text()
          })
          .then(html => {
            const json = JSON.parse(html)
            const diff = (1 - (json.Data[0].close / json.Data[0].open)) * 100
            vm.cryptoPrice.sbd = {
              price: json.Data[0].close.toFixed(2),
              difference: Math.abs(diff).toFixed(2),
              direction: diff > 0 ? 'down' : 'up'
            }
          })
      },
      claimReward: function () {
        let vm = this
        vm.loading.claim = true
        steemconnect.claimRewardBalance(this.$store.state.auth.username, this.me.reward_steem_balance, this.me.reward_sbd_balance, this.me.reward_vesting_balance, function (err, res) {
          vm.loading.claim = false
          if (err) {

          } else {
            // console.log(res)
            vm.getMe()
          }
        })
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../colorset";
  .my-profile {
    border: 0.5px solid #c3c3c3;
    padding-top: 15px;
    padding-bottom: 20px;
    background-position: center;
    background-size: cover;

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
    // .reward-time {
    //   min-width: 8rem;
    // }
    // .reward-title {
    //   min-width: 10rem;
    // }
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

  .wallet-summary {
    width: 100%;
    border: 1px solid #c3c3c3;
    border-spacing: 0;

    th {
      font-size: 18px;
      font-weight: 600;
      text-align: left;
      color: #414d6b;
    }
    td {
      font-size: 16px;
      font-weight: 600;
      text-align: right;
      color: #989898;
    }
    th, td {
      padding: 10px 20px;
    }
    tr:not(:last-child) {
      th, td {
        border-bottom: 1px solid #c3c3c3;
      }
    }
  }

  .wallet-box {
    border-radius: 2px;
    border: 1px solid #c3c3c3;

    .wallet-box__title {
      font-size: 18px;
      font-weight: 500;
      color: #414d6b;
      opacity: .8;
      background-color: #f6f6f6;
      padding: 10px 15px;
    }
    .wallet-box__body {
      padding: 30px 15px;

      .title {
        font-size: 20px;
        font-weight: 500;
        color: #414d6b;
      }
      .value {
        font-size: 18px;
        font-weight: 500;
        text-align: right;
        color: #989898;
      }
    }
    .wallet-box__body + .wallet-box__body {
      border-top: 1px solid #c3c3c3;
    }
    .wallet-box__btn {
      border-radius: 2px;
      border: solid 1.5px #6633ff;
      color: #6633ff !important;
      height: 50px;
      font-size: 18px;
      font-weight: bold;
    }
    .trend {
      font-size: 12px;
      font-weight: 400;
      color: #3fc2ff;
    }
    .trend-up {
      color: #ff5a5a !important;
    }
    .trend-icon {
      font-size: 20px;
      line-height: 12px;
      color: inherit;
    }
  }
</style>
