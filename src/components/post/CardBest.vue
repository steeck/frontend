<template>
  <v-card>
    <v-img
      height="150px"
      :src="item.src"
       style="position: relative;"
    >
      <div class="rating">
        {{ item.rating }}
      </div>
    </v-img>
    <v-card-title>
      {{ item.title }}
    </v-card-title>
    <v-card-text>
      <v-btn flat color="orange">{{ item.tag | tag }}</v-btn>
      <v-btn flat color="orange">{{ item.username }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-card >>>.v-responsive {
  overflow: inherit;
}
.rating {
  position: absolute;
  bottom: -5px;
  text-align: center;
  color: white;
  background-color: rgb(63, 81, 181);
  width: 50px;
  font-size: 24px;
  font-weight: bold;
  line-height: 2;
}
>>>.v-card__title {
  display: -webkit-box;
  font-size: 18px;
  line-height: 1.5;
  height: 70px;  /* font-size * line-height * line-clamp + padding-top */
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
export default {
  props: ['item'],
  filters: {
    tag: (tag) => {
      if (tag === 'steeck-life') return '라이프'
      else if (tag === 'steeck-hot') return '핫이슈'
      else if (tag === 'steeck-game') return '게임'
      else if (tag === 'steeck-travel') return '여행'
      else return tag
    }
  }
}
</script>
