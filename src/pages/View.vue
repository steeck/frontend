<template>
  <v-container grid-list-xl>
    <v-flex v-if="content.data.id">
      <content-card :item="content.data"></content-card>
    </v-flex>
    <!--<v-flex v-for="(item, i) in list" :key="i">-->
      <!--<list-card :item="item"></list-card>-->
    <!--</v-flex>-->
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
  import ContentCard from '@/components/post/ContentCard'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    props: ['id'],
    components: {
      Vote,
      CardMenu,
      CardComment,
      EditComment,
      ContentCard,
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
            // this.getContents()
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
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
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
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
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
        if (!this.$store.state.auth.username) {
          return
        }
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
