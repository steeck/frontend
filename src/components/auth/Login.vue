<template>
  <!-- <h1>Login...</h1> -->
</template>
<script>
export default {
  name: 'Auth',
  async mounted () {
    let accessToken = this.$route.query['access_token']
    if (accessToken && !localStorage.getItem('access_token')) {
      localStorage.setItem('access_token', accessToken)
      await this.$store.dispatch('login')
      if (this.$store.state.steemconnect.user) localStorage.setItem('user', JSON.stringify(this.$store.state.steemconnect.user))
    }
    this.$router.push('/')
  }
}
</script>
