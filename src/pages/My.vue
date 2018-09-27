<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      <v-avatar
        size="80"
        color="grey lighten-4"
      >
        <img :src="me.json_metadata.profile.profile_image" alt="avatar">
      </v-avatar>
      <div class="my-me-name">
        {{ me.name }}
      </div>
      <div class="my-me-about">
        {{ me.json_metadata.profile.about }}
      </div>
      <v-layout
        align-center
        justify-center
        row
        class="text-xs-center"
      >
        <v-flex xs2 md1>
          <div class="my-me-follow-count">
            {{ follow.follower_count }}
          </div>
          <div class="my-me-follow-text">
            팔로워
          </div>
        </v-flex>
        <v-flex xs2 md1>
          <div class="my-me-follow-count">
            {{ follow.following_count }}
          </div>
          <div class="my-me-follow-text">
            팔로잉
          </div>
        </v-flex>
      </v-layout>
      <div class="my-me-created">
        가입일 {{ me.created }}
      </div>
      <div class="my-me-link">
        <a :href="me.json_metadata.profile.website" target="website">{{ me.json_metadata.profile.website }}</a>
      </div>
      <div>
        <v-btn
          dark
          color="deep-purple"
        >
          팔로우
        </v-btn>
        <v-btn
          dark
          color="light-blue lighten-1"
        >
          송금
        </v-btn>
        <v-btn
          color="error"
        >
          차단
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.my-profile {
  border: 0.5px solid #c3c3c3;
  padding-top: 15px;
  padding-bottom: 20px;
}
.my-me-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #425363;
}
.my-me-about {
  font-size: .9rem;
  color: #989898;
}
.my-me-follow-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #425363;
}
.my-me-follow-text {
  color: #425363;
}
.my-me-created {
  color: #425363;
}
.my-me-link a {
  color: #425363;
}
</style>

<script>
export default {
  data () {
    return {
      me: {
        json_metadata: {
          profile: {
            profile_image: 'https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png',
            about: 'Update about me',
            name: '',
            location: '',
            website: 'https://about.steeck.io',
            cover_image: ''
          }
        }
      },
      follow: {}
    }
  },
  components: {
  },
  mounted () {
    this.$nextTick(function () {
      this.me.json_metadata.profile.name = this.$store.state.steemconnect.user.user
      this.getMe()
      this.getFollow()
    })
  },
  methods: {
    getMe: function () {
      let vm = this
      this.$client.database
        .call('get_accounts', [[this.$store.state.steemconnect.user.user]])
        // .call('get_accounts', [['ura-soul']])
        .then(function (result) {
          result[0].json_metadata = Object.assign(vm.me.json_metadata, JSON.parse(result[0].json_metadata))
          vm.me = result[0]
          vm.me.created = vm.me.created.substr(0, 10).replace(/-/g, '/')
        })
    },
    getFollow: function () {
      let vm = this
      this.$client.database
        .call('get_follow_count', [this.$store.state.steemconnect.user.user])
        // .call('get_follow_count', ['ura-soul'])
        .then(function (result) {
          vm.follow = result
        })
    }
  }
}
</script>
