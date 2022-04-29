<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <v-img
          :src="require('../assets/visitantes.jpg')"
          class="my-1"
          contain
          height="110"
        />
        <h4 class="heading">Olá, visitante</h4>
        <div class="form-fields">
        </div>
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