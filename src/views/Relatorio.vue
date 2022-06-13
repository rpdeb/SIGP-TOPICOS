<template>
  <v-data-table :headers="titulos" :items="desserts" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página'
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Relatório</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>

        <v-select @input="redefinirTable" v-model="filtroSelecionado" :items="filtros" label="Filtro"></v-select>


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
      { text: "Carbs", value: "name", sortable: false },
      { text: "Curso", value: "label", sortable: false },
      { text: "Turno", value: "label", sortable: false },
      { text: "Tipo de Sala", value: "label", sortable: false },
      { text: "Ações", value: "acoes" },
    ],
    filtros: ['Todos','Sala', 'Curso', 'Periodo'],
    filtroSelecionado: "",
    relatorio: [],
    desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
          {
            name: 'Gingerbread',
            calories: 356,
            fat: 16.0,
            carbs: 49,
            protein: 3.9,
            iron: '16%',
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
          },
          {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
            iron: '45%',
          },
          {
            name: 'Donut',
            calories: 452,
            fat: 25.0,
            carbs: 51,
            protein: 4.9,
            iron: '22%',
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
          },
        ],
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

    redefinirTable() {
      if (this.filtroSelecionado === "Todos") {
       this.inicializar();
      } else if(this.filtroSelecionado === "Sala"){
        axios.get(`${baseApiUrl}api/oferta/search?filter=sala`, this.relatorio).then((res) => {
          this.relatorio = res.data;
        });
      }
      else if(this.filtroSelecionado === "Curso"){
        axios.get(`${baseApiUrl}api/oferta/search?filter=curso`, this.relatorio).then((res) => {
          this.relatorio = res.data;
        });
      }
      else {
        axios.get(`${baseApiUrl}api/oferta/search?filter=periodo`, this.relatorio).then((res) => {
          this.relatorio = res.data;
        });
      }
    },
  },
};
</script>