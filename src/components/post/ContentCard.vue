<template>
  <v-container pa-0 mb-5 wrap class="area-content-card" :class="{ 'wide': viewWide, 'relative': !viewWide }"
  style="height: calc(100vh - 44px);">
    <v-layout row wrap class="c-all">
      <v-flex xs12 class="cc-top">
        <!--상단 유저 관련 내용 및 메뉴 -->
        <v-layout row wrap align-center px-2 py-2>
          <v-avatar color="grey lighten-4" size="40">
            <v-img :src="'https://steemitimages.com/u/' + item.author + '/avatar'" alt="avatar"></v-img>
          </v-avatar>
          <div class="ml-3">
            <div class="card-author">
              <router-link
                :tag="'a'" :to="{ name: 'User', params: { username: item.author } }" target="_blank" class="link"
              >{{ item.author }}</router-link>
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
        :class="{'md12' : viewWide, 'md7' : !viewWide}"
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
            hide-delimiters hide-controls :cycle="false" height="fit-content"
            class="elevation-0"
            v-model="cardIndex" ref="carousel"
          >
            <v-carousel-item v-for="(card, i) in content.data.contents" :key="(i+1)">
              <v-flex xs12 pa-0 style="position: relative;">
                <ui-image :src="card.url"></ui-image>
                <div class="card-text">
                  {{ card.text }}
                </div>
                <!-- <v-img :src="card.url ? card.url : ''" max-height="500"></v-img> -->
              </v-flex>
            </v-carousel-item>
          </v-carousel>
        </div>
        <v-tabs
          v-if="false"
          show-arrows centered hide-slider dark
          color="white"
          class="ccp-post"
          v-model="cardIndex"
        >
          <v-tab
            v-for="(card, i) in content.data.contents" :key="(i)"
            active-class="active"
            v-show="false"
            ripple
            tag="span"
          >
            <v-icon pa-0 ma-0 size="10">fiber_manual_record</v-icon>
          </v-tab>
          <v-tab-item
            v-for="(card, i) in content.data.contents" :key="(i)"
            :style="'padding-bottom: 2.5rem;'"
          >
            <v-flex xs12 v-html="markedCardBody(card.text)" class="ccpc-html Markdown"></v-flex>
          </v-tab-item>
        </v-tabs>

        <div class="ma-2 area-tag">
          <v-chip outline class="tag" v-for="(tag, i) in content.data.json_metadata.tags" :key="'tag-' + i"><span class="blue-grey--text text--darken-4">#{{ tag }}</span></v-chip>
        </div>
      </v-flex>

      <!--코멘트영역-->
      <v-flex xs12 sm12 class="cc-comment"
        v-if="loadingComplete && false"
        :class="{'md12' : viewWide, 'md5' : !viewWide}"
      >
        <v-layout justify-space-between column fill-height>
          <v-flex xs12>
            <v-layout row wrap pa-3 xs12 class="border-bottom">
              <div class="block-cus_icon" @click="openVote" :style="'position:relative;'">
                <v-icon size="20" color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
                <v-icon
                  size="20"
                  color="isVoted ? 'rgb(255,255,255)' : 'primary'"
                  :style="'position:absolute; left:0; top:0;'"
                  v-text="'keyboard_arrow_up'"
                ></v-icon>
              </div>
              <div class="ml-1 mr-2 btn-link">{{ parseFloat(content.steem.pending_payout_value).toFixed(2) | kwn | number }}원</div>
              | <a class="mx-2 btn-link" @click="viewVotes = !viewVotes">{{ content.steem.active_votes.length }}보팅</a>
              | <a class="mx-2 btn-link" @click="editComment.openEdit = true">댓글달기</a>
            </v-layout>
            <v-layout row wrap pa-3 xs12>
              <div class="border-bottom"></div>
              <!--보트 컴포넌트-->
              <v-slide-y-transition class="py-0" tag="div">
                <vote v-if="dialog" :item="content.steem" :close="closeVote" :complete="completeVote"></vote>
              </v-slide-y-transition>
              <!--코멘트 컴포넌트-->
              <v-slide-y-transition class="py-0" tag="div">
                <edit-comment v-if="editComment.openEdit" :item="content.steem" :condition="editComment" :complete="completeComment"></edit-comment>
              </v-slide-y-transition>
              <!--달린 코멘트-->
              <v-flex xs12 class="area-comment" :style="'overflow-y:auto;'" :class="{'wide' : viewWide, 'relative' : !viewWide}">
                <card-comment v-for="(list, index) in comment.list" :item="list" :key="'c_' + index" :completeComment="completeComment"></card-comment>
              </v-flex>
            </v-layout>
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
  import UiImage from '@/components/ui/UiImage'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'ContentCard',
    props: ['item', 'viewWide'],
    components: {
      Vote,
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
        comment: {
          list: []
        },
        editComment: {
          openEdit: false
        },
        list: [],
        cardIndex: 0
      }
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
        console.log(this.$vuetify.breakpoint.name)
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
            // console.log('content', vm.content)
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
            vm.loadingComplete = true
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
    },
    created: function () {
    },
    mounted () {
      this.getContent()
    }
  }
</script>

<style lang="scss" scoped>

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
  .ccp-carousel {
    &.none-img {
      height: 0 !important;
    }
  }

  .cc-comment {
    outline: 1px solid#e5e5e5;
    z-index: 1;
  }

  .area-comment {
    /*max-height: 400px;*/
    overflow-x: hidden;
    overflow-y: auto;

    &.relative {
      max-height: 500px;
    }
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


</style>
