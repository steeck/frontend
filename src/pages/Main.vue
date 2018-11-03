<template>
  <div>
    <v-container py-0>
      <v-carousel fullscreen height="300">
        <v-carousel-item v-for="(banner, i) in banners" :key="i" :src="banner.url"></v-carousel-item>
      </v-carousel>
    </v-container>
    <div class="grey lighten-3 hidden-sm-and-down">
      <v-container class="py-0">
        <v-layout row wrap class="darken-3">
          <v-flex class="categories" md2 v-for="(cate, i) in categories" :key="i">
            <router-link :to="{ name: 'Categories', params: { category: cate.value } }" class="link">{{ cate.text }}</router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-container grid-list-xl>
      <v-tabs hide-slider>
        <v-tab ripple>스틱30</v-tab>
        <v-tab-item>
          <div class="text-xs-center ma-5" v-if="!best.length">
            <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
          </div>
          <v-layout row wrap>
            <v-flex xs12 sm4 v-for="(card, i) in best.slice(0, 3)" :key="card.id">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card-best :item="card" :rating="i + 1"></card-best>
              </router-link>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in best.slice(3, 9)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 4"></card>
              </router-link>
            </v-flex>
          </v-layout>

          <div class="popular-editors">
            <div class="inner">
              <div class="title">
                인기 에디터를 팔로우하세요
              </div>
              <v-layout row wrap>
                <v-flex xs6 sm3 md2 v-for="(editor, i) in editors" :key="editor.name">
                  <router-link :to="{ name: 'User', params: { username: editor.name } }" class="link">
                    <editor :editor="editor"></editor>
                  </router-link>
                </v-flex>
              </v-layout>
            </div>
          </div>

          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in best.slice(9)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 10"></card>
              </router-link>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab ripple>뉴비30</v-tab>
        <v-tab-item>
          <v-layout row wrap>
            <v-flex xs12 sm4 v-for="(card, i) in news.slice(0, 3)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card-best :item="card" :rating="i + 1"></card-best>
              </router-link>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in news.slice(3)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 4"></card>
              </router-link>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-spacer></v-spacer>
        <v-tab ripple>주간</v-tab>
        <v-tab-item>
          <v-layout row wrap>
            <v-flex xs12 sm4 v-for="(card, i) in weekly.slice(0, 3)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card-best :item="card" :rating="i + 1"></card-best>
              </router-link>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in weekly.slice(3)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 4"></card>
              </router-link>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<style scoped>
>>>.v-carousel {
  height: 320px;
}
>>>.v-carousel__controls {
  background: none;
  top: 0;
  right: 0;
  padding-right: 1rem;
  justify-content: flex-end;
}
>>>.v-carousel__controls__item {
  margin: 0 !important;
}
>>>.v-carousel__controls__item i {
  font-size: 12px !important;
}
>>>.v-tabs__bar {
  border-bottom: solid 1px #bbbbbb;
  margin-bottom: 30px;
}
>>>.v-tabs__item {
  font-size: 18px;
  color: #b1b1b1;
}
>>>.v-tabs__item--active {
  color: #4321a9;
  font-weight: 500;
}
.categories {
  text-align: center;
  padding: 1rem;
  border: 0.5px solid #dedede;
}
.categories a {
  text-decoration: none;
  color: #425363;
  font-weight: 600;
}
.link {
  text-decoration: none;
}
.asd {
  margin: auto -24px !important;
}
.asd .flex {
  padding: 12px 24px !important;
}
.popular-editors {
  background-color: #f6f6f6;
  margin: 12px -1000px;
  padding: 0 1000px;
}
.popular-editors .inner {
  padding: 24px 0;
}
.popular-editors .title {
  font-size: 16px;
  font-weight: 600;
  color: #425363;
  margin: 12px 0;
}

table.table-tag {
  width: 100%;
  border-collapse: collapse;
  td {
    width: calc(100% / 6);
    padding: 1rem;
    color: #37474F;
    border: 0.5px solid #dedede;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: black;
    }
  }
}
</style>

<script>
import api from '@/api/posts'
import steem from '@/services/steem'
import CardBest from '@/components/post/CardBest'
import Card from '@/components/post/Card'
import Editor from '@/components/Editor'

export default {
  data () {
    return {
      best: [],
      news: [],
      weekly: [],
      payout: [],
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
      usernames: ['meno', 'jjogorae', 'marlon6', 'chibera', 'isaria', 'onepercentbetter'],
      editors: [],
      banners: [
        { url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/01_banner_main_steeck.png' },
        { url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/02_banner_main_steeck.png' },
        { url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/03_banner_main_steeck.png' },
      ]
    }
  },
  components: {
    CardBest,
    Card,
    Editor
  },
  mounted () {
    this.getPosts()
    this.getEditors()
  },
  methods: {
    getPosts: function () {
      let vm = this
      api.getBest({})
        .then(res => {
          vm.best = res.data
        })
        .catch(err => {
          console.log(err)
        })
      api.getNew({})
        .then(res => {
          vm.news = res.data
        })
        .catch(err => {
          console.log(err)
        })
      api.getWeekly({})
        .then(res => {
          vm.weekly = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    getEditors: function () {
      let vm = this

      steem.api.getAccounts(this.usernames, function (err, res) {
        if (err) {}
        vm.editors = res
      })
    }
  }
}
</script>
