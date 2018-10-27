<template>
  <v-card>
    <v-layout flat row>
      <v-flex class="col-rating">
        <div class="rating">
          {{ rating }}
        </div>
      </v-flex>
       <v-flex class="col-body">
         <v-card-title>
           {{ item.title }}
         </v-card-title>
         <v-card-text>
           <span class="category">{{ category }}</span><span class="author">{{ item.author }}</span>
         </v-card-text>
       </v-flex>
       <v-flex class="col-img">
         <v-img
           :src="thumbnail"
           width="110"
           height="80"
         ></v-img>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<style scoped>
.v-card {
  box-shadow: none;
  padding-bottom: 16px;
  border-bottom: 1px solid #ededed;
}
>>>.v-card__title {
  display: -webkit-box;
  font-size: 16px;
  line-height: 1.5;
  padding: 0;
  padding-bottom: 12px;
  height: 48px;  /* font-size * line-height * line-clamp + padding-top */
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
>>>.v-card__text {
  padding: 0;
  padding-top: 12px;
}
.col-rating {
  min-width: 60px;
  max-width: 60px;
  padding-right: 0;
  text-align: center;
}
.col-body {
  padding-left: 0!important;
}
.col-img {
  min-width: 132px;
  max-width: 132px;
}
.rating {
  font-size: 25px;
  font-weight: 500;
  color: #425363;
}
.category {
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
      defaultThumbnail: 'https://via.placeholder.com/110x80'
    }
  },
  mounted () {
  },
  computed: {
    thumbnail () {
      return this.item.thumbnail ? this.item.thumbnail : this.defaultThumbnail
    },
    category () {
      return this.$store.state.terms.categories[this.item.category]
    }
  }
}
</script>
