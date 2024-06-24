<template>
  <v-data-table
    :headers="titulos"
    :items="usuarios"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
      'items-per-page-text': 'Itens por página',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Usuários</v-toolbar-title>
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
          <template v-slot:activator="{ on, attrs }">
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
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <h3>Informações Pessoais</h3>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.nome"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Nome"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.sobrenome"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Sobrenome"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.cpf"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="CPF"
                        required
                        v-mask="'###.###.###-##'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.rg"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="RG"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.cnh"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="CNH"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.dataDeNascimento"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Data de Nascimento"
                        type="date"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="atributo.genero"
                        :items="['Masculino', 'Feminino', 'Outro']"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Gênero"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="atributo.estadoCivil"
                        :items="['Solteiro', 'Casado', 'Divorciado', 'Viuvo', 'UniaoEstavel']"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Estado Civil"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.estadoDeOrigem"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Estado de Origem"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.cidadeDeOrigem"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Cidade de Origem"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <v-row>
                    <v-col cols="12">
                      <h3>Endereço</h3>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.cep"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="CEP"
                        required
                        v-mask="'#####-###'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.logradouro"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Logradouro"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.numero"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Número"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.complemento"
                        label="Complemento"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.bairro"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Bairro"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.estado"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Estado"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.cidade"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Cidade"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.endereco.pais"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="País"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <v-row>
                    <v-col cols="12">
                      <h3>Telefone</h3>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.telefone.codigoDeArea"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Código de Área"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.telefone.numero"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Número"
                        required
                        v-mask="'(##) #####-####'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fechar">
                Cancelar
              </v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">
              Deseja {{ mudarStatus }} este usuário?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialogDesativar = false">
                Não
              </v-btn>
              <v-btn small color="primary" dark @click="desativeItemConfirm">
                Sim
              </v-btn>
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
      <v-icon small class="mr-2" @click="deleteItem(item)" color="red">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<style>
.add {
  width: 40px;
  height: 40px;
}

.template-add {
  padding-top: 1%;
}

.data-table {
  padding: 3%;
}
</style>

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
    titulos: [
      { text: "ID", value: "id" },
      { text: "Nome", value: "nome" },
      { text: "Sobrenome", value: "sobrenome" },
      { text: "CPF", value: "cpf" },
      { text: "RG", value: "rg" },
      { text: "CNH", value: "cnh" },
      { text: "Data de Nascimento", value: "dataDeNascimento" },
      { text: "Gênero", value: "genero" },
      { text: "Estado Civil", value: "estadoCivil" },
      { text: "Estado de Origem", value: "estadoDeOrigem" },
      { text: "Cidade de Origem", value: "cidadeDeOrigem" },
      { text: "Endereço", value: "endereco.logradouro" },
      { text: "Telefone", value: "telefone.numero" },
      { text: "Ações", value: "acoes" },
    ],
    perfis: [
      { id: "1", label: "Administrador" },
      { id: "2", label: "Gestão Administrativa" },
      { id: "3", label: "Coordenador de Curso" },
    ],
    filtros: ["Ativos", "Todos"],
    filtroSelecionado: "Ativos",
    usuarios: [],
    perfilSelecionado: null,
    arraycampus: [],
    arraycursos: [],
    cursosRaw: [],
    campusRaw: [],
    editIndice: -1,
    atributo: {
      id: null,
      nome: "",
      sobrenome: "",
      cpf: "",
      rg: "",
      cnh: "",
      dataDeNascimento: "",
      genero: "",
      estadoCivil: "",
      estadoDeOrigem: "",
      cidadeDeOrigem: "",
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        estado: "",
        cidade: "",
        pais: "",
      },
      telefone: {
        codigoDeArea: "",
        numero: "",
      },
      ativo: true,
    },

    atributoPadrao: {
      id: null,
      nome: "",
      sobrenome: "",
      cpf: "",
      rg: "",
      cnh: "",
      dataDeNascimento: "",
      genero: "",
      estadoCivil: "",
      estadoDeOrigem: "",
      cidadeDeOrigem: "",
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        estado: "",
        cidade: "",
        pais: "",
      },
      telefone: {
        codigoDeArea: "",
        numero: "",
      },
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Usuário" : "Editar Dados";
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
    async inicializar() {
      axios
        .get(`${baseApiUrl}Pessoa`)
        .then((res) => {
          this.usuarios = res.data.dados.map((usuario) => ({
            ...usuario,
            endereco: usuario.endereco || {
              cep: "",
              logradouro: "",
              numero: "",
              complemento: "",
              bairro: "",
              estado: "",
              cidade: "",
              pais: "",
            },
            telefone: usuario.telefone || {
              codigoDeArea: "",
              numero: "",
            },
          }));
          console.log(this.usuarios + "Array de usuarios aqui");
        })
        .catch(console.warn("erro"));
    },

    editItem(item) {
      this.editIndice = this.usuarios.indexOf(item);
      this.atributo = JSON.parse(JSON.stringify(item));
      this.dialog = true;
    },

    deleteItem(item) {
      if (confirm(`Tem certeza que deseja apagar o usuário ${item.nome}?`)) {
        axios
          .delete(`${baseApiUrl}Pessoa/${item.id}`)
          .then((res) => {
            this.usuarios.splice(this.editIndice, 1);
            alert("Usuário apagado com sucesso!");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },


    fechar() {
      this.dialog = false;
      this.$nextTick(() => {
        this.atributo = JSON.parse(JSON.stringify(this.atributoPadrao));
        this.editIndice = -1;
      });
    },

    fecharDesativar() {
      this.dialogDesativar = false;
      this.$nextTick(() => {
        this.atributo = JSON.parse(JSON.stringify(this.atributoPadrao));
        this.editIndice = -1;
      });
    },

    reloadPage: async function () {
      window.location.reload();
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}Pessoa`, {
            id: this.atributo.id,
            nome: this.atributo.nome,
            sobrenome: this.atributo.sobrenome,
            cpf: this.atributo.cpf,
            rg: this.atributo.rg,
            cnh: this.atributo.cnh,
            dataDeNascimento: this.atributo.dataDeNascimento,
            genero: this.atributo.genero,
            estadoCivil: this.atributo.estadoCivil,
            estadoDeOrigem: this.atributo.estadoDeOrigem,
            cidadeDeOrigem: this.atributo.cidadeDeOrigem,
            endereco: this.atributo.endereco,
            telefone: this.atributo.telefone,
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
        Object.assign(this.usuarios[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}Pessoa`, {
            nome: this.atributo.nome,
            sobrenome: this.atributo.sobrenome,
            cpf: this.atributo.cpf,
            rg: this.atributo.rg,
            cnh: this.atributo.cnh,
            dataDeNascimento: this.atributo.dataDeNascimento,
            genero: this.atributo.genero,
            estadoCivil: this.atributo.estadoCivil,
            estadoDeOrigem: this.atributo.estadoDeOrigem,
            cidadeDeOrigem: this.atributo.cidadeDeOrigem,
            endereco: this.atributo.endereco,
            telefone: this.atributo.telefone,
            ativo: true,
          })
          .then((res) => {
            this.usuarios = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        console.log(this.atributo);
        this.usuarios.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>
