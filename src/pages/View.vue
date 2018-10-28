<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <!--컨텐츠를 불러오기 전 로딩 상태 -->
      <v-flex xs-12 v-if="!content.data.id">
        <v-layout column>
          <v-progress-circular :size="70" :width="7" color="primary" indeterminate class="mt-5 mx-auto"></v-progress-circular>
        </v-layout>
      </v-flex>

      <v-flex xs12 lg8 v-else>
        <v-card
          :width="width"
          dark
          color="black"
          d-flex
        >
          <card-menu :item="content.steem" class="post-menu"></card-menu>
          <v-carousel
            hide-delimiters
            interval="9999999"
          >
            <v-carousel-item
              v-for="(card, i) in content.data.contents"
              :key="i"
            >
              <v-img
                contain
                :witdh="width"
                :height="height"
                :src="card.url ? card.url : ''"
              ></v-img>
              <div v-if="!i"
                class="px-4 py-3"
              >
                <v-layout row wrap>
                  <v-flex xs10>
                    <h2>{{ card.text }}</h2>
                  </v-flex>
                  <v-flex xs2
                    class="text-xs-right"
                  >
                    <v-icon>bookmark</v-icon>
                  </v-flex>
                </v-layout>
                <v-layout align-center row>
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
                      {{ content.data.created_at | convdate | ago }} · {{ category }}
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
              <div v-else
                class="px-4 py-3 text"
              >
                <pre class="pre">{{ card.text }}</pre>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-card>

        <div class="mt-2">
          <v-chip outline color="indigo" v-for="(tag, i) in content.data.json_metadata.tags" :key="'tag-' + i"><span class="blue-grey--text text--darken-4">#{{ tag }}</span></v-chip>
        </div>

        <v-layout
          row
          class="mt-2 mx-2 mb-3"
        >
          <div class="block-cus_icon" @click="openVote">
            <v-icon size="20" color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
            <v-icon size="20" :color="isVoted ? 'rgb(255,255,255)' : 'primary'" v-text="'keyboard_arrow_up'"></v-icon>
          </div>
          <div class="ml-1 mr-3">{{ parseFloat(content.steem.pending_payout_value).toFixed(2) | kwn | number }}원</div>
          <a @click="viewVotes = !viewVotes">{{ content.steem.active_votes.length }}보팅</a>
          <a class="d-inline-block px-2" @click="editComment.openEdit = true">댓글달기</a>
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
        </v-layout>

        <!--코멘트 컴포넌트-->
        <v-slide-y-transition class="py-0" tag="v-flex">
          <edit-comment v-if="editComment.openEdit" :item="content.steem" :condition="editComment" :complete="completeComment"></edit-comment>
        </v-slide-y-transition>
        <!--보트 컴포넌트-->
        <v-slide-y-transition class="py-0" tag="v-flex">
          <vote v-if="dialog" :item="content.steem" :close="closeVote" :complete="completeVote"></vote>
        </v-slide-y-transition>

        <div class="mt-5">
          <card-comment v-for="(list, index) in comment.list" :item="list" :key="'c_' + index" :completeComment="completeComment"></card-comment>
        </div>
      </v-flex>
      <v-flex xs12 lg4>
        <h3>연관 게시물</h3>
        <v-layout row wrap>
          <v-flex v-if="id != card.id" xs12 v-for="(card, i) in list" :key="list.id">
            <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
              <card :item="card"></card>
            </router-link>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import api from '@/api/posts'
  import steem from '@/services/steem'
  import steemconnect from '@/services/steemconnect'
  import Card from '@/components/post/Card'
  import Vote from '@/components/post/Vote'
  import CardMenu from '@/components/post/Menu'
  import EditComment from '@/components/post/EditComment'
  import CardComment from '@/components/post/CardComment'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    props: ['id'],
    components: {
      Vote,
      CardMenu,
      CardComment,
      EditComment,
      Card
    },
    data: function () {
      return {
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
        comment: {
          list: []
        },
        editComment: {
          openEdit: false
        },
        list: []
      }
    },
    computed: {
      markedBody: function () {
        return this.content.steem.body ? md.render(this.content.steem.body) : ''
      },
      reputationCount: function () {
        return steem.formatter.reputation(this.content.steem.author_reputation)
      },
      isMyFollowing: function () {
        if (!this.$store.state.me.account.name) {
          return false
        }
        return this.$store.state.me.following.indexOf(this.content.steem.author) > -1
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
      }
    },
    created: function () {
      // this.category = this.$route.params.category
      // this.author = this.$route.params.author
      // this.permlink = this.$route.params.permlink
      // console.log(this.category)
      // console.log(this.author)
      // console.log(this.permlink)
      //
      // steem.api.getContentAsync(this.author, this.permlink)
      //   .then(res => {
      //     if (res.id === 0) {
      //       console.log('not find content')
      //     }
      //     console.log(res)
      //     this.content = res
      //     this.jsonMetadata = JSON.parse(res.json_metadata)
      //     this.loadComment()
      //     console.log(this.jsonMetadata)
      //   })
    },
    mounted () {
      this.getContent()
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
      }
    },
    methods: {
      getContent: function () {
        let vm = this
        api.get(this.id)
          .then(res => {
            vm.content = res.data
            this.loadComment()
            this.getContents()
          })
      },
      getContents: function () {
        let data = {
          category: this.content.data.category
        }
        let vm = this
        api.getByCategory(data)
          .then(res => {
            vm.list = res.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      addFollowing: function () {
        if (this.$store.state.me.account.name === null) {
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.$store.state.me.followDoing = true
        let vm = this
        steemconnect.follow(this.$store.state.me.account.name, this.content.steem.author, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.content.steem.author)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
          }
          vm.$store.state.me.followDoing = false
        })
      },
      removeFollowing: function () {
        if (this.$store.state.me.account.name === null) {
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.$store.state.me.followDoing = true
        let vm = this
        steemconnect.unfollow(this.$store.state.me.account.name, this.content.steem.author, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeFollowing', vm.content.steem.author)
            vm.$store.dispatch('me/getFollowInfo').catch(err => {
              console.log(err)
            })
          }
          vm.$store.state.me.followDoing = false
        })
      },
      getVoted: function () {
        let vm = this
        this.isVoted = false
        if (this.content.steem) {
          this.content.steem.active_votes.forEach(function (obj) {
            if (obj.voter === vm.$store.state.me.account.name) {
              if (obj.percent > 0) {
                vm.isVoted = true
              }
              return true
            }
          })
        }
      },
      jumpToUserPage: function () {
        this.$router.push('/user/' + this.content.steem.author)
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
            this.comment.list = res
            // console.log(res)
          })
      },
      completeComment: function () {
        this.loadComment()
      }
    }
  }
