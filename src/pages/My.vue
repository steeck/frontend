<template>
  <div>
    <user-profile :name="$store.state.me.account.name"></user-profile>
  </div>
</template>

<script>
  import UserProfile from '@/pages/UserProfile'

  export default {
    name: 'My',
    components: {
      UserProfile
    }
  }
</script>

