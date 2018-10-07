<template>
  <v-card>
    <v-card-title>
      스팀에 가입하셨습니다.
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
  mounted () {
    console.log(this.data)
  }
}
</script>
