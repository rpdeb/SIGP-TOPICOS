<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#104ADF"
      flat
    >
      <v-container class="py-0 fill-height">
        <!-- <v-avatar
          class="mr-10"
          color="white"
          size="32"
        ></v-avatar> -->

        <v-btn
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
        TESTE
        </v-btn>

        <v-spacer></v-spacer>

      </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <router-view/>
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
          { title: 'Semestres', to:'/semestres' },
          { title: 'Salas', to:'/salas'  },
          { title: 'Usuários', to:'/usuarios'  },
          { title: 'Bloco', to:'/bloco'  },
          { title: 'Horários', to:'/horarios'  },
        ],

     
    }),
  }
</script>