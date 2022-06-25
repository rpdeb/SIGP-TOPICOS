<template>
  <v-data-table
    :headers="titulos"
    :items="semestres"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
      'items-per-page-text': 'Itens por página',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Semestre</v-toolbar-title>
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
                        label="Semestre"
                        required
                        v-mask="'####/#'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="7">
                      <v-select
                        v-model="atributo.curso"
                        label="Curso"
                        item-text="label"
                        item-value="id"
                        :items="arraycursos"
                      >
                        ></v-select
                      >
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
              >Deseja {{ mudarStatus }} este Semestre ?</v-card-title
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
       <v-btn small class="mr-2" @click="criarOferta(item)" color="brown">
        Oferta
      </v-btn>
       <v-icon small class="mr-2" @click="editItem(item)" color="blue">
        mdi-pencil
      </v-icon>
      <v-icon small class="mr-2" @click="desativeItem(item)" color="red">
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
      {
        text: "Semestre",
        value: "label",
        sortable: false,
      },
      {
        text: "Curso",
        value: "curso.label",
        sortable: false,
      },
      { text: "Status", value: "ativo" },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    semestres: [],
    arraycursos:[],
    filtros: ["Ativos", "Todos"],
    filtroSelecionado: "Ativos",
    editIndice: -1,
    atributo: {
      id: null,
      label: "",
      curso: null,
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      label: "",
      curso: null,
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Semestre" : "Editar Semestre";
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
    this.getCursos();
  },

  methods: {
    inicializar() {
      axios
        .get(`${baseApiUrl}api/semestre/search?filter=ativo`)
        .then((res) => {
          this.semestres = res.data.content;
          console.log(this.semestres + "Array de Semestre");
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

     async getCursos() {
      const { data } = await this.axios.get(`${baseApiUrl}api/curso/search?sort=asc&orderBy=label`);
      this.arraycursos = data.content;
      console.log(this.arraycursos + "array de cursos aqui !!");
    },

    filtrarPorAtivos() {
      if (this.filtroSelecionado === "Todos") {
        // const json = localStorage.getItem(userKey);
        // const jwt = JSON.parse(json);
        // axios.defaults.headers.common["Authorization"] = `Bearer ${jwt.token}`;
        axios
          .get(`${baseApiUrl}api/semestre/search`)
          .then((res) => {
            this.semestres = res.data.content;
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.inicializar();
      }
    },

    editItem(item) {
      this.editIndice = this.semestres.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.semestres.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/semestre/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Este semestre foi desabilitado com sucesso !");
            console.warn("entrou no desativar");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/semestre/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Este semestre foi habilitado com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.fecharDesativar();
    },

    criarOferta(item){
      this.editIndice = this.semestres.indexOf(item);
      this.atributo = Object.assign({}, item);
      var obj = this.atributo.label;
      console.log(obj,"aquiii");
      this.$router.push('/oferta');
      console.log("sucessu");
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
          .put(`${baseApiUrl}api/semestre`, {
            id: this.atributo.id,
            label: this.atributo.label,
            curso: this.atributo.curso,
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
        Object.assign(this.semestres[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/semestre`, {
            label: this.atributo.label,
            curso: this.atributo.curso,
            ativo: true,
          })
          .then((res) => {
            this.semestres = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        this.semestres.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>