</script>

<style scoped>
  >>>.v-carousel,
  >>>.v-carousel__item {
    height: 100%!important;
  }

  .link {
    text-decoration: none;
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


  .block-cus_icon {
    clear: both;
    position: relative;
    cursor: pointer;
  }

  .block-cus_icon i:nth-child(2) {
    position: absolute;
    left: 0;
    top: 0;
  }

  .area-post {
    padding-top: 1rem;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    /*margin-left: 1rem;*/
    /*margin-right: 1rem;*/

    a {
      text-decoration: none;
    }
  }

  .post-menu {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }

  .Markdown {
    font-family: 'Source Serif Pro', serif;
    font-size: 120%;
    line-height: 150%;
  }

  .Markdown, .ReplyEditor__body.rte {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    -webkit-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  .Markdown h1, .Markdown h2, .Markdown h3, .Markdown h4, .Markdown h5, .Markdown h6, .ReplyEditor__body.rte h1, .ReplyEditor__body.rte h2, .ReplyEditor__body.rte h3, .ReplyEditor__body.rte h4, .ReplyEditor__body.rte h5, .ReplyEditor__body.rte h6 {
    font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;
  }

  .Markdown h1, .ReplyEditor__body.rte h1 {
    margin: 2.5rem 0 .3rem;
    font-size: 160%;
  }

  .Markdown h2, .ReplyEditor__body.rte h2 {
    margin: 2.5rem 0 .3rem;
    font-size: 140%;
  }

  .Markdown h3, .ReplyEditor__body.rte h3 {
    margin: 2rem 0 0.3rem;
    font-size: 120%;
  }

  .Markdown h4, .ReplyEditor__body.rte h4 {
    margin: 1.5rem 0 0.2rem;
    font-size: 110%;
  }

  .Markdown h5, .ReplyEditor__body.rte h5 {
    margin: 1rem 0 0.2rem;
    font-size: 100%;
  }

  .Markdown h6, .ReplyEditor__body.rte h6 {
    margin: 1rem 0 0.2rem;
    font-size: 90%;
  }

  .Markdown code, .ReplyEditor__body.rte code {
    padding: 0.2rem;
    font-size: 85%;
    border-radius: 3px;
    border: none;
    background-color: #F4F4F4;
    font-weight: inherit;
    overflow: scroll;
  }

  .Markdown pre > code, .ReplyEditor__body.rte pre > code {
    display: block;
  }

  .Markdown strong, .ReplyEditor__body.rte strong {
    font-weight: 600;
  }

  .Markdown ol, .Markdown ul, .ReplyEditor__body.rte ol, .ReplyEditor__body.rte ul {
    margin-left: 2rem;
  }

  .Markdown table td, .ReplyEditor__body.rte table td {
    word-break: normal;
  }

  .Markdown p, .ReplyEditor__body.rte p {
    font-size: 100%;
    line-height: 150%;
    margin: 0 0 0.5rem 0;
  }

  .Markdown img, .ReplyEditor__body.rte img {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: none;
  }

  .Markdown iframe, .ReplyEditor__body.rte iframe {
    max-width: 100%;
    max-height: 75vw;
  }

  .Markdown div.pull-right, .ReplyEditor__body.rte div.pull-right {
    float: right;
    padding-left: 1rem;
    max-width: 50%;
  }

  .Markdown div.pull-left, .ReplyEditor__body.rte div.pull-left {
    float: left;
    padding-right: 1rem;
    max-width: 50%;
  }

  .Markdown div.text-justify, .ReplyEditor__body.rte div.text-justify {
    text-align: justify;
  }

  .Markdown div.text-right, .ReplyEditor__body.rte div.text-right {
    text-align: right;
  }

  .Markdown div.text-center, .ReplyEditor__body.rte div.text-center {
    text-align: center;
  }

  .Markdown div.text-rtl, .ReplyEditor__body.rte div.text-rtl {
    direction: rtl;
  }

  .Markdown div.videoWrapper, .ReplyEditor__body.rte div.videoWrapper {
    width: 100%;
    height: 0;
    padding-bottom: 56.2%;
    position: relative;
  }

  .Markdown div.videoWrapper iframe, .ReplyEditor__body.rte div.videoWrapper iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>
