<template>
  <v-card flat class="card">
    <v-card-actions>
      <v-avatar color="grey lighten-4">
        <img :src="'https://steemitimages.com/u/' + item.author + '/avatar'" alt="avatar">
      </v-avatar>
      <div class="ml-3">
        <div class="card-author">{{ item.author }}</div>
        <div class="card-created">{{ item.created | convdate | ago }}</div>
      </div>
      <v-btn outline round color="deep-purple" class="ml-3" v-if="!isMyFollowing" :loading="isFollowProcessing" @click="addFollowing">+팔로우</v-btn>
      <v-btn dark round color="deep-purple" class="ml-3" v-else :loading="isFollowProcessing" @click="removeFollowing">팔로잉중</v-btn>
      <v-spacer></v-spacer>
      <card-menu :item="item"></card-menu>
    </v-card-actions>
    <v-card-title primary-title class="card-title" @click="jumpToPost">
      {{ item.title }}
    </v-card-title>
    <v-card-text v-if="jsonMetadata && jsonMetadata.image.length > 0">
      <v-carousel hide-delimiters>
        <v-carousel-item v-for="(image, i) in jsonMetadata.image" :key="i" :src="image">
        </v-carousel-item>
      </v-carousel>
    </v-card-text>
    <v-card-actions>
      <div class="block-cus_icon" @click="openVote">
        <v-icon color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
        <v-icon :color="isVoted ? 'rgb(255,255,255)' : 'primary'" v-text="'keyboard_arrow_up'"></v-icon>
      </div>
      ${{ getPayoutValue }}
      {{ item.children }}개
    </v-card-actions>
    <v-slide-y-transition class="py-0" tag="v-flex" v-if="dialog">
      <vote :item="item" :close="closeVote" :complete="completeVote"></vote>
    </v-slide-y-transition>
  </v-card>
</template>


<script>
import CardMenu from '@/components/post/Menu'
import Vote from '@/components/post/Vote'
import steemconnect from '@/services/steemconnect'

export default {
  props: ['item'],
  components: {
    'card-menu': CardMenu,
    Vote
  },
  data () {
    return {
      dialog: false, // open vote status
      isVoted: false,
      jsonMetadata: {
        image: []
      },
      isFollowProcessing: false
    }
  },
  computed: {
    getPayoutValue: function () {
      return parseFloat(this.item.pending_payout_value.replace(' SBD', '')).toFixed(2)
    },
    isMyFollowing: function () {
      if (!this.$store.state.me.account.name) {
        return false
      }
      return this.$store.state.me.following.indexOf(this.item.author) > -1
    }
  },
  watch: {
    'item.active_votes': {
      handler: function (val, oldVal) {
        this.isVoted = this.getVoted()
      },
      deep: true
    }
  },
  methods: {
    getVoted: function () {
      let vm = this
      let voted = false
      this.item.active_votes.forEach(function (obj) {
        if (obj.voter === vm.$store.state.me.account.name) {
          if (obj.percent > 0) {
            voted = true
          }
          return false
        }
      })
      return voted
    },
    openVote: function () {
      this.dialog = this.isVoted ? false : !this.dialog
    },
    closeVote: function () {
      this.dialog = false
    },
    completeVote: function () {
      // this.item.active_votes.push({voter: this.$store.state.me.account.name, percent: percent})
      this.isVoted = true
      this.dialog = false
    },
    addFollowing: function () {
      if (this.$store.state.me.account.name === null) {
        return
      }
      steemconnect.setAccessToken(this.$store.state.auth.accessToken)
      this.isFollowProcessing = true
      let vm = this
      steemconnect.follow(this.$store.state.me.account.name, this.item.author, function (err, res) {
        if (!err) {
          vm.$store.commit('me/addFollowing', vm.item.author)
          vm.$store.dispatch('me/getFollowInfo').catch(err => {
            console.log(err)
          })
          vm.getFollow()
        }
        vm.isFollowProcessing = false
      })
    },
    removeFollowing: function () {
      if (this.$store.state.me.account.name === null) {
        return
      }
      steemconnect.setAccessToken(this.$store.state.auth.accessToken)
      this.isFollowProcessing = true
      let vm = this
      steemconnect.unfollow(this.$store.state.me.account.name, this.item.author, function (err, res) {
        console.log(err, res)
        if (!err) {
          vm.$store.commit('me/removeFollowing', vm.item.author)
          vm.$store.dispatch('me/getFollowInfo').catch(err => {
            console.log(err)
          })
        }
        vm.isFollowProcessing = false
      })
    },
    jumpToPost: function () {
      let url = '/' + this.item.category + '/' + this.item.author + '/' + this.item.permlink
      this.$router.push(url)
    }
  },
  mounted () {
    this.isVoted = this.getVoted()
    if (this.item.json_metadata) {
      this.jsonMetadata = Object.assign(this.jsonMetadata, JSON.parse(this.item.json_metadata))
    }
  }
}
</script>


<style scoped>
  >>>.v-slider__track, >>>.v-slider__track-fill, >>>.v-slider__track__container {
    height: 8px;
  }
  >>>.v-messages {
    display: none;
  }
  >>>.v-card__title, >>>.v-card__text {
    padding: 8px;
  }
  .card {
    padding: 20px 30px;
    border: 1px solid #d1d1d1;
    margin-bottom: 20px;
  }
  .card-author {
    font-size: 1.2rem;
    font-weight: 600;
    color: #425363;
  }
  .card-created {
    font-size: .9rem;
    color: #9ba2ac;
  }
  .card-more >>>.v-list__tile.v-list__tile--link {
    font-size: .9rem;
    font-weight: 600;
    color: #425363;
    padding: 6px 20px;
    height: auto;
  }
  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #425363;
    cursor: pointer;
  }
  .vote-dialog {
    background-color: white;
    padding: 2rem;
  }
  .vote-text1 {
    font-size: 1.1rem;
    color: #aeaeae;
  }
  .vote-text2 {
    font-size: 1.4rem;
    color: #425363;
    font-weight: 600;
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
</style>
