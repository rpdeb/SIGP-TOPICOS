<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <center>
          <img class="heading" src="../assets/images/logo-unitins.png" width="170px" height="130px" />
        </center>
        <h2 class="heading">Bem-vindo ao SIGHA</h2>
        <SocialLogin />
      </div>
    </form>
  </div>
</template>

<script>
import SocialLogin from '@/components/SocialLogin'
export default {
  name: 'login',
  components: {
    SocialLogin
  }
}
</script>
