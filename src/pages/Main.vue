<template>
  <div>
    <v-container py-0>
      <v-carousel fullscreen>
        <v-carousel-item
          v-for="(item,i) in items"
          :key="i"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </v-container>
    <div class="grey lighten-3">
      <v-container>
        태그
      </v-container>
    </div>
    <v-container grid-list-xl>
      <div>
        스틱30 | 뉴비30 | 주간 | 페이아웃
      </div>
      <v-layout row wrap>
        <v-flex sm12 md4 v-for="(card, i) in cards1" :key="'c1'+i">
          <card-best :item="card"></card-best>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="asd">
        <v-flex md6 v-for="(card, i) in cards2" :key="'c2'+i">
          <card :item="card"></card>
        </v-flex>
      </v-layout>
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

.asd {
  margin: auto -24px !important;
}
.asd .flex {
  padding: 12px 24px !important;
}
</style>

<script>
import CardBest from '@/components/post/CardBest'
import Card from '@/components/post/Card'

export default {
  data () {
    return {
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
      ],
      cards1: [
        {
          src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
          rating: 1,
          title: '수제 햄버거 먹고싶다. 나인온스는 줄이 너무 길어',
          tag: 'steeck-life',
          username: 'alice'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
          rating: 2,
          title: '오이 당근',
          tag: 'steeck-travel',
          username: 'rolls'
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
          rating: 3,
          title: '긴 제목 테스트 긴 제목 테스트 긴 제목 테스트 긴 제목 테스트 긴 제목 테스트 긴 제목 테스트 긴 제목 테스트 긴 제목 테스트',
          tag: 'steeck-hot',
          username: 'smtion'
        }
      ],
      cards2: [
        {
          src: ''
        },
        {
          src: ''
        },
        {
          src: ''
        },
        {
          src: ''
        },
        {
          src: ''
        },
        {
          src: ''
        }
      ]
    }
  },
  components: {
    CardBest,
    Card
  }
}
</script>
