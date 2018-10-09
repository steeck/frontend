<template>
  <v-layout align-center>
    <div>
      <v-avatar size="40">
        <v-img :src="'https://steemitimages.com/u/' + inAuthor + '/avatar/small'"></v-img>
      </v-avatar>
    </div>
    <div>
      <v-flex>
        <!--{{ type }}-->
        <v-flex xs12 v-if="type === 'author_reward'" class="pb-1">
          작성하신 <a :href="permlink(item.author, item.permlink)">게시글</a>의 보상으로 <span class="font-weight-bold">{{ item.sbd_payout }} SBD, {{ item.steem_payout }} STEEM, {{ sp(item.vesting_payout) }} SP</span>를 지급받았습니다.
        </v-flex>
        <v-flex xs12 v-if="type === 'curation_reward'" class="pb-1">
          <span class="font-weight-bold">{{ item.comment_author }}</span>님의 <a :href="permlink(item.comment_author, item.comment_permlink)">게시글</a>의 큐레이션 보상은 <span class="font-weight-bold">{{ sp(item.reward) }} SP</span> 입니다.
        </v-flex>
        <v-flex xs12 v-if="type === 'vote'" class="pb-1">
          <span class="font-weight-bold">{{ item.author }}</span>님의 <a :href="permlink(item.author, item.permlink)">게시글</a>에 {{ item.weight | vp }}% 보팅하셨습니다.
        </v-flex>
        <v-flex xs12 v-if="type === 'claim_reward_balance'" class="pb-1">
          <span class="font-weight-bold">{{ item.reward_sbd }} SBD, {{ item.reward_steem }} STEEM, {{ sp(item.reward_vests) }} SP</span>를 내 지갑으로 옮겼습니다.
        </v-flex>
        <v-flex xs12 v-if="type === 'comment'" class="pb-1">
          <div v-if="item.author === this.$store.state.username && item.parent_author !== ''">
            <span class="font-weight-bold">{{ item.parent_author }}</span>님에게 코멘트를 남겼습니다.
          </div>
          <div v-if="item.author === this.$store.state.username && item.parent_author === ''">
            <span> <a :href="permlink(item.author, item.permlink)">게시글</a>을 작성/수정 했습니다.</span>
          </div>
          <div v-if="item.author !== this.$store.state.username">
            <span class="font-weight-bold">{{ item.author }}</span>님이 코멘트를 남겼습니다.
          </div>
        </v-flex>
        <v-flex xs12 v-if="type === 'transfer'" class="pb-1">
          <div v-if="item.to === this.$store.state.username">
            <span class="font-weight-bold">{{ item.from }}</span>님이 <span class="font-weight-bold">{{ item.amount }}</span>을 송금하셨습니다.
          </div>
          <div v-else>
            <span class="font-weight-bold">{{ item.to }}</span>님에게 <span class="font-weight-bold">{{ item.amount }}</span>을 송금하셨습니다.
          </div>
        </v-flex>
        <v-flex xs12 v-if="type === 'transfer_to_vesting'" class="pb-1">
          <span class="font-weight-bold">{{ item.amount }}</span>만큼 스팀파워업 하였습니다.
        </v-flex>
        <v-flex xs12 v-if="type === 'custom_json'" class="pb-1">
          <div v-if="json.op === 'follow' && json.data.what[0]">
            <span class="font-weight-bold">{{ json.data.following }}</span>님의 {{ json.data.what[0] }}을/를 팔로우합니다.
          </div>
          <div v-else>
            <span class="font-weight-bold">{{ json.data.following }}</span>님을 언팔로우합니다.
          </div>
        </v-flex>

        <v-flex xs12 class="pt-0 activity-time">
          {{ data.timestamp | convdate | ago }}
        </v-flex>
      </v-flex>
    </div>
  </v-layout>
</template>

<script>
import steem from '@/services/steem'

export default {
  props: {
    name: 'activity',
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      item: {},
      json: {
        op: '',
        data: {}
      }
    }
  },
  filters: {
    vp: function (weight) {
      if (!weight) return
      return Math.round(weight / 100)
    }
  },
  mounted () {
    this.item = this.data.op[1]
    // const testOps = []
    // if (testOps.indexOf(this.type) !== -1) {
    //   console.log(this.type, this.data)
    // }
    // const customOp = ['follow']
    // if (this.type === 'custom_json' && customOp.indexOf(this.item.id) === -1) {
    //   console.log('custom_json', this.item.id)
    // }
    if (this.type === 'custom_json') {
      const tmp = JSON.parse(this.item.json)
      this.json.op = this.item.id
      this.json.data = tmp[1]
    }
  },
  computed: {
    inAuthor: function () {
      switch (this.type) {
        case 'vote':
        case 'author_reward':
          return this.item.author
        case 'curation_reward':
          return this.item.comment_author
        case 'comment':
          if (this.item.to === this.$store.state.username) {
            return this.item.from
          } else {
            return this.item.to
          }
        case 'transfer_to_vesting':
          return this.$store.state.username
        case 'custom_json':
          if (this.json.op === 'follow') {
            return this.json.data.following
          } else {
            return this.json.data.follower
          }
      }
    }
  },
  methods: {
    sp: function (vests) {
      return steem.formatter.vestToSteem(vests, this.$store.state.steemGlobalProperties.totalVestingShares, this.$store.state.steemGlobalProperties.totalVestingFund).toFixed(3)
    },
    permlink (author, permlink) {
      return 'https://steemit.com/@' + this.item.author + '/' + this.item.permlink
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../colorset";

  .activity-time {
    color: $colorNoneForce;
  }

</style>
