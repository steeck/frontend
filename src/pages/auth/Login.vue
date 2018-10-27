<template>
  <h1 style="padding: 100px">Login...</h1>
</template>
<script>
export default {
  name: 'Login',
  async mounted () {
    if (!this.$store.state.auth.accessToken) {
      console.log('Try to login')
      let {access_token: accessToken, expires_in: tokenExpires, username} = this.$route.query
      console.log('username is', username)
      this.$store.commit('auth/login', {accessToken, tokenExpires, username})
      await this.$store.dispatch('me/getAccount')
      await this.$store.dispatch('me/getRC')
    } else {
      console.log('You are already logged on')
    }
    this.$router.push('/')
  }
}
</script>
