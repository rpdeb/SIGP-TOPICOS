<template>
  <v-data-table
    :headers="titulos"
    :items="campus"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
      'items-per-page-text': 'Itens por página',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Câmpus</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        >
        </v-text-field>
        <v-spacer></v-spacer>
        <v-select
          @change="filtrarPorAtivos"
          v-model="filtroSelecionado"
          :items="filtros"
        ></v-select>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }" class="template-add">
            <v-btn
              small
              class="mx-2 add"
              fab
              dark
              color="green"
              v-bind="attrs"
              v-on="on"
            >
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
                      <v-text-field
                        v-model="atributo.label"
                        label="Campus"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fechar">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar"
                >Salvar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja {{ mudarStatus }} este campus ?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fecharDesativar"
                >Não</v-btn
              >
              <v-btn small color="primary" dark @click="desativeItemConfirm"
                >Sim</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    campus: [],
    filtros: ["Ativos", "Todos"],
    filtroSelecionado: "Ativos",
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

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Campus" : "Editar Campus";
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

  mounted() {
    this.inicializar();
  },

  methods: {
    inicializar() {
      axios
        .get(`${baseApiUrl}api/campus/search?sort=asc&orderBy=label`)
        .then((res) => {
          this.campus = res.data.content.map((c) => {
            c.ativo = c.ativo ? "Ativo" : "Inativo";
            return c;
          });

          console.log(this.campus + "Array de campus");
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    filtrarPorAtivos() {
      if (this.filtroSelecionado === "Todos") {
         // const json = localStorage.getItem(userKey);
        // const jwt = JSON.parse(json);
        // axios.defaults.headers.common["Authorization"] = `Bearer ${jwt.token}`;
        axios
          .get(`${baseApiUrl}api/campus/search`)
          .then((res) => {
            this.campus = res.data.content
             .map((c) => {
              c.ativo = c.ativo ? "Ativo" : "Inativo";
              return c;
            });
            console.log("todos !!")
            console.log(res.data);
          }).catch((error) => {
          console.log(error);
        });
      } else {
       console.log("ativos !!")
       this.inicializar();
      }
    },

    editItem(item) {
      this.editIndice = this.campus.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.campus.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/campus/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Este campus foi desabilitado com sucesso !");
            console.warn("entrou no desativar");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/campus/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Este campus foi habilitado com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.fecharDesativar();
    },

    fechar() {
      this.dialog = false;
      this.$nextTick(() => {
        this.atributo = Object.assign({}, this.atributoPadrao);
        this.editIndice = -1;
      });
    },

    fecharDesativar() {
      this.dialogDesativar = false;
      this.$nextTick(() => {
        this.atributo = Object.assign({}, this.atributoPadrao);
        this.editIndice = -1;
      });
    },

    reloadPage: async function () {
      window.location.reload();
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/campus`, {
            id: this.atributo.id,
            label: this.atributo.label,
            ativo: this.atributo.ativo === "Ativo",
          })
          .then((res) => {
            alert("Os dados foram atualizados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
        Object.assign(this.campus[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/campus`, {
            label: this.atributo.label,
          })
          .then((res) => {
            this.campus = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        this.campus.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>