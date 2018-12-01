<template>
  <div class="mb-5">
    <v-layout row wrap style="border: 1px solid #e5e5e5;">
      <v-flex xs12 class="cc-top">
        <!--상단 유저 관련 내용 및 메뉴 -->
        <v-layout row wrap align-center px-2 py-2>
          <v-avatar color="grey lighten-4" size="40">
            <v-img :src="'https://steemitimages.com/u/' + item.author + '/avatar'" alt="avatar"></v-img>
          </v-avatar>
          <div class="ml-3">
            <div class="card-author">
              <router-link :to="{ name: 'User', params: { username: item.author } }" target="_user" class="link">{{ item.author }} <span title='평판'>({{ reputationCount }})</span></router-link>
            </div>
            <div class="card-created caption">{{ item.created_at | ago }} · {{ category }}</div>
          </div>
          <div v-if="item.author !== $store.state.auth.username">
            <v-btn outline round color="deep-purple" class="ml-3" v-if="!isMyFollowing" :loading="isFollowProcessing" @click="addFollowing">+팔로우</v-btn>
            <v-btn dark round color="deep-purple" class="ml-3" v-else :loading="isFollowProcessing" @click="removeFollowing">팔로잉중</v-btn>
          </div>
          <v-spacer></v-spacer>
          <card-menu :item="item"></card-menu>
        </v-layout>
      </v-flex>
      <!--로딩 전 상태 -->
      <v-flex v-if="!loadingComplete" :style="'height:500px;'">
        <v-layout fill-height align-center justify-center>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-layout>
      </v-flex>
      <!--로딩 후 상태 -->
      <!--포스트 영역 -->
      <v-flex pa-0 xs12 class="cc-post"
        v-if="loadingComplete"
      >
        <div style="position: relative;">
          <v-btn small fab dark right absolute
            v-if="cardIndex+1 !== (content.data.contents.length)"
            class="ccp-arrow-btn"
            @click="next()"
          >
            <v-icon dark size="35">chevron_right</v-icon>
          </v-btn>
          <v-btn small fab dark left absolute
            v-if="cardIndex !== 0"
            class="ccp-arrow-btn"
            @click="prev()"
          >
            <v-icon dark size="35">chevron_left</v-icon>
          </v-btn>

          <v-carousel
            hide-controls
            :cycle="false"
            height="fit-content"
            class="elevation-0"
            v-model="cardIndex" ref="carousel"
          >
            <v-carousel-item v-for="(card, i) in content.data.contents" :key="(i+1)">
              <v-flex xs12 pa-0 style="position: relative;" @click="isHide = !isHide">
                <iframe v-if="card.youtube" class="youtube" width="100%" height="600px" :src="card.youtube + '?enablejsapi=1'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <ui-image v-else :src="card.url"></ui-image>
                <div v-if="i === 0" class="card-firstpage px-4 py-3">
                  <v-layout row wrap>
                    <v-flex xs10 class="text-xs-left">
                      <h3>{{ content.data.title }}</h3>
                    </v-flex>
                    <v-flex xs2
                      v-if="false"
                      class="text-xs-right"
                      style="padding-bottom: 0;"
                    >
                      <v-icon v-if="bookmark" @click="removeBookmark()">bookmark</v-icon>
                      <v-icon v-else @click="addBookmark()">bookmark_border</v-icon>
                    </v-flex>
                  </v-layout>
                  <v-layout align-center row v-if="false">
                    <div class="ml-3">
                      <v-avatar
                        :size="40"
                        color="white"
                      >
                        <v-img :src="'https://steemitimages.com/u/' + content.data.author + '/avatar'"></v-img>
                      </v-avatar>
                    </div>
                    <div class="ml-3">
                      <div @click="jumpToUserPage" class="author">
                        {{ content.data.author }} <span title='평판'>({{ reputationCount }})</span>
                      </div>
                      <div class="created">
                        {{ item.created_at | ago }} · {{ category }}
                      </div>
                    </div>
                    <div class="ml-3">
                      <v-btn
                        v-if="!isMyFollowing"
                        :loading="isFollowProcessing"
                        outline round color="white"
                        @click="addFollowing"
                      >+팔로우</v-btn>
                      <v-btn
                        v-else
                        :loading="isFollowProcessing"
                        light round color="white"
                        @click="removeFollowing"
                      >팔로잉중</v-btn>
                    </div>
                  </v-layout>
                </div>
                <div v-else-if="card.url === 'last'" class="card-lastpage text-xs-center">
                  <div class="my-profile text-xs-center">
                    <div v-if="$vuetify.breakpoint.smAndUp">
                      <v-avatar size="80" color="grey lighten-4">
                        <img :src="'https://steemitimages.com/u/' + content.data.author + '/avatar'" alt="avatar">
                      </v-avatar>
                      <div class="my-me-name">{{ content.data.author }} <span title='평판'>({{ reputationCount }})</span></div>
                      <div class="my-me-about">
                        {{ author.json_metadata.profile.about }}
                      </div>
                      <v-layout align-center justify-center row class="text-xs-center">
                        <v-flex xs3 md2>
                          <div class="my-me-follow-count">{{ follow.follower_count }}</div>
                          <div class="my-me-follow-text">팔로워</div>
                        </v-flex>
                        <v-flex xs3 md2>
                          <div class="my-me-follow-count">{{ follow.following_count }}</div>
                          <div class="my-me-follow-text">팔로잉</div>
                        </v-flex>
                      </v-layout>
                      <div class="my-me-created">가입일 {{ created }}</div>
                      <div class="my-me-link">
                        <a :href="author.json_metadata.profile.website" target="website">{{ author.json_metadata.profile.website }}</a>
                      </div>
                      <div v-if="$store.state.auth.username !== author.name" class="mt-2">
                        <v-btn dark color="deep-purple" v-if="$store.state.me.following.indexOf(author.name) === -1" @click="addFollowing" :loading="page.isFollowProcessing">팔로우</v-btn>
                        <v-btn dark color="deep-purple" v-else @click="removeFollowing"  :loading="page.isFollowProcessing">팔로우 취소</v-btn>
                        <!-- <v-btn dark color="#6644ff lighten-1">송금</v-btn> -->
                        <v-btn color="error" v-if="$store.state.me.ignore.indexOf(author.name) === -1" @click="addIgnore" :loading="page.isFollowProcessing">차단</v-btn>
                        <v-btn color="error" v-else @click="removeIgnore" :loading="page.isFollowProcessing">차단 해제</v-btn>
                      </div>
                    </div>
                    <div>
                      <div class="related mt-5">
                        <img src="https://s3.ap-northeast-2.amazonaws.com/steeck/icons/btn-symbol@2x.png" style="width: 16px;"> 에디터의 다른 스티커 보기
                      </div>
                      <div v-if="randoms.length > 0" class="related mt-2 text-xs-left">
                        <router-link
                          :to="{ name: 'View', params: { id: randoms[0].id } }"
                          class="link"
                        >이전 스티커 | <span class="related-title">{{ randoms[0].title }}</span></router-link>
                      </div>
                      <div v-if="randoms.length > 1" class="related mt-2 text-xs-left">
                        <router-link
                          :to="{ name: 'View', params: { id: randoms[1].id } }"
                          class="link"
                        >다음 스티커 | <span class="related-title">{{ randoms[1].title }}</span></router-link>
                      </div>
                      <div v-if="randoms.length > 2" class="related mt-2 text-xs-left">
                        <router-link
                          :to="{ name: 'View', params: { id: randoms[2].id } }"
                          class="link"
                        >인기 스티커 | <span class="related-title">{{ randoms[2].title }}</span></router-link>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="card-text">
                  <span v-if="!isHide">{{ card.text }}</span>
                </div>
              </v-flex>
            </v-carousel-item>
          </v-carousel>
        </div>

        <div class="ma-2 area-tag text-xs-left">
          <v-chip
            v-if="tag !== 'steeck'"
            outline class="tag" v-for="(tag, i) in content.data.json_metadata.tags" :key="'tag-' + i"
          >
            <router-link :to="{ name: 'Search', params: { q: tag } }" class="link"><span class="blue-grey--text text--darken-4">#{{ tag }}</span></router-link>
          </v-chip>
        </div>
      </v-flex>

      <!-- <vote v-if="dialog" :item="content.steem" :close="closeVote" :complete="completeVote"></vote> -->
      <!--코멘트영역-->
      <v-flex
        v-if="loadingComplete"
        xs12 class="cc-comment"
      >
        <v-layout justify-space-between wrap row fill-height>
          <v-flex xs10>
            <v-layout row wrap pa-3 xs12>
              <vote :item="content.steem" :content="content.data" :complete="completeVote"></vote>
              <div class="ml-1 mr-2 btn-link">{{ payouts | kwn | number }}원</div> |
              <a class="mx-2 btn-link" @click="viewVotes = !viewVotes">보팅 {{ content.steem.active_votes.length }}</a> |
              <a class="mx-2 btn-link" @click="showComment = !showComment"
              >댓글 {{ commentList.length }}</a>
              <!-- <comment class="mx-2 btn-link" :item="content.steem" :list="commentList" :complete="completeComment"></comment> -->
            </v-layout>
          </v-flex>
          <v-flex xs2 class="text-xs-right">
            <v-icon v-if="bookmark" color="#6644ff" @click="removeBookmark()">bookmark</v-icon>
            <v-icon v-else color="#6644ff" @click="addBookmark()">bookmark_border</v-icon>
          </v-flex>
          <v-flex xs12 v-if="showComment">
            <comment :show="showComment" :item="content.steem" :list="commentList" :complete="completeComment" @child-event="showComment = !showComment"></comment>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <!--in modal-->
    <v-dialog v-model="viewVotes" max-width="320">
      <v-toolbar color="#6644ff" dark class="vote-list">
        <v-layout row class="text-xs-center">
          <v-flex xs6 d-inline-block>유저명</v-flex>
          <v-flex xs3 d-inline-block>보팅파워</v-flex>
          <v-flex xs3 d-inline-block>보팅시간</v-flex>
        </v-layout>
      </v-toolbar>
      <v-list v-for="vote in content.steem.active_votes" :key="vote.voter" class="px-1">
        <v-layout row class="text-xs-center">
          <v-flex xs6 d-inline-block tag="a" v-text="vote.voter" @click="openToUserPage(vote.voter)"></v-flex>
          <v-flex xs3 d-inline-block v-text="(vote.percent / 100) + '%'"></v-flex>
          <v-flex xs3 d-inline-block>{{ vote.time | convdate | ago }}</v-flex>
        </v-layout>
      </v-list>
    </v-dialog>

  </div>
