<template>
  <div>
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" fixed v-model="drawer" left app width="230">
      <v-list dense class="pa-4">
        <v-list-tile>
          <v-list-tile-content>
            <router-link to="/create" class="btn-link"><v-btn block color="primary">글쓰기</v-btn></router-link>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-4"></v-divider>
        <v-list-tile v-for="(cate, i) in categories" :key="i">
          <v-list-tile-content>
            <v-list-tile-title><router-link :to="{ name: 'Categories', params: {category: cate.value} }" class="link">{{ cate.text }}</router-link></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-4"></v-divider>
        <div class="menu-bottom">
          <ul>
            <li>스틱소개</li>
            <li><router-link to="/center/lease">펀딩센터</router-link></li>
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
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" label="Search" class="ml-5 hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <logged-on v-if="this.$store.state.auth.accessToken"></logged-on>
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
  font-size: 0.6em;
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
.btn-link {
  text-decoration: none;
  display: block;
  width: 100%;
}
.link {
  text-decoration: none;
  color: inherit;
}
.link:hover {
  color: #111;
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
import LoggedOn from '@/components/common/LoggedOn'

export default {
  components: {
    LoggedOn
  },
  data () {
    return {
      drawer: false,
      categories: [
        { value: 'hot', text: '핫이슈' },
        { value: 'crypto', text: '암호화폐' },
        { value: 'fashion', text: '패션·뷰티' },
        { value: 'life', text: '라이프' },
        { value: 'travel', text: '여행' },
        { value: 'culture', text: '문화·예술' },
        { value: 'lesson', text: '어학·강좌' },
        { value: 'car', text: '차·테크' },
        { value: 'game', text: '게임' },
        { value: 'food', text: '푸드' },
        { value: 'essey', text: '공감·에세이' },
        { value: 'sponsor', text: '스폰서' }
      ]
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
