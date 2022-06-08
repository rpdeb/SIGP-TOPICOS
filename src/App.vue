<template>
  <div id="app">
    <HomeMenu v-if="notIsLoginPage"/>
     <!-- <v-main>
      <router-view />
    </v-main> -->
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
      return this.$route.name !== "login";
    },
  },
  
};
</script>
