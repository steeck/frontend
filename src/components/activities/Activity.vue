<template>
  <v-card>
    <v-card-title>
      {{ type }}
      <div v-if="type === 'author_reward'">
       작성하신 <a :href="permlink(item.author, item.permlink)">게시글</a>의 보상으로 <span class="font-weight-bold">{{ item.sbd_payout }} SBD, {{ item.steem_payout }} STEEM, {{ sp(item.vesting_payout) }} SP</span>를 지급받았습니다.
      </div>
      <div v-if="type === 'curation_reward'">
        <span class="font-weight-bold">{{ item.comment_author }}</span>님의 <a :href="permlink(item.comment_author, item.comment_permlink)">게시글</a>의 큐레이션 보상은 <span class="font-weight-bold">{{ sp(item.reward) }} SP</span> 입니다.
      </div>
      <div v-if="type === 'vote'">
        <span class="font-weight-bold">{{ item.author }}</span>님의 <a :href="permlink(item.author, item.permlink)">게시글</a>에 {{ item.weight | vp }}% 보팅하셨습니다.
      </div>
      <div v-if="type === 'claim_reward_balance'">
        <span class="font-weight-bold">{{ item.reward_sbd }} SBD, {{ item.reward_steem }} STEEM, {{ sp(item.reward_vests) }} SP</span>를 내 지갑으로 옮겼습니다.
      </div>
      <div v-if="type === 'comment'">
        <div v-if="item.author === this.$store.state.username">
          <span class="font-weight-bold">{{ item.parent_author }}</span>님에게 코멘트를 남겼습니다.
        </div>
        <div v-else>
          <span class="font-weight-bold">{{ item.author }}</span>님이 코멘트를 남겼습니다.
        </div>
      </div>
      <div v-if="type === 'transfer'">
        <div v-if="item.to === this.$store.state.username">
          <span class="font-weight-bold">{{ item.from }}</span>님이 <span class="font-weight-bold">{{ item.amount }}</span>을 송금하셨습니다.
        </div>
        <div v-else>
          <span class="font-weight-bold">{{ item.to }}</span>님에게 <span class="font-weight-bold">{{ item.amount }}</span>을 송금하셨습니다.
        </div>
      </div>
      <div v-if="type === 'transfer_to_vesting'">
        <span class="font-weight-bold">{{ item.amount }}</span>만큼 스팀파워업 하였습니다.
      </div>
      <div v-if="type === 'custom_json'">
        <div v-if="json.op === 'follow'">
          <span class="font-weight-bold">{{ json.data.following }}</span>님의 {{ json.data.what[0] }}을/를 팔로우합니다.
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      {{ data.timestamp | convdate | ago }}
    </v-card-text>
  </v-card>
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
    this.$nextTick(function () {
      this.item = this.data.op[1]

      const testOps = []
      if (testOps.indexOf(this.type) !== -1) {
        console.log(this.type, this.data)
      }
      const customOp = ['follow']
      if (this.type === 'custom_json' && customOp.indexOf(this.item.id) === -1) {
        console.log('custom_json', this.item.id)
      }
      if (this.type === 'custom_json') {
        const tmp = JSON.parse(this.item.json)
        this.json.op = this.item.id
        this.json.data = tmp[1]
      }
    })
  },
  computed: {
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
