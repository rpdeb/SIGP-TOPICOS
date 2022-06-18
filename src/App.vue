<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#e7e7e7"
      flat
      v-if="notIsLoginPage"
      
    >

    <img src="../src/assets/images/logo-unitins.png" width="70px" height="50x" alt="">

      <v-tabs
        centered
        class="ml-n9"
        color="#104ADF"
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
      { title: "Semestre", to: "/semestre"},
      { title: "Câmpus", to: "/campus" },
         { title: "Curso", to: "/curso" },
            { title: "Bloco", to: "/bloco" },
      { title: "Salas", to: "/salas" },
   
  
   
    
      { title: "Usuários", to: "/usuarios" },
      { title: "Relatórios", to: "/relatorio" },
      { title: "Relatórios Horarios", to: "/relatoriohorario" },
      { title: "Relatórios Labins", to: "/relatoriolabins" },
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
      return this.$route.name !== "login";
    }
  },
};
</script>