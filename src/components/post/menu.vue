<template>
  <div>
    <v-menu bottom left>
      <v-btn slot="activator" icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list class="card-more">
        <v-list-tile @click="">
          <v-list-tile-title>공유하기</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>팔로우 취소</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>다운보트</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>신고하기</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'menu',
    data: function () {
      return {
        msg: 'hi'
      }
    },
    computed: {
      isLogin: function () {
        return this.$store.state.username !== null
      }
    },
    methods: {
    },
    mounted: function () {
      console.log('init menu')
      // console.log(this.isLogin)
    }
  }
</script>

<style scoped>

</style>
