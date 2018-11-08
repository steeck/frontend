<template>
  <v-menu
    offset-y bottom left
  >
    <v-avatar
      slot="activator"
      :size="40"
      color="white"
    >
      <v-img :src="'https://steemitimages.com/u/' + this.$store.state.auth.username + '/avatar'"></v-img>
    </v-avatar>
    <v-list>
      <V-list-tile>
        <v-list-tile-title><router-link to="/my/sticker">내 정보</router-link></v-list-tile-title>
      </V-list-tile>
        <V-list-tile>
          <v-list-tile-title><router-link to="/my/wallet">내 지갑</router-link></v-list-tile-title>
        </V-list-tile>
      <V-list-tile>
        <v-layout row wrap>
          <v-flex xs12>보팅마나</v-flex>
          <v-flex xs8>
            <v-progress-linear
              height="10"
              :value="vp"
            ></v-progress-linear>
          </v-flex>
          <v-flex xs4 class="text-xs-right">
            {{ vp }}%
          </v-flex>
        </v-layout>
      </V-list-tile>
      <V-list-tile>
        <v-layout row wrap>
          <v-flex xs12>RC마나</v-flex>
          <v-flex xs8>
            <v-progress-linear
              height="10"
              :value="rc"
            ></v-progress-linear>
          </v-flex>
          <v-flex xs4 class="text-xs-right">
            {{ rc }}%
          </v-flex>
        </v-layout>
      </V-list-tile>
      <V-list-tile>
        <v-list-tile-title><a href="/logout">로그아웃</a></v-list-tile-title>
      </V-list-tile>
    </v-list>
  </v-menu>
</template>

<style scoped>
>>>.v-list__tile {
  width: 160px;
  font-size: 1rem;
  color: #414d6b;
}
>>>.v-progress-linear {
  margin: 5px 0;
}
a {
  text-decoration: none;
  color: inherit;
}
</style>

<script>
export default {
  mounted () {
    // this.$store.dispatch('me/getAccount')
  },
  computed: {
    vp () {
      if (this.$store.state.me.account) {
        return (this.$store.state.me.account.voting_power / 100).toFixed(0)
      }
    },
    rc () {
      if (this.$store.state.me.rc.rc_manabar) {
        return (this.$store.state.me.rc.rc_manabar.current_mana / this.$store.state.me.rc.max_rc * 100).toFixed(0)
      }
    }
  }
}
</script>
