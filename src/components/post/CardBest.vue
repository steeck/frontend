<template>
  <v-card>
    <v-img
      height="130px"
      :src="thumbnail"
      :lazy-src="defaultSrc"
      style="position: relative;"
    >
      <div class="rating">
        {{ rating }}
      </div>
    </v-img>
    <v-card-title>
      {{ item.title }}
    </v-card-title>
    <v-card-text>
      <span class="tag">{{ tag | tag }}</span><span class="author">{{ item.author }}</span>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-card {
  box-shadow: none;
  margin-bottom: 16px;
  border: 1px solid #e6e6e6;
}
.v-card >>>.v-responsive {
  overflow: inherit;
}
.rating {
  position: absolute;
  bottom: -5px;
  text-align: center;
  color: white;
  background-color: #6633ff;
  width: 55px;
  font-size: 30px;
  font-weight: 500;
  line-height: 55px;
}
>>>.v-card__title {
  display: -webkit-box;
  font-size: 16px;
  line-height: 1.5;
  padding-top: 12px;
  padding-bottom: 0;
  height: 60px;  /* font-size * line-height * line-clamp + padding-top */
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
>>>.v-card__text {
  padding-top: 12px;
  padding-bottom: 12px;
}
.tag {
  font-size: 13px;
  font-weight: 500;
  color: #4321a9;
}
.author {
  font-size: 13px;
  font-weight: 500;
  color: #8e8e8e;
}
.author::before {
  content: '|';
  margin: 0 10px;
}
</style>

<script>
export default {
  props: ['item', 'rating'],
  data () {
    return {
      metadata: {},
      defaultSrc: 'https://via.placeholder.com/350x150'
    }
  },
  filters: {
    tag: (tag) => {
      if (tag === 'steeck-life') return '라이프'
      else if (tag === 'steeck-hot') return '핫이슈'
      else if (tag === 'steeck-game') return '게임'
      else if (tag === 'steeck-travel') return '여행'
      else return '임시태그'
    }
  },
  mounted () {
    this.metadata = JSON.parse(this.item.json_metadata)
  },
  computed: {
    tag () {
      if (this.metadata.tags) {
        return this.metadata.tags[0]
      }
    },
    thumbnail () {
      if (this.metadata.image) {
        return this.metadata.image[0]
      } else {
        return this.defaultSrc
      }
    }
  }
}
</script>
