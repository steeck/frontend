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
import steem from '@/services/steem'

export default {
  components: {
    'default-layout': DefaultLayout,
    'main-layout': MainLayout,
    'view-layout': ViewLayout,
    'center-layout': CenterLayout,
    'app-layout': AppLayout,
    'simple-layout': SimpleLayout
  },
  data () {
    return {
      lastFollowerName: '',
      lastFollowingName: '',
      onceForCall: 100
    }
  },
  head: {
    title: {
      inner: 'Steeck'
    }
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
    }
  },
  methods: {
    updateFollowInfo: function () {
      this.$store.state.me.follower = []
      this.$store.state.me.following = []
      if (this.$store.state.me.account.name === null) {
        return
      }
      this.loadFollower()
      this.loadFollowing()
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
</style>
