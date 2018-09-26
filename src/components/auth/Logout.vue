<template>

</template>
<script>
export default {
  name: 'Auth',
  mounted () {
    if (localStorage.getItem('access_token')) {
      this.$store.dispatch('steemconnect/logout')
      localStorage.removeItem('user')
    }
    this.$router.push('/')
  }
}
</script>
