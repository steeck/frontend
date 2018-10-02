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
      await steemconnect.me((err, res) => {
        if (err) {
          // @TODO should implement for handling failed login
          console.error('Failed to login on steemconnect')
          alert('Failed to login on steemconnect')
        }

        this.$store.commit('SET_ACCOUNT', res.account)
        let {created} = res.account
        let {
          about = '',
          cover_image: coverImage = '',
          location = '',
          name = '',
          profile_image: profileImage = 'https://via.placeholder.com/100x100',
          website = ''
        } = JSON.parse(res.account.json_metadata)
        let profile = Object.assign({created}, {about, coverImage, location, name, profileImage, website})
        this.$store.commit('SET_PROFILE', profile)
      })
    } else {
      console.log('You are already logged on')
    }
    this.$router.push('/')
  }
}
</script>
