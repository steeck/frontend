<template>
  <div>
    <user-profile :name="'smtion'"></user-profile>
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

