<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <center>
          <img class="heading" src="../assets/images/logo-unitins.png" width="170px" height="130px" />
        </center>
        <h2 class="heading">Bem-vindo ao SIGHA</h2>
        
        <!-- <div class="form-fields">
          <input id="email" name="email" type="text" placeholder="Email Address">
        </div>
        <div class="form-fields">
          <input id="password" name="password" type="text" placeholder="Password">
        </div>
        <div class="form-fields">
          <button class="signIn" name="commit" type="submit">
            Sign In
          </button>
        </div> -->
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
