<template>
  <v-footer height="auto" color="white" v-scroll="onScroll">
    <v-fab-transition>
      <v-btn fab dark bottom right fixed color="primary" v-show="isBtnView" @click="scrollToTop">
        <v-icon dark>keyboard_arrow_up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-footer>
</template>

<script>
  export default {
    data: function () {
      return {
        offsetTop: 0
      }
    },
    computed: {
      isBtnView: function () {
        return this.offsetTop > 10
      }
    },
    methods: {
      onScroll: function (e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      },
      scrollToTop: function () {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }
</script>
