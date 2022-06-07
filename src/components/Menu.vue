<template>

    <v-app-bar
      app
      color="#e7e7e7"
      flat
    >

    <img src="../assets/images/logo-unitins.png" width="70px" height="50x" alt="">

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

      <!-- <v-btn @click.prevent="logout()" v-if="this.$store.state.loginUser"> 
          Sair
         <i class="fas fa-sign-out-alt"></i>
      </v-btn> -->

      <v-btn v-if="this.$store.state.loginUser" @click.prevent="logout">Sair</v-btn>

    </v-app-bar>


</template>


<script>
import router from '@/router/index'
import { removeItem } from '@/config/utils'

export default {
   name: 'signup_header',

  data: () => ({
    drawer: null,
    items: [
      { title: "Semestres", to: "/semestres"},
      { title: "Salas", to: "/salas" },
      { title: "Bloco", to: "/bloco" },
      { title: "Horários", to: "/horarios" },
      { title: "Curso", to: "/curso" },
      { title: "Câmpus", to: "/campus" },
      { title: "Usuários", to: "/usuarios" },
    ],
  }),

  methods: {
    logout() {
      removeItem('user')
      router.push('/login')
    }
  },

};
</script>