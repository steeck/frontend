<template>
  <div class="image-wrapper" :class="{ 'image-mobile': $vuetify.breakpoint.smAndDown }">
    <div class="image-inner"></div>
  </div>
</template>

<script>
export default {
  props: ['src'],
  mounted () {
    console.log(this.src)
    let el = this.$el.getElementsByClassName('image-inner')
    el[0].style.backgroundImage = `url(${this.src})`
  }
}
</script>

<style scoped>
.image-wrapper {
  background-color: #000;
  width: 100%;
  height: 500px;
}
.image-inner {
  background-size: contain;
  background-position: center;
  width: 100%;
  height: 100%;
}
.image-mobile {
  height: calc(100vw - 32px - 10px);
}
@media
</style>
