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
        <v-dialog v-model="dialog" max-width="800px">
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
            <v-card-text>
              <v-form ref="form">
                <v-container>
                  <v-row v-if="editIndice !== -1">
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.id"
                        label="Id"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.nome"
                        label="Nome"
                        :rules="[(v) => !!v || 'Nome é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.sobrenome"
                        label="Sobrenome"
                        :rules="[(v) => !!v || 'Sobrenome é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-mask="'###.###.###-##'"
                        v-model="atributo.cpf"
                        label="CPF"
                        :rules="[(v) => !!v || 'CPF é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.cnh"
                        label="CNH"
                        :rules="[(v) => !!v || 'CNH é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.dataDeNascimento"
                        :rules="[(v) => !!v || 'Data de Nascimento é obrigatória']"
                        label="Data de Nascimento"
                        type="date"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        v-model="atributo.genero"
                        :items="['Masculino', 'Feminino', 'Outro']"
                        :rules="[(v) => !!v || 'Gênero é obrigatório']"
                        label="Gênero"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-select
                        v-model="atributo.estadoCivil"
                        :items="['Solteiro', 'Casado', 'Divorciado', 'Viuvo', 'UniaoEstavel']"
                        :rules="[(v) => !!v || 'Estado Civil é obrigatório']"
                        label="Estado Civil"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                       v-model="atributo.departamento"
                       :items="['RH', 'Financeiro', 'Compras', 'Atendimento', 'Zeladoria']"
                        label="Departamento"
                        :rules="[(v) => !!v || 'Departamento é obrigatório']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                       v-model="atributo.turno"
                       :items="['Matutino', 'Vespertino', 'Noturno']"
                        label="Turno"
                        :rules="[(v) => !!v || 'Turno é obrigatório']"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="atributo.emailCorporativo"
                        label="Email Corporativo"
                        :rules="[
                          (v) => !!v || 'Email Corporativo é obrigatório',
                          (v) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-switch
                        v-model="atributo.ativo"
                        label="Ativo"
                      ></v-switch>
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

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { VueMaskDirective } from 'v-mask';

Vue.use(VueAxios, axios);
Vue.directive('mask', VueMaskDirective);

import { baseApiUrl } from "@/global";

export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDesativar: false,
    titulos: [
      { text: "Nome", value: "nome" },
      { text: "Sobrenome", value: "sobrenome" },
      { text: "Departamento", value: "departamento" },
      { text: "Turno", value: "turno" },
      { text: "Ações", value: "acoes" },
    ],
    funcionarios: [],
    editIndice: -1,
    atributo: {
      id: null,
      nome: "",
      sobrenome: "",
      cpf: "",
      cnh: "",
      dataDeNascimento: "",
      genero: "",
      estadoCivil: "",
      departamento: "",
      turno: "",
      emailCorporativo: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      nome: "",
      sobrenome: "",
      cpf: "",
      cnh: "",
      dataDeNascimento: "",
      genero: "",
      estadoCivil: "",
      departamento: "",
      turno: "",
      emailCorporativo: "",
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
      return this.atributo.ativo ? "desativar" : "ativar";
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
      const endpoint = this.atributo.ativo
        ? `${baseApiUrl}Funcionario/inativaFuncionario`
        : `${baseApiUrl}Funcionario`;
      axios
        .patch(endpoint, { id: this.atributo.id })
        .then((res) => {
          console.log(res.data);
          alert(`Este funcionário foi ${this.atributo.ativo ? "desativado" : "ativado"} com sucesso!`);
          this.reloadPage();
        })
        .catch((error) => {
          console.log(error);
        });
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

    reloadPage() {
      window.location.reload();
    },

    salvar() {
      if (this.$refs.form.validate()) {
        const endpoint = this.editIndice > -1
          ? `${baseApiUrl}Funcionario`
          : `${baseApiUrl}Funcionario`;
        const method = this.editIndice > -1 ? "put" : "post";
        axios[method](endpoint, this.atributo)
          .then((res) => {
            alert(`Os dados foram ${this.editIndice > -1 ? "atualizados" : "adicionados"} com sucesso!`);
            console.log(res.data);
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
        if (this.editIndice === -1) {
          this.funcionarios.push(this.atributo);
        }
        this.fechar();
      }
    },
  },
};
</script>

<style>
.data-table {
  max-height: 100vh;
  overflow: auto;
}
.template-add {
  display: flex;
  justify-content: flex-end;
}
</style>
