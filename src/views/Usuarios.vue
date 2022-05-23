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
        <v-dialog v-model="dialog" max-width="400px">
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
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.email"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Email"
                        type="email"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.tipo"
                        @input="selecionarPerfil"
                        :items="perfis"
                        :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Perfil"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.campus"
                        :items="arraycampus"
                        item-value="id"
                        item-text="label"
                        label="Campus"
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.curso"
                        :items="arraycursos"
                        item-value="id"
                        item-text="label"
                        label="Curso"
                      ></v-select>
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
              <v-btn small color="primary" class="mr-4" @click="salvar"
                >Salvar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja {{ mudarStatus }} este usuário?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialogDesativar = false"
                >Não</v-btn
              >
              <v-btn
                small
                color="primary"
                class="mr-4"
                @click="desativeItemConfirm"
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
    titulos: [
      {
        text: "Perfil",
        value: "tipo",
        sortable: false,
      },
      {
        text: "Email",
        value: "email",
        sortable: false,
      },
      {
        text: "Campus",
        value: "campus.label",
        sortable: false,
      },
      {
        text: "Curso",
        value: "curso.label",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    usuarios: [],
    perfis: ["Admin", "Gestão Administrativa", "Coordenador de Curso"],
    perfilSelecionado: null,
    idperfil: null,
    arraycampus: [],
    arraycursos: [],
    cursosRaw: [],
    campusRaw: [],
    editIndice: -1,
    atributo: {
      id: null,
      tipo: null,
      email: "",
      campus: null,
      curso: null,
      ativo: true,
    },

    atributoPadrao: {
      id: null,
      tipo: null,
      email: "",
      campus: null,
      curso: null,
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Usuário" : "Editar Dados";
    },
    mudarStatus() {
      return this.atributo.ativo == "Ativo" ? "desativar " : "ativar ";
    },
  },

  watch: {
    dialog(val) {
      val || this.fechar();
    },
  },

  mounted() {
    this.inicializar();
    this.getCampus();
    this.getCursos();
  },

  methods: {
    async inicializar() {
      this.axios
        .get(`${baseApiUrl}api/usuario/search`)
        .then((res) => {
          this.usuarios = res.data.map((d) => ({
            ...d,
            campus: d.campus.map((a) => a.label), 
            curso: d.curso.map((c) => c.label),
          }));
          console.log(this.usuarios + "array de usuários !!");
        })
        .catch((error) => {
          console.log(error);
        });
      //await Promise.all([this.getCampus(), this.getCursos()]);
    },

    async getCampus() {
      const { data } = await this.axios.get(`${baseApiUrl}api/campus/search`);
      this.campusRaw = data;
      this.arraycampus = data.content;
      console.log(this.arraycampus + " array de campus aqui !!");
    },

    async getCursos() {
      const { data } = await this.axios.get(`${baseApiUrl}api/curso/search`);
      this.cursosRaw = data;
      this.arraycursos = data.content;
      //console.log(this.arraycursos + "array de cursos aqui !!");
    },

    obterItem(item){
      this.editIndice = this.usuarios.indexOf(item);
      this.atributo = Object.assign({}, item);
    },

    editItem(item) {
     this.obterItem();
     this.dialog = true;
    },

    desativeItem(item) {
      this.obterItem();
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo) {
        axios;
        patch(`${baseApiUrl}api/usuario/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Usuário desabilitado com sucesso!");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/usuario/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Usuário habilitado com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.fecharDesativar();
    },

   fecharDialog() {
      this.$nextTick(() => {
        this.atributo = Object.assign({}, this.atributoPadrao);
        this.editIndice = -1;
      });
    },

    fechar() {
      this.dialog = false;
      this.fecharDialog();
    },

    fecharDesativar() {
      this.dialogDesativar = false;
      this.fecharDialog();
    },

    selecionarPerfil() {
      switch (this.perfilSelecionado) {
        case "Admin":
          this.tipo = 1;
          break;
        case "Coordenador de Curso":
          this.tipo = 2;
          break;
        case "Gestão Administrativa":
          this.tipo = 3;
          break;
        default:
          this.tipo = 0;
      }
      /* if (this.perfilSelecionado === "Admin") {
         this.tipo = 1;
      } else if (this.perfilSelecionado === "Coordenador de Curso") {
        this.tipo = 2;
      } else if (this.perfilSelecionado === "Gestão Administrativa") {
        this.tipo = 3;
      }else{
         this.tipo = 0;
      } 
    */
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/usuario`, {
            id: this.atributo.id,
            email: this.atributo.email,
            tipo: this.atributo.tipo,
            campus: this.atributo.campus,
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
        Object.assign(this.usuarios[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/usuario`, {
            email: this.atributo.email,
            tipo: this.atributo.tipo,
            campus: this.atributo.campus,
            curso: this.atributo.curso,
            ativo: true,
          })
          .then((res) => {
            this.usuarios = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        this.usuarios.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>