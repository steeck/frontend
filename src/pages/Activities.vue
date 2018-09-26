<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        {{ date }}
        <v-btn>출석체크</v-btn>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<script>
export default {
  data () {
    return {
      date: '2018-04-04'
    }
  },
  components: {
  },
  mounted () {
    // console.log(this.$client.database)
    this.fetchBlog()
  },
  computed: {
    getDate: function () {

    }
  },
  methods: {
    fetchBlog: function () {
      // const query = {
      //   account: 'smtion'
      // }
      this.$client.database
        .getAccounts(['smtion'])
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log('Error occured' + err)
        })
    }
  }
}
</script>