</template>

<script>
  import api from '@/api/posts'
  import steem from '@/services/steem'
  import steemconnect from '@/services/steemconnect'
  import Card from '@/components/post/Card'
  import Vote from '@/components/post/Vote'
  import Comment from '@/components/post/Comment'
  import CardMenu from '@/components/post/Menu'
  import EditComment from '@/components/post/EditComment'
  import CardComment from '@/components/post/CardComment'
  import Remarkable from 'remarkable'
  import UiImage from '@/components/ui/UiImage'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'ContentCard',
    props: ['item'],
    components: {
      Vote,
      Comment,
      CardMenu,
      CardComment,
      EditComment,
      Card,
      UiImage
    },
    data: function () {
      return {
        isHide: false,
        loadingComplete: false,
        content: {
          data: {
            contents: []
          },
          steem: {
            author_reputation: 0,
            active_votes: []
          }
        },
        jsonMetadata: {
          tags: []
        },
        isVoted: false,
        viewVotes: false,
        dialog: false,
        showComment: false,
        commentList: [],
        editComment: {
          openEdit: false
        },
        list: [],
        cardIndex: 0,
        author: {
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
          isFollowProcessing: false
        },
        bookmark: false,
        randoms: []
      }
    },
    created: function () {
    },
    mounted () {
      this.getContent()
      this.getBookmark()
      this.getRandom()
    },
    computed: {
      id: function () {
        return this.item.id
      },
      markedBody: function () {
        return this.content.steem.body ? md.render(this.content.steem.body) : ''
      },
      reputationCount: function () {
        return steem.formatter.reputation(this.content.steem.author_reputation)
      },
      isMyFollowing: function () {
        if (!this.$store.state.auth.username) {
          return false
        }
        return this.$store.state.me.following.indexOf(this.content.data.author) > -1
      },
      isFollowProcessing: function () {
        return this.$store.state.me.followDoing
      },
      category () {
        return this.$store.state.terms.categories[this.content.data.category]
      },
      width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '100%'
          default: return this.content.data.layout.width
        }
      },
      height () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'initial'
          case 'sm': return 'initial'
          default: return this.content.data.layout.height
        }
      },
      widthType () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 'type-v'
          case 'sm': return 'type-v'
          default: return 'type-h'
        }
      },
      created () {
        return this.author.created ? this.author.created.substr(0, 10).replace(/-/g, '/') : ''
      },
      payouts () {
        if (parseFloat(this.content.steem.total_payout_value)) {
          return parseFloat(this.content.steem.total_payout_value) + parseFloat(this.content.steem.curator_payout_value)
        } else {
          return parseFloat(this.content.steem.pending_payout_value)
        }
      }
    },
    watch: {
      'content.steem.active_votes': {
        handler: function (val, oldVal) {
          this.getVoted()
        },
        deep: true
      },
      'id': {
        handler: function (val, oldVal) {
          this.content.data.id = null
          this.getContent()
        },
        deep: true
      },
      'cardIndex': function () {
        // console.log(this.content.data.contents[this.cardIndex].url)
        // console.log(this.cardIndex, (this.content.data.contents.length + 2))
      }
    },
    methods: {
      next: function () {
        this.$refs.carousel.next()
        // console.log(this.$el.querySelector('.youtube'))
        if (this.$el.querySelector('.youtube')) {
          this.$el.querySelector('.youtube').contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
        }
      },
      prev: function () {
        this.$refs.carousel.prev()
        // console.log(this.$el.querySelector('.youtube'))
        if (this.$el.querySelector('.youtube')) {
          this.$el.querySelector('.youtube').contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
        }
      },
      markedCardBody: function (str) {
        return str ? md.render(str) : ''
      },
      getContent: function () {
        let vm = this
        api.get(this.id)
          .then(res => {
            vm.content = res.data
            vm.content.data.contents.push({url: 'last'})
            // console.log('content', vm.content)
            this.getAccount()
            this.getFollow()
            this.loadComment()
            vm.loadingComplete = true
          })
      },
      getVoted: function () {
        if (!this.$store.state.auth.username) {
          return
        }

        let vm = this
        this.isVoted = false
        if (this.content.steem) {
          this.content.steem.active_votes.forEach(function (obj) {
            if (obj.voter === vm.$store.state.auth.username) {
              if (obj.percent > 0) {
                vm.isVoted = true
              }
              return true
            }
          })
        }
      },
      addFollowing: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }

        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.page.isFollowProcessing = true
        let vm = this
        steemconnect.follow(this.$store.state.auth.username, vm.content.data.author, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.content.data.author)
            vm.$store.commit('me/removeIgnore', vm.content.data.author)
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
        steemconnect.unfollow(this.$store.state.auth.username, vm.content.data.author, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeFollowing', vm.content.data.author)
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
        steemconnect.ignore(this.$store.state.auth.username, vm.content.data.author, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addIgnore', vm.content.data.author)
            vm.$store.commit('me/removeFollowing', vm.content.data.author)
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
        steemconnect.unfollow(this.$store.state.auth.username, vm.content.data.author, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeIgnore', vm.content.data.author)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
            vm.getFollow()
          }
          vm.page.isFollowProcessing = false
        })
      },
      jumpToUserPage: function () {
        this.$router.push('/user/' + this.content.data.author)
      },
      openToUserPage: function (user) {
        window.open('/user/' + user)
      },
      openVote: function () {
        this.dialog = this.isVoted ? false : !this.dialog
      },
      closeVote: function () {
        this.dialog = false
      },
      completeVote: function () {
        this.isVoted = true
        this.dialog = false
      },
      loadComment: function () {
        steem.api.getContentRepliesAsync(this.content.data.author, this.content.data.permlink)
          .then((res) => {
            this.commentList = res
            // console.log(res)
          })
      },
      completeComment: function () {
        this.loadComment()
      },
      getAccount: function () {
        let vm = this
        steem.api.getAccounts([this.content.data.author], function (err, res) {
          if (err) {}
          if (res[0].json_metadata) {
            res[0].json_metadata = Object.assign(vm.author.json_metadata, JSON.parse(res[0].json_metadata))
          } else {
            res[0].json_metadata = vm.author.json_metadata
          }
          vm.author = res[0]
        })
      },
      getFollow: function () {
        let vm = this
        steem.api.callAsync('get_follow_count', [this.content.data.author])
          .then(function (result) {
            vm.follow = result
          })
      },
      getBookmark: function () {
        if (!this.$store.state.auth.username) {
          return
        }
        let vm = this
        api.getBookmark(this.$store.state.auth.username, this.id)
          .then(res => {
            if (res.data.length) {
              vm.bookmark = true
            }
          })
      },
      addBookmark: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        let vm = this
        api.addBookmark({username: this.$store.state.auth.username, post_id: this.content.data.id})
          .then(res => {
            vm.bookmark = true
          })
      },
      removeBookmark: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        let vm = this
        api.removeBookmark({username: this.$store.state.auth.username, post_id: this.content.data.id})
          .then(res => {
            vm.bookmark = false
          })
      },
      getRandom: function () {
        let vm = this
        api.getRandom()
          .then(res => {
            vm.randoms = res.data
          })
      }
    }
  }
