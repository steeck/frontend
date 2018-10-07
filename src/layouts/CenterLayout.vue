<template>
  <v-app id="inspire"
    class="white"
  >
    <navbar></navbar>
    <v-content>
      <center-toolbar></center-toolbar>
      <router-view></router-view>
    </v-content>
    <footbar></footbar>
  </v-app>
</template>

<script>
import Navbar from '@/components/common/Navbar'
import Footbar from '@/components/common/Footbar'
import CenterToolbar from '@/components/center/CenterToolbar'

export default {
  props: {
    source: String
  },
  components: {
    Navbar,
    Footbar,
    CenterToolbar
  }
}
</script>
