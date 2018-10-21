<template>
  <v-layout column>
    <!--컨텐츠를 불러오기 전 로딩 상태 -->
    <v-flex v-if="!content.id">
      <v-layout column>
        <v-progress-circular :size="70" :width="7" color="primary" indeterminate class="mt-5 mx-auto"></v-progress-circular>
        <v-flex class="mt-3 mx-auto" :tag="'h2'">컨텐츠를 불러오고 있습니다.</v-flex>
      </v-layout>
    </v-flex>
    <!--컨텐츠 로딩 후 -->
    <v-flex v-else>
      <!--제목 및 글쓴이 정보-->
      <v-flex xs10 offset-xs1 class="area-post-top">
        <v-flex class="my-3 text-xs-center headline">{{ content.title }}</v-flex>
        <v-flex class="mb-1">
          <v-avatar color="">
            <!--<img :src="'https://steemitimages.com/u/' + content.author + '/avatar'" alt="avatar">-->
            <v-img :src="'https://steemitimages.com/u/' + content.author + '/avatar'"></v-img>
          </v-avatar>
          <v-flex d-inline-block class="subheading" @click="jumpToUserPage" :tag="'a'">{{ content.author }}</v-flex>
          <v-flex d-inline-block :tag="'small'"><span title='평판'>({{ reputationCount }})</span></v-flex>
          <v-flex d-inline-block :tag="'small'">{{ content.created | convdate | ago }}</v-flex>
          <v-btn outline round color="deep-purple" class="ml-3" v-if="!isMyFollowing" :loading="isFollowProcessing"
                 @click="addFollowing">+팔로우
          </v-btn>
          <v-btn dark round color="deep-purple" class="ml-3" v-else :loading="isFollowProcessing"
                 @click="removeFollowing">팔로잉중
          </v-btn>
          <card-menu :item="content" class="post-menu"></card-menu>
        </v-flex>
      </v-flex>
      <!--컨텐츠 본문-->
      <v-flex xs10 offset-xs1 v-html="markedBody" class="area-post MarkdownViewer Markdown"></v-flex>
      <!--태그 표시-->
      <v-flex xs10 offset-xs1>
        <v-chip label v-for="(tag, index) in jsonMetadata.tags" :key="'tag-' + index"> {{ tag }} </v-chip>
      </v-flex>
      <!--하단 포스팅 사간 및 작성자 안내-->
      <v-flex xs10 offset-xs1 class="mt-2">
        <v-layout row justify-start>
          <div><v-icon size="20">access_time</v-icon></div>
          <div class="mr-1">{{ content.created | convdate | ago }}</div>
          <div class="mr-1"> by </div>
          <div> {{ content.author }} </div>
        </v-layout>
      </v-flex>
      <!--보팅 관련-->
      <v-flex xs10 offset-xs1 class="mt-2">
        <v-layout row justify-start>
          <div class="block-cus_icon" @click="openVote">
            <v-icon size="20" color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
            <v-icon size="20" :color="isVoted ? 'rgb(255,255,255)' : 'primary'" v-text="'keyboard_arrow_up'"></v-icon>
          </div>
          <div class="mr-3">${{ parseFloat(content.pending_payout_value.replace(' SBD', '')).toFixed(2) }}</div>
          <v-flex tag="a" d-inline-block @click="viewVotes = !viewVotes">{{ content.active_votes.length }}보팅</v-flex>
          <v-dialog v-model="viewVotes" max-width="290">
            <v-toolbar color="light-blue" dark class="text-xs-center">
              <v-flex xs6 d-inline-block>이름</v-flex>
              <v-flex xs3 d-inline-block>파워</v-flex>
              <v-flex xs3 d-inline-block>시간</v-flex>
            </v-toolbar>
            <v-list v-for="vote in content.active_votes" :key="vote.voter" class="px-1">
              <v-layout row class="text-xs-center">
                <v-flex xs6 d-inline-block tag="a" v-text="vote.voter" @click="openToUserPage(vote.voter)"></v-flex>
                <v-flex xs3 d-inline-block v-text="(vote.percent / 100) + '%'"></v-flex>
                <v-flex xs3 d-inline-block>{{ vote.time | convdate | ago }}</v-flex>
              </v-layout>
            </v-list>
          </v-dialog>
        </v-layout>
        <v-slide-y-transition class="py-0" tag="v-flex" v-if="dialog">
          <vote :item="content" :close="closeVote" :complete="completeVote"></vote>
        </v-slide-y-transition>
      </v-flex>
    </v-flex>

    <!--코멘트 영역-->
    <v-flex xs10 offset-xs1 class="mt-2">
        <card-comment v-for="(list, index) in comment.list" :item="list" :key="'c_' + index"></card-comment>
    </v-flex>

  </v-layout>


