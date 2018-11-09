<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout'
import MainLayout from './layouts/MainLayout'
import CenterLayout from './layouts/CenterLayout'
import AppLayout from './layouts/AppLayout'
import SimpleLayout from './layouts/SimpleLayout'
import ViewLayout from './layouts/ViewLayout'
import ListLayout from './layouts/ListLayout'
import CategoryLayout from './layouts/CategoryLayout'
import steem from '@/services/steem'

export default {
  components: {
    'default-layout': DefaultLayout,
    'main-layout': MainLayout,
    'view-layout': ViewLayout,
    'center-layout': CenterLayout,
    'app-layout': AppLayout,
    'simple-layout': SimpleLayout,
    'list-layout': ListLayout,
    'category-layout': CategoryLayout
  },
  data () {
    return {
      lastFollowerName: '',
      lastFollowingName: '',
      lastIgnoreName: '',
      onceForCall: 100
    }
  },
  head: {
    title: {
      inner: 'Steeck'
    },
    meta: [
      { property: 'og:title', content: 'Steeck' },
      { property: 'og:image', content: 'https://s3.ap-northeast-2.amazonaws.com/steeck/og/steeck_og.png' }
    ],
    link: [
      { rel: 'icon', href: 'https://s3.ap-northeast-2.amazonaws.com/steeck/fav/fav_64.png', sizes: '64x64', type: 'image/png' }
    ]
  },
  created () {
  },
  mounted () {
    this.updateFollowInfo()
    this.$store.dispatch('global/getProperties')
  },
  computed: {
    layout () {
      return this.$store.state.layout
    },
    username () {
      return this.$store.state.username
    }
  },
  watch: {
    username () {
      this.loadFollower()
    },
    lastFollowerName () {
      this.loadFollower()
    },
    lastFollowingName () {
      this.loadFollowing()
    },
    lastIgnoreName () {
      this.loadFollowingIgnore()
    }
  },
  methods: {
    updateFollowInfo: function () {
      this.$store.state.me.follower = []
      this.$store.state.me.following = []
      this.$store.state.me.ignore = []
      if (this.$store.state.me.account.name === null) {
        return
      }
      this.loadFollower()
      this.loadFollowing()
      this.loadFollowingIgnore()
      this.$store.dispatch('me/getFollowInfo').catch(err => {
        console.log(err)
      })
    },
    loadFollower: function () {
      steem.api.callAsync('get_followers', [this.$store.state.me.account.name, this.lastFollowerName, 'blog', this.onceForCall])
        .then(result => {
          let arrResult = this.getArrByArrKey(result, 'follower')
          if (this.$store.state.me.follower.length === 0) {
            this.$store.state.me.follower = arrResult
          } else {
            arrResult.shift()
            this.$store.state.me.follower = this.$store.state.me.follower.concat(arrResult)
          }
          if (arrResult.length > 0) {
            this.lastFollowerName = result[(result.length - 1)].follower
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadFollowing: function () {
      steem.api.callAsync('get_following', [this.$store.state.me.account.name, this.lastFollowingName, 'blog', this.onceForCall])
        .then(result => {
          let arrResult = this.getArrByArrKey(result, 'following')
          if (this.$store.state.me.following.length === 0) {
            this.$store.state.me.following = arrResult
          } else {
            arrResult.shift()
            this.$store.state.me.following = this.$store.state.me.following.concat(arrResult)
          }
          if (arrResult.length > 0) {
            this.lastFollowingName = result[(result.length - 1)].following
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadFollowingIgnore: function () {
      steem.api.callAsync('get_following', [this.$store.state.me.account.name, this.lastIgnoreName, 'ignore', this.onceForCall])
        .then(result => {
          let arrResult = this.getArrByArrKey(result, 'following')
          if (this.$store.state.me.ignore.length === 0) {
            this.$store.state.me.ignore = arrResult
          } else {
            arrResult.shift()
            this.$store.state.me.ignore = this.$store.state.me.ignore.concat(arrResult)
          }
          if (arrResult.length > 0) {
            this.lastIgnoreName = result[(result.length - 1)].following
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getArrByArrKey (arr, key) {
      let result = []
      arr.forEach(line => {
        if (line[key]) {
          result.push(line[key])
        }
      })
      return result
    }
  }
}
</script>

<style>
@media only screen and (min-width: 1904px) {
  .container {
    max-width: 1185px;
  }
}


.Markdown {
  /*font-family: 'Source Serif Pro', serif;*/
  /*font-size: 120%;*/
  /*line-height: 150%;*/
}
.Markdown table {
  width: 100% !important;
}
.Markdown table  tr{
  width: 100% !important;
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
  /*font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;*/
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
  max-width: 100% !important;
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
