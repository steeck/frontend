<template>
  <v-card>
    <v-card-title>
      <span class="font-weight-bold">{{ item.author }}</span>님의 게시글 {{ item.permlink }}에 {{ item.weight | vp }}% 보팅하셨습니다.
    </v-card-title>
    <v-card-text>
      {{ data.timestamp | ago }}
    </v-card-text>
  </v-card>
</template>

<script>
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
    vp: function (value) {
      if (!value) return
      return Math.round(value / 100)
    }
  },
  mounted () {
    this.item = this.data.op[1]
  }
}
</script>
