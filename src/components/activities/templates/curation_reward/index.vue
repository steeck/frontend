<template>
  <v-card>
    <v-card-title>
      <span class="font-weight-bold">{{ item.comment_author }}</span>님의 <a :href="permlink">게시글</a>의 큐레이션 보상으로 <span class="font-weight-bold">{{ reward | sp }} SP를 지급받았습니다.</span>
    </v-card-title>
    <v-card-text>
      {{ data.timestamp | ago }}
    </v-card-text>
  </v-card>
</template>

<script>
import steem from '@/services/steem'

export default {
  props: {
    name: 'activity',
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      item: {}
    }
  },
  filters: {
    vp: function (weight) {
      if (!weight) return
      return Math.round(weight / 100)
    },
    sp: function (vests) {
      return steem.formatter.vestToSteem(vests, this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund)
    }
  },
  mounted () {
    this.item = this.data.op[1]
    console.log(this.data)
  },
  computed: {
    permlink () {
      return 'https://steemit.com/@' + this.item.comment_author + '/' + this.item.comment_permlink
    }
  }
}
</script>
