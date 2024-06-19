<template>
  <v-data-table
    :headers="titulos"
    :items="funcionarios"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
      'items-per-page-text': 'Itens por página',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Funcionário</v-toolbar-title>
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
                        v-model="atributo.id"
                        label="Id"
                      ></v-text-field>
                      <v-text-field
                        v-model="atributo.nome"
                        label="Nome"
                      ></v-text-field>
                      <v-text-field
                        v-model="atributo.sobrenome"
                        label="Sobrenome"
                      ></v-text-field>
                      <v-text-field
                        v-model="atributo.departamento"
                        label="Departamento"
                      ></v-text-field>
                      <v-text-field
                        v-model="atributo.turno"
                        label="Turno"
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
              >Deseja {{ mudarStatus }} este funcionário ?</v-card-title
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
      { text: "Nome", value: "nome" },
      { text: "Sobrenome", value: "sobrenome" },
      { text: "Departamento", value: "departamento" },
      { text: "Turno", value: "turno" },
      { text: "Ações", value: "acoes" },
    ],
    funcionarios: [],
    filtros: ["Ativos", "Todos"],
    filtroSelecionado: "Ativos",
    editIndice: -1,
    atributo: {
      id: null,
      nome: "",
      sobrenome: "",
      departamento: "",
      turno: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      nome: "",
      sobrenome: "",
      departamento: "",
      turno: "",
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1
        ? "Cadastrar Funcionário"
        : "Editar Funcionário";
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
        .get(`${baseApiUrl}Funcionario`)
        .then((res) => {
          this.funcionarios = res.data.dados;

          console.log(this.funcionarios + "Array de funcionarios");
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    editItem(item) {
      this.editIndice = this.funcionarios.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.funcionarios.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == true) {
        axios
          .patch(`${baseApiUrl}Funcionario/inativaFuncionario`)
          .then((res) => {
            console.log(res.data);
            alert("Este funcionário foi desabilitado com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}Funcionario`)
          .then((res) => {
            console.log(res.data);
            alert("Este funcionario foi habilitado com sucesso !");
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
          .put(`${baseApiUrl}Funcionario`, {
            id: this.atributo.id,
            nome: this.atributo.nome,
            sobrenome: this.atributo.sobrenome,
            departamento: this.atributo.departamento,
            turno: this.atributo.turno,
            ativo: true
          })
          .then((res) => {
            alert("Os dados foram atualizados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
        Object.assign(this.funcionarios[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}Funcionario`, {
            nome: this.atributo.nome,
            sobrenome: this.atributo.sobrenome,
            departamento: this.atributo.departamento,
            turno: this.atributo.turno,
            ativo: true
          })
          .then((res) => {
            this.funcionarios = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        this.funcionarios.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>