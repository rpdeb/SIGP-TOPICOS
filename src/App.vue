<template>
   <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app color="#f1f1f1">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> SIGHA </v-list-item-title>
          <v-list-item-subtitle>
            Sistema Gerencial 
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="#f1f1f1">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title
        ></v-app-bar-title>

      <v-spacer></v-spacer>
      <!-- <img src="../assets/img/exit-to-aplicativo.png" class="sair" />
      <router-link :to="{ name: 'Login' }"></router-link> -->
      <v-btn @click="signout" v-if="btnlogout">sair</v-btn>
    
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer
    color="#104ADF"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
     
      <v-col
        class="py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>SIGHA - Sistema de gerenciamento de horários acadêmicos</strong>
      </v-col>
    </v-row>
  </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      items: [
          { title: 'Login',icon: "mdi-login",to:'/newlogin'},
          { title: 'Semestres',icon: "mdi-sort-calendar-ascending", to:'/semestres'},
          { title: 'Salas',icon: "mdi-google-classroom",to:'/salas'},
          { title: 'Usuários', icon: "mdi-account-group", to:'/usuarios'},
          { title: 'Bloco', icon: "mdi-lan", to:'/bloco'},
          { title: 'Horários', icon: "mdi-book-clock", to:'/horarios'},
          { title: 'Oferta', icon: "mdi-offer", to:'/oferta'},
        ],
    }),
  }
</script>