<template>
  <v-data-table :headers="titulos" :items="relatorio" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página'
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Relatório</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
         
        <v-select
          @input="redefinirTable" 
          v-model="filtroSelecionado"
          :items="filtros"
          label="Filtro"
        ></v-select>

      </v-toolbar>
    </template>
    <template v-slot:[`item.acoes`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="blue">
        mdi-pencil
      </v-icon>
      <v-icon small @click="desativeItem(item)" color="red">
        mdi-power-standby
      </v-icon>
    </template>
  </v-data-table>
</template>

<!-- 
<style>

</style>
-->

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
import { baseApiUrl } from "@/global";

export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDesativar: false,
    dialogDetalhar: false,
    titulos: [
      { text: "Câmpus", value: "label" },
      { text: "Curso", value: "label" },
      { text: "Turno", value: "label" },
      { text: "Tipo de Sala", value: "label" },
      { text: "Ações", value: "acoes" },
    ],
    filtros:['Sala', 'Curso', 'Periodo'],
    filtroSelecionado:"",
    relatorio: [],
    editIndice: -1,
    atributo: {
      id: null,
      label: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      label: "",
      ativo: true,
    },
  }),

  mounted() {
    this.inicializar();
  },

  methods: {
    inicializar() {
      axios.get(`${baseApiUrl}api/oferta/search`).then((res) => {
        this.oferta = res.data.content;
      }).catch((error) => {
            console.log(error);
          });
    },
  },
};
</script>