<template>
  <v-app id="inspire"
    class="white"
  >
    <navbar></navbar>
    <v-content>
      <main-toolbar></main-toolbar>
      <div class="grey lighten-3 hidden-sm-and-down">
        <v-container class="py-0">
          <v-layout row wrap class="darken-3" style="padding-left: 12px; padding-right: 12px;">
            <v-flex class="categories" md2 v-for="(cate, i) in categories" :key="i">
              <router-link
                :to="{ name: 'Categories', params: { category: cate.value } }"
                v-bind:class="{ active: menu == cate.value}"
                class="link"
              >{{ cate.text }}</router-link>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <footbar></footbar>
  </v-app>
</template>

<style scoped>
@media only screen and (min-width: 1904px) {
  .container {
    max-width: 674px !important;
  }
}
@media only screen and (min-width: 1264px) {
  .container {
    max-width: 674px;
  }
}
@media only screen and (max-width: 959px) {
  .container.fluid {
    padding: 16px 0;
  }
  .container {
    padding: 12px;
  }
}
.categories {
  text-align: center;
  padding: 1rem;
  border: 0.5px solid #dedede;
}
.categories a {
  text-decoration: none;
  color: #425363;
  /* font-weight: 600; */
}
.categories a.active {
  font-weight: 600;
}
</style>

<script>
import Navbar from '@/components/common/Navbar'
import Footbar from '@/components/common/Footbar'
import MainToolbar from '@/components/common/MainToolbar'

export default {
  props: {
    source: String
  },
  components: {
    Navbar,
    Footbar,
    MainToolbar
  },
  data () {
    return {
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
      menu: ''
    }
  },
  mounted () {
    this.menu = this.$router.history.current.params.category
    // console.log(this.menu)
  },
  watch: {
    $route (to, from) {
      this.menu = to.params.category
    }
  }
}
</script>
