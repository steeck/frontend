<template>
  <div>
    <v-menu bottom left transition="slide-y-transition">
      <v-btn slot="activator" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list class="card-more">
        <v-list-tile @click="copyLink()" :key="'cardMenu1'">
          <v-list-tile-title>게시글 주소 복사</v-list-tile-title>
        </v-list-tile>
        <div v-if="author !== $store.state.auth.username">
          <v-list-tile @click="unFollowingAction" :key="'cardMenu2'" v-if="isMyFollowing && isLogin">
            <v-list-tile-title>팔로우 취소</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="followingAction" :key="'cardMenu2'" v-else-if="isLogin">
            <v-list-tile-title>팔로우</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="dialog = true" :key="'cardMenu3'" v-if="isVoted && isLogin">
            <v-list-tile-title>다운보트</v-list-tile-title>
          </v-list-tile>
        </div>
        <v-list-tile :key="'cardMenu4'">
          <v-list-tile-title><a href="mailto:support@steeck.io" class="link">신고하기</a></v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="title">다운보트</v-card-title>
        <v-alert :value="downVoteFalse" type="error" transition="scale-transition">
          작업을 완료하지 못했습니다.
        </v-alert>
        <v-card-text>다운보트 안내말 다운보트 안내말 다운보트 안내말 다운보트 안내말 </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat @click.native="dialog = false" :disabled="downVoteDoing">취소</v-btn>
          <!--<v-btn color="grey darken-1" flat @click.native="downVoteFalse = !downVoteFalse">test</v-btn>-->
          <v-btn color="green darken-1" flat @click.native="downVote" :loading="downVoteDoing">다운보트</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import steemconnect from '@/services/steemconnect'

export default {
  name: 'cardMenu',
  props: {
    item: {
      require: true,
      type: Object
    }
  },
  data: function () {
    return {
      author: null,
      permlink: null,
      isVoted: false,
      dialog: false,
      downVoteDoing: false,
      downVoteFalse: false
    }
  },
  computed: {
    isLogin: function () {
      return this.$store.state.me.account.name !== null
    },
    // isMyFollwer: function () {
    //   return this.$store.state.me.follower.indexOf(this.author) > -1
    // },
    isMyFollowing: function () {
      return this.$store.state.me.following.indexOf(this.author) > -1
    }
  },
  mounted: function () {
    steemconnect.setAccessToken(this.$store.state.auth.accessToken)
    this.author = this.item.author
    this.permlink = this.item.permlink
    this.getVoted()
  },
  watch: {
    'item.active_votes': {
      handler: function (val, oldVal) {
        this.getVoted()
      },
      deep: true
    }
  },
  methods: {
    // report: function () {
    //   let subject = '[신고] : (제목을 넣어주세요)'
    //   let body = '게시글 링크 : ' + this.permlink
    //   let win = window.open('mailto:' + this.$store.state.manage.mail.report + '?subject=' + subject + '&body=' + body, 'report')
    //   win.close()
    // },
    followingAction: function () {
      if (!this.$store.state.auth.username) {
        alert('로그인 후 이용이 가능합니다')
        return
      }

      let vm = this
      this.$store.state.me.followDoing = true
      steemconnect.follow(this.$store.state.me.account.name, this.author, function (err, res) {
        console.log(err, res)
        if (!err) {
          vm.$store.commit('me/addFollowing', vm.author)
          vm.$store.dispatch('me/getFollowInfo').catch(err => {
            console.log(err)
          })
        }
        vm.$store.state.me.followDoing = false
      })
    },
    unFollowingAction: function () {
      if (!this.$store.state.auth.username) {
        alert('로그인 후 이용이 가능합니다')
        return
      }

      let vm = this
      this.$store.state.me.followDoing = true
      steemconnect.unfollow(this.$store.state.auth.username, this.author, function (err, res) {
        console.log(err, res)
        if (!err) {
          vm.$store.commit('me/removeFollowing', vm.author)
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
      if (this.item.active_votes) {
        this.item.active_votes.forEach(function (obj) {
          if (obj.voter === vm.$store.state.auth.username) {
            if (obj.percent > 0) {
              vm.isVoted = true
            }
            return true
          }
        })
      }
    },
    downVote: function () {
      if (!this.$store.state.auth.username) {
        alert('로그인 후 이용이 가능합니다')
        return
      }

      this.downVoteDoing = true
      let vote = {
        voter: this.$store.state.auth.username,
        author: this.item.author,
        permlink: this.item.permlink,
        weight: 0
      }
      let vm = this
      steemconnect.setAccessToken(this.$store.state.auth.accessToken)
      steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
        vm.downVoteDoing = false
        if (err) {
          vm.downVoteFalse = true
          console.log(err)
        }
        if (result) {
          vm.downVoteFalse = false
          let tmpVal = []
          vm.item.active_votes.forEach(function (obj) {
            if (obj.voter === vote.voter) {
              obj.percent = 0
            }
            tmpVal.push(obj)
          })
          vm.item.active_votes = tmpVal
          vm.dialog = false
        }
      })
    },
    copyLink: function () {
      const el = document.createElement('textarea')
      el.value = this.$store.state.app_host + '/posts/' + this.item.id
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      alert('주소가 복사되었습니다')
    }
  }
}
</script>

<style scoped>
.link {
  color: inherit;
  text-decoration: none;
}
</style>
