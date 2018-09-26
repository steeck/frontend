<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">Use Google's location service?</v-card-title>
      <v-card-text>
        Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="dialog = false"
        >
          Disagree
        </v-btn>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="dialog = false"
        >
          Agree
        </v-btn>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="vote"
        >
          Vote
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
export default {
  props: ['dialog', 'blog'],
  components: {
  },
  data () {
    return {
      value: 0
    }
  },
  mounted () {
    // console.log(this.blog)
  },
  methods: {
    vote: function () {
      let vote = {
        voter: this.$store.state.steemconnect.user.user,
        author: this.blog.content.author,
        permlink: this.blog.content.permlink,
        weight: 10000
      }
      this.$steemconnect.vote(vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
        if (!err) {
          console.log('ok')
        }
      })
    }
  }
}
</script>
