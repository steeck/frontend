<template>
  <h1 style="padding: 100px">Logout...</h1>
</template>
<script>
import steemconnect from '@/services/steemconnect'

export default {
  name: 'Logout',
  async mounted () {
    if (this.$store.state.auth.accessToken) {
      console.log('Try to logout')
      steemconnect.setAccessToken(this.$store.state.auth.accessToken)
      await steemconnect.revokeToken((err, res) => {
        if (err) {
          console.log('Error', err)
        }
        if (res) {
          console.log('Res', res)
        }
        // this.$store.commit('LOGOUT')
        this.$store.commit('auth/logout')
        this.$store.commit('me/clear')
      })
    } else {
      console.log('You are already logged out')
    }
    this.$router.push('/')
  }
}
</script>
