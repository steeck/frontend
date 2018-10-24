<template>
  <div class="progress-bar">
    <div class="progress-bar progress-bar__a">
      <template v-if="text && percent > 20">{{ text }}</template>
    </div>
    <div class="progress-bar progress-bar__background">
      <template v-if="text && percent <= 20">{{ text }}</template>
    </div>
  </div>
</template>
<style scoped>
.progress-bar {
  width: 100%;
  height: 20px;
  border-radius: 2px;
  position: relative;
}
.progress-bar.progress-bar__a {
  height: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  color: white;
}
.progress-bar.progress-bar__background {
  height: 100%;
  width: 100%;
  background-color: inherit;
  opacity: 0.2;
  position: absolute;
}
</style>
<script>
export default {
  props: ['height', 'percent', 'text', 'color'],
  mounted () {
    let color = '#1976D2'
    if (!this.percent) {
      this.percent = 100
    }
    if (this.color === 'dark') {
      color = '#283593'
    }
    var elA = document.getElementsByClassName('progress-bar__a')
    var elB = document.getElementsByClassName('progress-bar__background')
    elA[0].style.width = this.percent + '%'
    elA[0].style.backgroundColor = color
    elB[0].style.backgroundColor = color
  },
  watch: {
    percent () {
      this.setWidth()
    }
  },
  methods: {
    setWidth: function () {
      var elA = document.getElementsByClassName('progress-bar__a')
      elA[0].style.width = this.percent + '%'
    }
  }
}
</script>
