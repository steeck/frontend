<template>
  <v-container grid-list-xl>
    <h3>총발행 {{ total | number }} STEECKY</h3>
    <v-data-table
      :headers="headers"
      :items="steecky"
      hide-actions
      class="elevation-1 mt-3"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.username }}</td>
        <td class="text-xs-center">{{ props.item.total | number }}</td>
        <td class="text-xs-center">{{ props.item.daily | number }}</td>
        <td class="text-xs-center">{{ props.item.post | number }}</td>
        <td class="text-xs-center">{{ props.item.vote | number }}</td>
        <td class="text-xs-center">{{ props.item.comment | number }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
.my-profile {
  border: 0.5px solid #c3c3c3;
  padding-top: 15px;
  padding-bottom: 20px;
}
.my-me-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #425363;
}
.my-me-about {
  font-size: .9rem;
  color: #989898;
}
.my-me-follow-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #425363;
}
.my-me-follow-text {
  color: #425363;
}
.my-me-created {
  color: #425363;
}
.my-me-link a {
  color: #425363;
}

.v-menu__content {
  background-color: #fff;
  padding-bottom: 8px;
}
</style>

<script>
import api from '@/api/center'
import steemutil from '@/mixins/steemutil'

export default {
  components: {
  },
  mixins: [steemutil],
  data () {
    return {
      headers: [
        {text: '', align: 'center', sortable: false, value: 'username'},
        {text: '총지급', align: 'center', sortable: false, value: 'total'},
        {text: '출석체크', align: 'center', sortable: false, value: 'daily'},
        {text: '스티커 작성', align: 'center', sortable: false, value: 'post'},
        {text: '보팅', align: 'center', sortable: false, value: 'vote'},
        {text: '댓글 작성', align: 'center', sortable: false, value: 'comment'}
      ],
      steecky: []
    }
  },
  mounted () {
    this.getSteecky()
  },
  computed: {
    total () {
      let t = 0
      this.steecky.forEach(item => {
        t += parseInt(item.total)
      })
      return t
    }
  },
  methods: {
    getSteecky: function () {
      let vm = this

      api.getSteecky().then(res => {
        vm.steecky = res.data
      })
    }
  }
}
</script>
