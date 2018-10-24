<template>
  <v-toolbar
    flat
    height="48"
    class="main-toolbar"
  >
    <ul>
      <li v-bind:class="{ active: menu == 'Lease'}"><router-link to="/center/lease">스팀파워 빌리기</router-link></li>
      <li v-bind:class="{ active: menu == 'Delegate'}"><router-link to="/center/delegate">내 스팀파워 빌려주기</router-link></li>
      <li v-bind:class="{ active: menu == 'RequestVote'}"><router-link to="/center/request_vote">보팅 의뢰하기</router-link></li>
      <!-- <li v-bind:class="{ active: menu == 'Transactions'}"><router-link to="/center/transactions">내 거래현황보기</router-link></li> -->
    </ul>
  </v-toolbar>
</template>

<style scoped>
/* :class="{'main-toolbar__mt-sm': $vuetify.breakpoint.smAndDown}" */
.main-toolbar {
  border-bottom: 1px solid #ddd;
}
.main-toolbar__mt-sm {
  margin-top: 56px !important;
}
.main-toolbar ul {
  text-align: center;
  margin: 0 auto;
  padding-left: 0;
}
.main-toolbar ul li {
  list-style-type: none;
  float: left;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 1rem 1.5rem;
}
.main-toolbar ul li a {
  color: rgba(0,0,0,.87);
  text-decoration: none;
}
.main-toolbar .active {
  border-bottom: 2px solid #6633ff;
}
.main-toolbar .active a {
  font-weight: bold;
  color: #6633ff;
}
</style>

<script>
export default {
  data () {
    return {
      menu: ''
    }
  },
  mounted () {
    this.menu = this.$router.history.current.name
  },
  watch: {
    $route (to, from) {
      this.menu = to.name
    }
  }
}
</script>
