<template>
    <div class="tab">
        <a href="#" v-if="this.$store.state.loginUser" @click.prevent="logout" class="tablinks">Logout</a>
        <router-link to="/newlogin" class="tablinks">Sign In</router-link>
        <router-link to="/newsignup" class="tablinks">Sign Up</router-link>
    </div>
</template>

<script>
import router from '@/router/router'
import { removeItem } from '@/config/utils'
export default {
  name: 'signup_header',
  methods: {
    logout () {
      removeItem('user')
      router.push('/newlogin')
    }
  }
}
</script>