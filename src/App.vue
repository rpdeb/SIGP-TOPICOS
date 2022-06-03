<template>
  <div id="app">
    <HomeMenu v-if="notIsLoginPage"/>
    <router-view />
  </div>
</template>
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
