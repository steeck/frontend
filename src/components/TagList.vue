<template>
  <v-list class="item elevation-5">
    <v-list-tile
      v-for="item in items"
      :key="item.label"
      @click=""
    >
      <v-list-tile-content>
        <v-list-tile-title class="mx-3">{{ item.label }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { label: '핫이슈', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
        { label: '암호화폐', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
        { label: '패션·뷰티', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '라이프', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '여행', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '문화·예술', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '어학·강좌', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '차·테크', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '게임', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '푸드', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '공감·에세이', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        { label: '스폰서', icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' }
      ]
    }
  }
}
</script>
