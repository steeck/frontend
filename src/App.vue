<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout'
import MainLayout from './layouts/MainLayout'
import CenterLayout from './layouts/CenterLayout'
import AppLayout from './layouts/AppLayout'
import SimpleLayout from './layouts/SimpleLayout'
export default {
  components: {
    'default-layout': DefaultLayout,
    'main-layout': MainLayout,
    'center-layout': CenterLayout,
    'app-layout': AppLayout,
    'simple-layout': SimpleLayout
  },
  created () {
  },
  computed: {
    layout () {
      return this.$store.state.layout
    }
  },
  methods: {
  }
}
</script>
