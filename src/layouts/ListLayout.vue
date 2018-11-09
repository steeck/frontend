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

<style scoped>
@media only screen and (min-width: 1904px) {
  .container {
    max-width: 772px !important;
  }
}
@media only screen and (min-width: 1264px) {
  .container {
    max-width: 772px;
  }
}
@media only screen and (max-width: 959px) {
  .container.fluid {
    padding: 16px 0;
  }
  .container {
    padding: 12px;
  }
}
</style>

<script>
import Navbar from '@/components/common/Navbar'
import Footbar from '@/components/common/Footbar'
import MainToolbar from '@/components/common/MainToolbar'

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
