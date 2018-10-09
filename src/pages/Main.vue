<template>
  <div>
    <v-container py-0>
      <v-carousel fullscreen>
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
      </v-carousel>
    </v-container>
    <div class="grey lighten-3">
      <v-container class="py-0">
        <v-layout class="darken-3">
          <table class="table-tag text-xs-center font-weight-bold">
            <tbody>
            <tr>
              <td>핫이슈</td>
              <td>암호화폐</td>
              <td>패션뷰티</td>
              <td>라이프</td>
              <td>여행</td>
              <td>문화예술</td>
            </tr>
            <tr>
              <td>어학강좌</td>
              <td>차테크</td>
              <td>게임</td>
              <td>푸드</td>
              <td>공감에세이</td>
              <td>스폰서</td>
            </tr>
            </tbody>
          </table>
        </v-layout>
      </v-container>
    </div>
    <v-container grid-list-xl>
      <v-tabs hide-slider>
        <v-tab ripple>스틱30</v-tab>
        <v-tab-item>
          <div class="text-xs-center ma-5" v-if="!trending.length">
            <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
          </div>
          <v-layout row wrap>
            <v-flex sm12 md4 v-for="(card, i) in trending.slice(0, 3)" :key="'c1'+i">
              <card-best :item="card" :rating="i + 1"></card-best>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex md6 v-for="(card, i) in trending.slice(3)" :key="'c2'+i">
              <card :item="card" :rating="i + 4"></card>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-tab ripple>뉴비30</v-tab>
        <v-tab-item>
          <v-layout row wrap>
            <v-flex sm12 md4 v-for="(card, i) in created.slice(0, 3)" :key="'c3'+i">
              <card-best :item="card" :rating="i + 1"></card-best>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex md6 v-for="(card, i) in created.slice(3)" :key="'c4'+i">
              <card :item="card" :rating="i + 4"></card>
            </v-flex>
          </v-layout>
        </v-tab-item>
        <v-spacer></v-spacer>
        <v-tab ripple>주간</v-tab>
        <v-tab-item>
          <v-layout row wrap>
            <v-flex sm12 md4 v-for="(card, i) in hot.slice(0, 3)" :key="'c5'+i">
              <card-best :item="card" :rating="i + 1"></card-best>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="asd">
            <v-flex md6 v-for="(card, i) in hot.slice(3)" :key="'c6'+i">
              <card :item="card" :rating="i + 4"></card>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
  @import "../colorset.scss";
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
.asd {
  margin: auto -24px !important;
}
.asd .flex {
  padding: 12px 24px !important;
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
import steem from '@/services/steem'
import CardBest from '@/components/post/CardBest'
import Card from '@/components/post/Card'

export default {
  data () {
    return {
      trending: [],
      created: [],
      hot: [],
      payout: [],
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
        }
      ]
    }
  },
  components: {
    CardBest,
    Card
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    getPosts: function () {
      let vm = this
      const query = {
        tag: 'tasteem',
        limit: 30
      }
      steem.api.getDiscussionsByTrending(query, function (err, res) {
        if (err) {}
        vm.trending = res
      })
      steem.api.getDiscussionsByHot(query, function (err, res) {
        if (err) {}
        vm.hot = res
      })
      steem.api.getDiscussionsByCreated(query, function (err, res) {
        if (err) {}
        vm.created = res
      })
      // steem.api.getDiscussionsByPayout(query, function (err, res) {
      //   vm.payout = res
      // })
    }
  }
}
</script>
