<template>
  <v-card>
    <v-layout row>
     <v-flex xs7>
       <v-card-title primary-title>
         <div>
           <div class="headline">Halycon Days</div>
           <div>Ellie Goulding</div>
           <div>(2013)</div>
         </div>
       </v-card-title>
     </v-flex>
     <v-flex xs5>
       <v-img
         :src="item.src"
         height="125px"
         contain
       ></v-img>
     </v-flex>
   </v-layout>
    <v-divider light></v-divider>
    <v-card-actions class="pa-3">
      Rate this album
      <v-spacer></v-spacer>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
      <v-icon>star_border</v-icon>
    </v-card-actions>
  </v-card>
</template>

<style>
</style>

<script>
export default {
  props: ['item']
}
</script>
