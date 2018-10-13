<template>
  <h1 style="padding: 100px">Login...</h1>
</template>
<script>
import steemconnect from '@/services/steemconnect'

export default {
  name: 'Login',
  async mounted () {
    if (!this.$store.state.accessToken) {
      console.log('Try to login')
      let {access_token: accessToken, expires_in: tokenExpires, username} = this.$route.query
      this.$store.commit('LOGIN', {accessToken, tokenExpires, username})
      steemconnect.setAccessToken(accessToken)
      await this.$store.dispatch('me/getAccount')
    } else {
      console.log('You are already logged on')
    }
    this.$router.push('/')
  }
}
</script>
