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
import steem from '@/services/steem'

export default {
  components: {
    'default-layout': DefaultLayout,
    'main-layout': MainLayout,
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
  created () {
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
      this.$store.state.follower = []
      this.$store.state.following = []
      if (this.$store.state.username === null) {
        return
      }
      this.loadFollower()
      this.loadFollowing()
    },
    loadFollower: function () {
      steem.api.callAsync('get_followers', [this.$store.state.username, this.lastFollowerName, 'blog', this.onceForCall])
        .then(result => {
          let arrResult = this.getArrByArrKey(result, 'follower')
          if (this.$store.state.follower.length === 0) {
            this.$store.state.follower = arrResult
          } else {
            arrResult.shift()
            this.$store.state.follower = this.$store.state.follower.concat(arrResult)
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
      steem.api.callAsync('get_following', [this.$store.state.username, this.lastFollowingName, 'blog', this.onceForCall])
        .then(result => {
          let arrResult = this.getArrByArrKey(result, 'following')
          if (this.$store.state.following.length === 0) {
            this.$store.state.following = arrResult
          } else {
            arrResult.shift()
            this.$store.state.following = this.$store.state.following.concat(arrResult)
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
  },
  mounted () {
    this.updateFollowInfo()
  }
}
</script>
