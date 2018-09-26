<template>
  <v-app id="inspire"
    class="white"
  >
    <navbar></navbar>
    <v-content>
      <main-toolbar></main-toolbar>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <footbar></footbar>
  </v-app>
</template>

<script>
import Navbar from '@/components/common/Navbar'
import Footbar from '@/components/common/Footbar'
import MainToolbar from '@/components/MainToolbar'

export default {
  props: {
    source: String
  },
  components: {
    Navbar,
    Footbar,
    MainToolbar
  }
}
</script>
