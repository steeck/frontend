<template>
  <div>
    <v-menu bottom left transition="slide-y-transition">
      <v-btn slot="activator" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list class="card-more">
        <v-list-tile @click="" :key="'cardMenu1'">
          <v-list-tile-title>게시글 주소 복사</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="unFollowingAction" :key="'cardMenu2'" v-if="isMyfollowing">
          <v-list-tile-title>팔로우 취소</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="followingAction" :key="'cardMenu2'" v-else>
          <v-list-tile-title>팔로우</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="" :key="'cardMenu3'">
          <v-list-tile-title>다운보트</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="report" :key="'cardMenu4'">
          <v-list-tile-title>신고하기</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="test" :key="'cardMenu5'">
          <v-list-tile-title>TEST</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import steemconnect from '@/services/steemconnect'

  export default {
    name: 'cardMenu',
    props: {
      author: {
        require: true,
        type: String
      },
      permlink: {
        require: true,
        type: String
      }
    },
    data: function () {
      return {
        msg: 'hi'
      }
    },
    computed: {
      isLogin: function () {
        return this.$store.state.username !== null
      },
      isMyFollwer: function () {
        return this.$store.state.follower.indexOf(this.author) > -1
      },
      isMyfollowing: function () {
        return this.$store.state.following.indexOf(this.author) > -1
      }
    },
    methods: {
      test: function () {
        console.log(this.$store.state.account)
      },
      report: function () {
        let subject = '[신고] : (제목을 넣어주세요)'
        let body = '게시글 링크 : ' + this.permlink
        let win = window.open('mailto:' + this.$store.state.manage.mail.report + '?subject=' + subject + '&body=' + body, 'report')
        win.close()
      },
      followingAction: function () {
        steemconnect.follow(this.$store.state.username, this.author, function (err, res) {
          console.log(err, res)
        })
      },
      unFollowingAction: function () {
        steemconnect.unfollow(this.$store.state.username, this.author, function (err, res) {
          console.log(err, res)
        })
      }
    },
    mounted: function () {
      // console.log('init menu')
      // console.log(this.isLogin)
      // console.log(this.author + ' / ' + this.permlink)
      steemconnect.setAccessToken(this.$store.state.auth.accessToken)
    }
  }
</script>

<style scoped>

</style>
