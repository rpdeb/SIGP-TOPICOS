<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#104ADF"
      flat
      v-if="notIsLoginPage"
    >

      <v-tabs
        centered
        class="ml-n9"
        color="#f1f1f1"
      >
        <v-tab
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-btn @click="logout()">
          Sair
         <i class="fas fa-sign-out-alt"></i>
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

   <v-footer color="#104ADF" padless>
      <v-row justify="center" no-gutters>
        <v-col class="py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong
            >SIGHA - Sistema de Gerenciamento de Horários Acadêmicos</strong
          >
        </v-col>
      </v-row>
    </v-footer>

  </v-app>
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
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: "Semestres", icon: "mdi-sort-calendar-ascending",to: "/semestres"},
      { title: "Salas", icon: "mdi-google-classroom", to: "/salas" },
      { title: "Usuários", icon: "mdi-account-group", to: "/usuarios" },
      { title: "Bloco", icon: "mdi-lan", to: "/bloco" },
      { title: "Horários", icon: "mdi-book-clock", to: "/horarios" },
      { title: "Curso", icon: "mdi-clock", to: "/curso" },
      { title: "Campus", icon: "mdi-home", to: "/campus" },
    ],
  }),

  methods: {
    logout() {
      localStorage.removeItem('authUser');
      this.$router.push({name: "login"});
    }
  },

  computed: {
    notIsLoginPage() {
      return this.$route.name !== "login" && this.$route.name !== "register";
    }
  },
};
</script>