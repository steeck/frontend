<template>
  <component :is="component" :data="data" v-if="component"></component>
</template>

<script>
export default {
  props: {
    name: 'activity',
    type: {
      type: String,
      required: true
      // validator: (value) => ['syncing', 'synced', 'error'].includes(value);
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      component: null
    }
  },
  mounted () {
    this.getLoader()
  },
  methods: {
    getLoader: function () {
      // const allowed = ['comment', 'claim_reward_balance']
      const allowed = ['comment', 'claim_reward_balance', 'vote', 'transfer', 'curation_reward', 'transfer_to_vesting',
        'account_update', 'delegate_vesting_shares', 'account_create_with_delegation']
      if (allowed.indexOf(this.type) >= 0) {
        this.component = () => import(`@/components/activities/templates/${this.type}`)
      } else {
        console.log(this.type, this.data)
        this.component = () => import('@/components/activities/templates/default')
      }
    }
  }
}
</script>