</template>

<script>
  /**
   * @property {String} pending_payout_value : 글의 보상
   * @property {String} author_reputation : 글작성자의 명성
   * @property {Function} getContentRepliesAsync : 해당 포스트 및 댓글의 리플을 로딩
   */

  import steem from '@/services/steem'
  import steemconnect from '@/services/steemconnect'
  import Vote from '@/components/post/Vote'
  import CardMenu from '@/components/post/Menu'
  import CardComment from '@/components/post/CardComment'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'Post',
    components: {
      Vote,
      CardMenu,
      CardComment
    },
    data: function () {
      return {
        category: '',
        author: '',
        permlink: '',
        content: {},
        jsonMetadata: {
          tags: []
        },
        isVoted: false,
        viewVotes: false,
        dialog: false,
        comment: {
          list: []
        }
      }
    },
    computed: {
      markedBody: function () {
        return this.content.body ? md.render(this.content.body) : ''
      },
      reputationCount: function () {
        return steem.formatter.reputation(this.content.author_reputation)
      },
      isMyFollowing: function () {
        if (!this.$store.state.me.account.name) {
          return false
        }
        return this.$store.state.me.following.indexOf(this.content.author) > -1
      },
      isFollowProcessing: function () {
        return this.$store.state.me.followDoing
      }
    },
    watch: {
      'content.active_votes': {
        handler: function (val, oldVal) {
          this.getVoted()
        },
        deep: true
      }
    },
    methods: {
      addFollowing: function () {
        if (this.$store.state.me.account.name === null) {
          return
        }
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        this.$store.state.me.followDoing = true
        let vm = this
        steemconnect.follow(this.$store.state.me.account.name, this.content.author, function (err, res) {
          if (!err) {
            vm.$store.commit('me/addFollowing', vm.content.author)
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
        steemconnect.unfollow(this.$store.state.me.account.name, this.content.author, function (err, res) {
          console.log(err, res)
          if (!err) {
            vm.$store.commit('me/removeFollowing', vm.content.author)
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
        this.content.active_votes.forEach(function (obj) {
          if (obj.voter === vm.$store.state.me.account.name) {
            if (obj.percent > 0) {
              vm.isVoted = true
            }
            return true
          }
        })
      },
      jumpToUserPage: function () {
        this.$router.push('/user/' + this.content.author)
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
        steem.api.getContentRepliesAsync(this.content.author, this.content.permlink)
          .then((res) => {
            this.comment.list = res
            console.log(res)
          })
      }
    },
    created: function () {
      this.category = this.$route.params.category
      this.author = this.$route.params.author
      this.permlink = this.$route.params.permlink
      console.log(this.category)
      console.log(this.author)
      console.log(this.permlink)

      steem.api.getContentAsync(this.author, this.permlink)
        .then(res => {
          if (res.id === 0) {
            console.log('not find content')
          }
          console.log(res)
          this.content = res
          this.jsonMetadata = JSON.parse(res.json_metadata)
          this.loadComment()
          console.log(this.jsonMetadata)
        })
    }
  }
</script>

<style lang="scss">

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
    float: right;
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
