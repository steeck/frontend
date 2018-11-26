<template>
  <div>
    <v-container py-0 :class="{ 'px-0': $vuetify.breakpoint.smAndDown }">
      <v-carousel fullscreen height="300">
        <v-carousel-item v-for="(banner, i) in banners" :key="i" :src="banner.url">
          <div v-if="banner.text1" class="banner-text1">
            <span v-html="banner.text1"></span>
          </div>
          <div v-if="banner.text2" class="banner-text2">
            <span v-html="banner.text2"></span>
          </div>
          <div v-if="banner.text3" class="banner-text3">
            <span v-html="banner.text3"></span>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-container>
    <v-container grid-list-xl>
      <v-layout row wrap class="list-menubar">
        <v-flex xs6 class="list-menubar-lg">
          <span class="list-menubar__steeck" :class="{ 'active': selected.lg == 'steeck' }" @click="selected.lg = 'steeck'">스틱50</span>
          <span class="list-menubar-divider">|</span>
          <span class="list-menubar__newbie" :class="{ 'active': selected.lg == 'newbie' }" @click="selected.lg = 'newbie'">뉴비50</span>
        </v-flex>
        <v-flex xs6 class="list-menubar-sm">
          <span class="list-menubar__pending" :class="{ 'active': selected.sm == 'pending' }" @click="selected.sm = 'pending'">실시간</span>
          <span class="list-menubar-divider">|</span>
          <span class="list-menubar__payout" :class="{ 'active': selected.sm == 'payout' }" @click="selected.sm = 'payout'">페이아웃</span>
        </v-flex>
      </v-layout>
      <div class="list mt-5">
        <div v-if="isLoading">
          <div class="text-xs-center" v-if="!list.length">
            <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
          </div>
        </div>
        <div v-else>
          <v-layout row wrap>
            <v-flex xs12 sm4 v-for="(card, i) in list.slice(0, 3)" :key="card.id">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card-best :item="card" :rating="i + 1"></card-best>
              </router-link>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in list.slice(3, 9)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 4"></card>
              </router-link>
            </v-flex>
          </v-layout>
          <div class="popular-editors" :class="{ 'popular-editors__mobile': $vuetify.breakpoint.smAndDown }">
            <div class="inner">
              <div class="title">
                인기 에디터를 팔로우하세요
              </div>
              <ul class="editors-list">
                <li class="editors-item" v-for="(editor, i) in editors" :key="editor.name">
                  <router-link :to="{ name: 'User', params: { username: editor.name } }" class="link">
                    <editor :editor="editor"></editor>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <v-layout row wrap class="asd">
            <v-flex xs12 sm6 v-for="(card, i) in list.slice(9)" :key="card.permlink">
              <router-link :to="{ name: 'View', params: { id: card.id } }" class="link">
                <card :item="card" :rating="i + 10"></card>
              </router-link>
            </v-flex>
          </v-layout>
        </div>
      </div>
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
.banner-text1 {
  padding-left: 15%;
  color: #fff;
  font-size: 1.2rem;
  margin-top: 30px;
}
.banner-text2 {
  padding-left: 15%;
  color: #fff;
  font-size: 1.8rem;
  margin-top: 20px;
  line-height: 1.3;
  font-weight: 600;
}
.banner-text3 {
  padding-left: 15%;
  color: #fff;
  font-size: 1.1rem;
  margin-top: 20px;
  line-height: 1.4;
}
@media only screen and (max-width: 959px) {
  >>>.v-carousel {
    height: 220px !important;
  }
  .banner-text1 {
    padding-left: 10%;
    font-size: 1.2rem;
    margin-top: 30px;
  }
  .banner-text2 {
    padding-left: 10%;
    color: #fff;
    font-size: 1.4rem;
    margin-top: 20px;
    line-height: 1.3;
    font-weight: 600;
  }
  .banner-text3 {
    padding-left: 10%;
    color: #fff;
    font-size: 1rem;
    margin-top: 20px;
    line-height: 1.4;
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
  font-weight: 600;
}
.link {
  text-decoration: none;
}
.list-menubar {
  border-bottom: solid 1px #bbbbbb;
  margin: 0 !important;
}
.list-menubar-lg {
  cursor: pointer;
  font-size: 18px;
  color: #b1b1b1;
  padding: 6px 0 !important;
}
.list-menubar-lg .active {
  color: #4321a9;
  font-weight: 600;
}
.list-menubar-sm {
  cursor: pointer;
  text-align: right;
  font-size: 14px;
  color: #b1b1b1;
  padding: 6px 0 !important;
}
.list-menubar-sm .active {
  color: #425363;
  font-weight: 600;
}
.list-menubar-divider {
  margin: 0 5px;
}
.editors-list {
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  padding-left: 0;
}
@media only screen and (max-width: 1264px) {
  .editors-list {
    overflow-x: auto;
  }
}
.editors-item {
  display: inline-block;
  position: relative;
  width: 170px;
}
.editors-item + .editors-item {
  margin-left: 23px;
}
.asd {
  margin: auto -12px !important;
}
.asd .flex {
  padding: 12px 12px !important;
}
.popular-editors {
  background-color: #f6f6f6;
  margin: 12px -1000px;
  padding: 0 1000px;
}
.popular-editors__mobile {
  margin: 0 -16px;
  padding: 0 16px;
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

}

table.table-tag td {
  width: calc(100% / 6);
  padding: 1rem;
  color: #37474F;
  border: 0.5px solid #dedede;
  cursor: pointer;
  transition: 0.2s;

}

table.table-tag td:hover {
  color: black;
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
      isLoading: false,
      list: [],
      selected: {
        lg: 'steeck',
        sm: 'pending'
      },
      best: [],
      news: [],
      newbies: [],
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
      usernames: [],
      editors: [],
      banners: [
        {
          url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/01_banner_main_steeck.png',
          text1: '즐거운 세상이 주는 새로운 가치-스틱',
          text2: '관심사별 콘텐츠에 업보트 하거나<br>나만의 노하우가 담긴 콘텐츠를 만들어<br>암호화폐 보상을 받으세요!',
          text3: ''
        },
        {
          url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/02_banner_main_steeck.png',
          text1: '스틱에서 대학생 에디터를 모십니다',
          text2: '블록체인이 변화시킬 세상을 위해<br>이제 그대들이 나설 차례!',
          text3: '참가대상: 자신만의 콘텐츠를 만들어낼 수 있는 대학생<br>참여보상: 콘텐츠당 30스팀달러'
        }
        // {
        //   url: 'https://s3.ap-northeast-2.amazonaws.com/steeck/images/03_banner_main_steeck.png',
        //   text1: '암호화폐',
        //   text2: 'UIOEX거래소 슬레이트 사기사건!',
        //   text3: '슬레이트 본사도 모르는 슬레이트(SLX)코인이<br>UIO거래소에 상장되고<br>300~400명의 피해자가 발생...'
        // }
      ]
    }
  },
  components: {
    CardBest,
    Card,
    Editor
  },
  mounted () {
    this.$store.dispatch('me/getAccount')
    this.getPosts()
    this.getEditors()
  },
  watch: {
    'selected': {
      handler: function (val, oldVal) {
        this.getPosts()
      },
      deep: true
    }
  },
  methods: {
    getPosts: function () {
      this.isLoading = true
      let vm = this
      api.getPosts(this.selected)
        .then(res => {
          vm.list = res.data
          this.isLoading = false
        })
        .catch(err => {
          console.log(err)
          this.isLoading = false
        })
    },
    // getPosts: function () {
    //   let vm = this
    //   api.getBest({})
    //     .then(res => {
    //       vm.best = res.data
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //   api.getNew({})
    //     .then(res => {
    //       vm.news = res.data
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //   api.getNewbie({})
    //     .then(res => {
    //       vm.newbies = res.data
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    //   api.getPayout({})
    //     .then(res => {
    //       vm.payout = res.data
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    getEditors: function () {
      let vm = this
      api.getPopularEditors()
        .then(res => {
          res.data.forEach(item => {
            vm.usernames.push(item.author)
          })
          steem.api.getAccounts(vm.usernames, function (err, res) {
            if (err) {}
            vm.editors = res
          })
        })
    }
  }
}
</script>
