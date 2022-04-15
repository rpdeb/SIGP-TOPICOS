<template>
  <div class="main-container">
    <form>
      <div class="box-container">
        <h2 class="heading">Olá, visitante</h2>
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