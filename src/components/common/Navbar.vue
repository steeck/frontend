<template>
  <div>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      v-model="drawer"
      left
      app
      width="230"
    >
      <v-list dense class="pa-4">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>핫이슈</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>암호화폐</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>패션·뷰티</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>라이프</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>여행</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>문화·예술</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>어학·강좌</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>차·테크</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>게임</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>푸드</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>공감·에세이</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>스폰서</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-4"></v-divider>
        <div class="menu-bottom">
          <ul>
            <li>스틱소개</li>
            <li>고객센터</li>
            <li>공식채널</li>
          </ul>
          <ul class="mt-2">
            <li>고객지원</li>
            <li>제휴문의</li>
            <li>약관</li>
          </ul>
          <ul class="mt-2">
            <li>개인정보 처리방침</li>
          </ul>
          <div class="mt-3">
            &copy;2018 — <strong>STEECK</strong>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="indigo" dark fixed app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/">Steeck <span class="v-toolbar__subtitle">스틱베타</span></router-link></v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="ml-5 hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn v-if="this.$store.state.auth.accessToken" href="/#/logout">로그아웃</v-btn>
      <v-btn v-else :href="loginUrl">로그인</v-btn>
    </v-toolbar>
  </div>
</template>

<style scoped>
>>>.v-toolbar__title a {
  color: #fff;
  text-decoration: none;
}
.v-toolbar__subtitle {
  font-size: 0.8em;
  padding-left: 0.4em;
}
.menu-bottom {
  font-size: 0.9em;
  color: #1b1c1d;
}
>>>.v-list__tile {
  font-size: 1rem;
  color: #414d6b;
  padding-left: 0;
  padding-right: 0;
}
>>>.v-navigation-drawer > .v-list .v-list__tile {
  font-weight: 600;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
li + li:before {
  content: '|';
  width: 20px;
  display: inline-block;
  text-align: center;
}
li a {
  text-decoration: none;
  color: inherit;
}
</style>

<script>
import steemconnect from '@/services/steemconnect'

export default {
  data () {
    return {
      drawer: false
    }
  },
  mounted () {
    // this.$eventBus.$on('profile-fetched', () => {
    //   this.profile = this.$store.state.profile
    // })
  },
  computed: {
    loginUrl () {
      return steemconnect.getLoginURL()
    }
  }
}
</script>
