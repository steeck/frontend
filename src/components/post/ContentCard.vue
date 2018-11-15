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
              <router-link :to="{ name: 'User', params: { username: item.author } }" target="_user" class="link">{{ item.author }}</router-link>
            </div>
            <div class="card-created caption">{{ item.created_at | convdate | ago }}</div>
          </div>
          <v-btn small outline round color="deep-purple" class="ml-3" v-if="!isMyFollowing" :loading="isFollowProcessing" @click="addFollowing">+팔로우</v-btn>
          <v-btn small dark round color="deep-purple" class="ml-3" v-else :loading="isFollowProcessing" @click="removeFollowing">팔로잉중</v-btn>
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
            @click="$refs.carousel.next()"
          >
            <v-icon dark size="35">chevron_right</v-icon>
          </v-btn>
          <v-btn small fab dark left absolute
            v-if="cardIndex !== 0"
            class="ccp-arrow-btn"
            @click="$refs.carousel.prev()"
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
              <v-flex xs12 pa-0 style="position: relative;">
                <ui-image :src="card.url"></ui-image>
                <div v-if="card.url === 'last'" class="card-lastpage text-xs-center">
                  <div class="my-profile text-xs-center">
                    <v-avatar size="80" color="grey lighten-4">
                      <img :src="'https://steemitimages.com/u/' + content.data.author + '/avatar'" alt="avatar">
                    </v-avatar>
                    <div class="my-me-name">{{ author.name }}</div>
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
                      <!-- <v-btn dark color="light-blue lighten-1">송금</v-btn> -->
                      <v-btn color="error" v-if="$store.state.me.ignore.indexOf(author.name) === -1" @click="addIgnore" :loading="page.isFollowProcessing">차단</v-btn>
                      <v-btn color="error" v-else @click="removeIgnore" :loading="page.isFollowProcessing">차단 해제</v-btn>
                    </div>
                  </div>
                </div>
                <div v-else class="card-text">
                  {{ card.text }}
                </div>
              </v-flex>
            </v-carousel-item>
          </v-carousel>
        </div>

        <div class="ma-2 area-tag">
          <v-chip
            v-if="tag !== 'steeck'"
            outline class="tag" v-for="(tag, i) in content.data.json_metadata.tags" :key="'tag-' + i"><span class="blue-grey--text text--darken-4">#{{ tag }}</span></v-chip>
        </div>
      </v-flex>

      <!-- <vote v-if="dialog" :item="content.steem" :close="closeVote" :complete="completeVote"></vote> -->
      <!--코멘트영역-->
      <v-flex
        v-if="loadingComplete"
        xs12 class="cc-comment"
      >
        <v-layout justify-space-between column fill-height>
          <v-flex xs12>
            <v-layout row wrap pa-3 xs12 class="border-bottom">
              <vote :item="content.steem" :complete="completeVote"></vote>
              <div class="ml-1 mr-2 btn-link">{{ parseFloat(content.steem.pending_payout_value).toFixed(2) | kwn | number }}원</div> |
              <a class="mx-2 btn-link" @click="viewVotes = !viewVotes">보팅 {{ content.steem.active_votes.length }}</a> |
              <a class="mx-2 btn-link" @click="showComment = !showComment"
              >댓글 {{ commentList.length }}</a>
              <!-- <comment class="mx-2 btn-link" :item="content.steem" :list="commentList" :complete="completeComment"></comment> -->
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="showComment">
            <comment :show="showComment" :item="content.steem" :list="commentList" :complete="completeComment" @child-event="showComment = !showComment"></comment>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <!--in modal-->
    <v-dialog v-model="viewVotes" max-width="290">
      <v-toolbar color="light-blue" dark class="text-xs-center">
        <v-flex xs6 d-inline-block>이름</v-flex>
        <v-flex xs3 d-inline-block>파워</v-flex>
        <v-flex xs3 d-inline-block>시간</v-flex>
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
        }
      }
    },
    created: function () {
    },
    mounted () {
      this.getContent()
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
        steemconnect.follow(this.$store.state.auth.username, this.author.name, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.author.name)
            vm.$store.commit('me/removeIgnore', vm.author.name)
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
        steemconnect.unfollow(this.$store.state.auth.username, this.author.name, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeFollowing', vm.author.name)
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
        steemconnect.ignore(this.$store.state.auth.username, this.author.name, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addIgnore', vm.author.name)
            vm.$store.commit('me/removeFollowing', vm.author.name)
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
        steemconnect.unfollow(this.$store.state.auth.username, this.author.name, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeIgnore', vm.author.name)
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
            console.log(res)
          })
      },
      completeComment: function () {
        this.loadComment()
      },
      getAccount: function () {
        let vm = this
        steem.api.getAccounts([this.content.data.author], function (err, res) {
          if (err) {}
          res[0].json_metadata = Object.assign(vm.author.json_metadata, JSON.parse(res[0].json_metadata))
          vm.author = res[0]
        })
      },
      getFollow: function () {
        let vm = this
        steem.api.callAsync('get_follow_count', [this.content.data.author])
          .then(function (result) {
            vm.follow = result
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

  .cc-top .card-created {
    color: gray;

  }

  .link {
    text-decoration: none;
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

  .card-lastpage {
    position: absolute;
    width: 100%;
    color: #fff;;
    top: 30%;
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
      top: 10%;
    }
  }


</style>
