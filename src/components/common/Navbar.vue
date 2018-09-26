<template>
  <div>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      v-model="drawer"
      left
      app
    >
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="indigo" dark fixed app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Steeck <span class="v-toolbar__subtitle">스틱베타</span></v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="ml-5 hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn v-if="this.$store.state.steemconnect.user" href="/#/logout">로그아웃</v-btn>
      <v-btn v-else :href="$steemconnect.getLoginURL()">로그인</v-btn>
    </v-toolbar>
  </div>
</template>

<style scoped>
.v-toolbar__subtitle {
  font-size: 0.8em;
  padding-left: 0.4em;
}
</style>

<script>
export default {
  data: () => ({
    drawer: false
  })
}
</script>
