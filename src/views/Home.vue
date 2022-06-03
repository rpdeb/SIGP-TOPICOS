<template>
  <div>
    <HomeMenu />
    <div class="">
      <div class="">
        <h2 class="">Login Success!</h2>
        <div>
          <div v-if="this.$store.state.loginUser.loginType == 'google'">
            <div class="">
              <p>Welcome {{this.$store.state.loginUser.google.user.name}} !</p>
              <p>Email Address: {{this.$store.state.loginUser.google.user.email}} !</p>
              <img :src="this.$store.state.loginUser.google.user.profileImage" />
              <p><b>Google Access Token- </b>{{this.$store.state.loginUser.google.auth.access_token}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeMenu from '@/components/Menu'

export default {
  name: 'home',
  components: {
    HomeMenu
  }
}
</script>
