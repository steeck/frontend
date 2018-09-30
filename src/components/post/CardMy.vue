<template>

  <v-card>
    <v-card-title primary-title>
      <div>
        <v-flex align-left>
          <v-avatar size="80" color="grey lighten-4" >
            <v-img :src="author.json_metadata.profile.profile_image" contain></v-img>
          </v-avatar>
          <v-flex d-inline-block>
            <div>{{ item.author }}</div>
            <div>time</div>
          </v-flex>
        </v-flex>
        <div class="headline">{{ item.root_title }}</div>
        <span class="grey--text">1,000 miles of wonder</span>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    name: 'CardMy',
    props: ['item'],
    data () {
      return {
        author: {
          json_metadata: {
            profile: {
              profile_image: 'https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png',
              about: 'Update about me',
              name: '',
              location: '',
              website: 'https://about.steeck.io',
              cover_image: ''
            }
          }
        }
      }
    },
    methods: {
      getAuthor () {
        let vm = this
        this.$client.database
          .call('get_accounts', [[this.item.author]])
          // .call('get_accounts', [['ura-soul']])
          .then(function (result) {
            console.log(result)
            result[0].json_metadata = Object.assign(vm.author.json_metadata, JSON.parse(result[0].json_metadata))
            vm.author = result[0]
            vm.author.created = vm.author.created.substr(0, 10).replace(/-/g, '/')
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    mounted () {
      console.log(this.item)
      this.getAuthor()
    }
  }
</script>

<style lang="scss" scoped>

</style>
