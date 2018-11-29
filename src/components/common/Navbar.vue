<template>
  <div>
    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" fixed v-model="drawer" left app width="230">
      <v-list dense class="pa-4">
        <div v-if="false">
          <v-list-tile>
            <v-list-tile-content>
              <router-link to="/create" class="btn-link"><v-btn block color="primary">글쓰기</v-btn></router-link>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="my-4"></v-divider>
        </div>
        <v-list-tile v-for="(cate, i) in categories" :key="i">
          <v-list-tile-content>
            <v-list-tile-title><router-link :to="{ name: 'Categories', params: {category: cate.value} }" class="link">{{ cate.text }}</router-link></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider class="my-4"></v-divider>
        <div class="menu-bottom">
          <ul>
            <li><a href="http://about.steeck.io" target="about">스틱소개</a></li>
            <li><router-link to="/center/lease">자산센터</router-link></li>
            <li v-if="$store.state.auth.username === 'steeck' || $store.state.auth.username === 'smtion'"><router-link to="/center/steecky">스틱토큰</router-link></li>
          </ul>
          <ul class="mt-2">
            <li><a href="mailto:support@steeck.io">고객지원</a></li>
            <li><a href="mailto:support@steeck.io">제휴문의</a></li>
            <li>약관</li>
          </ul>
          <ul class="mt-2">
            <li>개인정보 처리방침</li>
          </ul>
          <div class="mt-3">
            &copy;2019 <strong>Steeck Inc.</strong>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="indigo" dark fixed app
      :extended="extended"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/"><img src="https://s3.ap-northeast-2.amazonaws.com/steeck/main_logo.png" class="logo"> <span v-if="$vuetify.breakpoint.smAndUp" class="v-toolbar__subtitle">스틱베타</span></router-link></v-toolbar-title>
      <v-text-field v-if="$vuetify.breakpoint.smAndUp" flat solo hide-details prepend-inner-icon="search" v-model="q" @keyup.enter="search" label="검색어를 입력해주세요." class="ml-5"></v-text-field>
      <v-spacer></v-spacer>
      <img v-if="$vuetify.breakpoint.xs" src="https://s3.ap-northeast-2.amazonaws.com/steeck/icons/group-4%402x.png" @click="extended = !extended" style="width: 24px;">
      <v-toolbar-title slot="extension" v-if="extended && $vuetify.breakpoint.xs" style="width: 100%;">
        <v-text-field flat solo hide-details prepend-inner-icon="search" v-model="q" @keyup.enter="search" label="검색어를 입력해주세요."></v-text-field>
      </v-toolbar-title>
      <router-link to="/create"
        v-if="this.$store.state.auth.accessToken"
        class="btn-create"
      >
        <img src="https://s3.ap-northeast-2.amazonaws.com/steeck/icons/btn-symbol@2x.png" style="width: 24px;">
        <span class="hidden-sm-and-down">스티커작성</span>
      </router-link>
      <logged-on v-if="this.$store.state.auth.accessToken"></logged-on>
      <v-btn v-else :href="loginUrl">로그인</v-btn>
    </v-toolbar>
    <v-snackbar
      v-model="qToast"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="3000"
      :top="true"
      :vertical="false"
    >
      {{ qError }}
      <v-btn
        color="white"
        flat
        @click="qToast = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<style scoped>
.logo {
  height: 20px;
  vertical-align: middle;
  margin-bottom: 5px;
}
>>>.v-toolbar--clipped {
  z-index: 5;
}
>>>.v-toolbar {
  background-color: #6633ff !important;
}
>>>.v-toolbar__title {
  margin-left: 5px;
  overflow: inherit;
}
>>>.v-toolbar__title a {
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
}
.v-toolbar__subtitle {
  font-size: 0.6em;
  padding-left: 0.4em;
  opacity: .6;
}
>>>.theme--dark.v-text-field--solo .v-input__slot {
  background-color: hsla(0,0%,100%,.4);
  caret-color: #fff !important;
}
>>>.v-icon.material-icons.theme--dark.primary--text {
  color: #fff !important;
  caret-color: #fff !important;
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
>>>.v-toolbar__extension > .v-toolbar__title {
  margin-left: 0 !important;
}
.btn-create {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  margin: 0 20px;
}
.btn-create img {
  vertical-align: middle;
  margin-right: 3px;
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
  content: '';
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
      extended: false,
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
      ],
      q: '',
      qError: '',
      qToast: false
    }
  },
  methods: {
    /**
     * 검색 기능 시작
     */
    search: function () {
      if (this.q.length < 2) {
        this.qError = '검색어는 2글자 이상 입력해주세요'
        this.qToast = true
        return
      }
      this.$router.push({name: 'Search', params: { q: this.q }})
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