</script>

<style scoped>
  .v-carousel {
    display: flex;
    flex-direction: column;
  }
  >>>.v-carousel__controls {
    order: 2;
    position: relative;
    height: 20px;
    background-color: transparent;
  }
  >>>.v-carousel__controls .v-carousel__controls__item {
    width: 14px;
    height: 14px;
    color: #aaa;
    margin: 0 !important;
  }
  >>>.v-carousel__controls .v-carousel__controls__item.v-btn--active {
    color: #6633ff;
  }
  >>>.v-carousel__controls .v-carousel__controls__item .v-icon {
    font-size: 10px !important;
  }
  .v-carousel .v-window__container {
    order: 1;
  }
  .area-content-card.wide {
    max-width: 700px;
  }

  .c-all {
    border: 1px solid #e5e5e5;
    overflow: hidden;
  }

  .cc-top .link {
    font-weight: bold;
    color: #333333;
  }

  .card-author {
    text-align: left;
  }
  .cc-top .card-created {
    color: gray;
    text-align: left;
  }

  .link {
    text-decoration: none;
    color: inherit;
  }

  .cc-top {
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    /*background-color: red;*/
  }

  .cc-post {
    /*background-color: black;*/
    /*color: white;*/
    position: relative;
  }

  .ccp-arrow-btn {
    top: calc(50% - 20px);
    background-color: rgb(0,0,0);
    opacity: 0.5;
  }
  .ccp-carousel .none-img {
    height: 0 !important;
  }

  .cc-comment {
    outline: 1px solid#e5e5e5;
    z-index: 1;
  }

  .area-comment {
    /*max-height: 400px;*/
    overflow-x: hidden;
    overflow-y: auto;
  }
  .area-comment .relative {
    max-height: 500px;
  }
  .card-text {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    z-index: 2;
    color: white;
    text-align: left;
    background: rgba(0,0,0,.4);
  }
  .border-bottom {
    border-bottom: 1px solid #e5e5e5;
  }
  .btn-link {
    color: #425363 !important;
    font-weight: 600;
  }
  .tag {
    color: #425363 !important;
    font-size: 10px;
    border-color: #6633ff !important;
  }
  .card-firstpage {
    position: absolute;
    bottom: 10px;
    width: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, .4);
  }
  .card-lastpage {
    position: absolute;
    width: 100%;
    color: #fff;
    top: 0;
    height: 100%;
    padding-top: 15%;
    background-color: rgba(0,0,0,.4);
  }
  .my-profile .my-me-name {
    font-size: 1.8rem;
    font-weight: 600;
  }
  .my-profile .my-me-about {
    font-size: .9rem;
  }
  .my-profile .my-me-follow-count {
    font-size: 1.5rem;
    font-weight: 600;
  }
  .my-profile .my-me-follow-text {
  }
  .my-profile .my-me-created {
  }
  .my-profile .my-me-link a {
    color: #fff;;
  }
  @media only screen and (max-width: 959px) {
    .card-lastpage {
      padding-top: 20%;
    }
  }
  .author {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .created {
    font-size: .9rem;
    color: #989898;
  }
  .text {
    font-size: 1.1rem;
  }
  .pre {
    white-space: pre-line;
  }
  .related {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
    margin: 0 auto;
  }
  .related-title {
    font-weight: 400;
  }

  .vote-list >>>.v-toolbar__content {
    padding: 0;
  }
  .youtube {
    background-color: #000;
    padding-top: 15%;
    padding-bottom: 15%;
  }
  @media only screen and (max-width: 600px) {
    .youtube {
      height: 100vw;
    }
  }
</style>
