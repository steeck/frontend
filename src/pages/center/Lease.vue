<template>
  <v-container grid-list-xl>
    <div class="my-profile text-xs-center">
      SP : 
    </div>
    <div>
      Delegatee : <input type="text" v-model="data.to">
    </div>
    <div>
      보낼SP : <input type="text" v-model="data.amount">
    </div>
    <div>
      Active Key : <input type="text" v-model="data.wif">
    </div>
    <div>
      임대기간 : <input type="text" v-model="data.weeks">
    </div>
    <div>
      예상수익
    </div>
    <div>
      사용자 동의 <input type="checkbox">
    </div>
    <div>
      약관...<br>...
    </div>
  </v-container>
</template>

<style scoped>
.my-profile {
  border: 0.5px solid #c3c3c3;
  padding-top: 15px;
  padding-bottom: 20px;
}
.my-me-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #425363;
}
.my-me-about {
  font-size: .9rem;
  color: #989898;
}
.my-me-follow-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #425363;
}
.my-me-follow-text {
  color: #425363;
}
.my-me-created {
  color: #425363;
}
.my-me-link a {
  color: #425363;
}
</style>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  components: {
  },
  created () {
  },
  mounted () {
    this.$nextTick(function () {

    })
  },
  computed: {
  },
  methods: {
  }
}
</script>
