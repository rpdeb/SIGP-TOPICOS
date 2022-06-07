<template>
  <div id="app">
    <HomeMenu v-if="notIsLoginPage"/>
     <v-main>
      <router-view />
    </v-main>
    <v-footer color="#104ADF" >
          <strong>SIGHA - Sistema de Gerenciamento de Horários Acadêmicos</strong>
     </v-footer>
  </div>
</template>


<style scoped>
.logo-unitins {
  padding-top: 2.2%;
  width: 80%;
  height: 80%;
}

.fade-enter-active, .fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
<script>
import HomeMenu from "@/components/Menu";

export default {
  name: "vue_signup",

  components: {
    HomeMenu,
  },

  computed: {
    notIsLoginPage() {
      console.log(this.$route.name)
      return this.$route.name !== "Login";
    },
  },
  
};
</script>
