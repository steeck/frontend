<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout'
import MainLayout from './layouts/MainLayout'
import AppLayout from './layouts/AppLayout'
import SimpleLayout from './layouts/SimpleLayout'
export default {
  mounted () {
    if (localStorage.getItem('user')) {
      this.$store.commit('steemconnect/setAccessToken', localStorage.getItem('access_token'))
      this.$store.commit('steemconnect/login', JSON.parse(localStorage.getItem('user')))
      this.$steemconnect.setAccessToken(this.$store.state.steemconnect.accessToken)
    }
  },
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  },
  components: {
    'default-layout': DefaultLayout,
    'main-layout': MainLayout,
    'app-layout': AppLayout,
    'simple-layout': SimpleLayout
  }
}
</script>
