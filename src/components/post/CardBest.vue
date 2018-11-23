<template>
  <v-card>
    <v-img
      aspect-ratio="2"
      :src="thumbnail"
      :lazy-src="defaultThumbnail"
    >
      <div class="rating">
        {{ rating }}
      </div>
    </v-img>
    <v-card-title>
      {{ item.title }}
    </v-card-title>
    <v-card-text>
      <span class="category">{{ category }}</span><span class="author">{{ item.author }}</span>
      <span class="reward">{{ payouts | kwn | number }}원</span>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.v-card {
  box-shadow: none;
  margin-bottom: 16px;
  border: 1px solid #e6e6e6 !important;
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
.category {
  font-size: 13px;
  font-weight: 500;
  color: #4321a9;
}
.author {
  font-size: 13px;
  font-weight: 500;
  color: #8e8e8e;
  margin-left: 10px;
}
/* .author::before {
  content: '|';
  margin: 0 10px;
} */
.reward {
  font-size: 13px;
  font-weight: 500;
  color: #8e8e8e;
  float: right;
}
</style>

<script>
import steem from '@/services/steem'

export default {
  props: ['item', 'rating'],
  data () {
    return {
      steemdata: {},
      defaultThumbnail: ''// 'https://via.placeholder.com/110x80'
    }
  },
  mounted () {
    this.getSteemContent()
  },
  computed: {
    thumbnail () {
      return this.item.thumbnail ? this.item.thumbnail : this.defaultThumbnail
    },
    category () {
      return this.$store.state.terms.categories[this.item.category]
    },
    payouts () {
      if (parseFloat(this.steemdata.total_payout_value)) {
        return parseFloat(this.steemdata.total_payout_value) + parseFloat(this.steemdata.curator_payout_value)
      } else {
        return parseFloat(this.steemdata.pending_payout_value)
      }
    }
  },
  methods: {
    getSteemContent: function () {
      let vm = this
      steem.api.getContent(this.item.author, this.item.permlink, function (err, res) {
        if (err) {}
        vm.steemdata = res
      })
    }
  }
}
</script>
