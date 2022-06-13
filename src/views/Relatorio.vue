<template>
  <v-data-table :headers="titulos" :items="relatorio" :search="search" class="elevation-2 data-table" :footer-props="{
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

<<<<<<< Updated upstream
=======
        <v-spacer></v-spacer>
        
        <v-dialog v-model="dialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }" class="template-add">
            <v-btn small class="mx-2 add" fab dark color="green" v-bind="attrs" v-on="on">
              <v-icon dark> mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ tituloForm }}</span>
            </v-card-title>
            <!-- inserir mensagem para a interface -->
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.label" label="Campus"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fechar">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja {{ mudarStatus }} este Campus ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fecharDesativar">Não</v-btn>
              <v-btn small color="primary" dark @click="desativeItemConfirm">Sim</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
>>>>>>> Stashed changes
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
      { text: "Câmpus", value: "label", sortable: false },
      { text: "Curso", value: "label", sortable: false },
      { text: "Turno", value: "label", sortable: false },
      { text: "Tipo de Sala", value: "label", sortable: false },
      { text: "Ações", value: "acoes" },
    ],
    filtros: ['Todos','Sala', 'Curso', 'Periodo'],
    filtroSelecionado: "",
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

<<<<<<< Updated upstream
=======
  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Gerar Relatório" : "Editar Campus";
    },
    mudarStatus() {
      return this.atributo.ativo == "Ativo" ? "desativar " : "ativar ";
    },
  },

  watch: {
    dialog(val) {
      val || this.fechar();
    },

    dialogDesativar(val) {
      val || this.fecharDesativar();
    },
  },

>>>>>>> Stashed changes
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