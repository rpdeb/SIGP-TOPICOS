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
        <v-select
          @change="filtrarPorAtivos"
          v-model="filtroSelecionado"
          :items="filtros"
        ></v-select>
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
              <span class="text-h5">Cadastrar Usuário</span>
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
                        v-model="atributo.perfis"
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
              >Deseja {{ mudarStatus }} este usuario ?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                small
                color="warning"
                dark
                @click="dialogDesativar = false"
              >
                Não</v-btn
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
      <v-icon small class="mr-2" @click="desativeItem(item)" color="red">
        mdi-power-standby
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
    titulos: [
      { text: "Email", value: "email" },
      { text: "Perfil", value: "tipo" },
      { text: "Campus", value: "campus.label" },
      { text: "Curso", value: "curso.label" },
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    perfis: ["Administrador", "Gestão Administrativa", "Coordenador de Curso"],
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
      email: "",
      tipo: 1,
      campus: null,
      curso: null,
      ativo: true,
    },

    atributoPadrao: {
      id: null,
      email: "",
      tipo: 1,
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
    dialogDesativar(val) {
      val || this.fecharDesativar();
    },
  },

  mounted() {
    this.getCursos();
    this.getCampus();
    this.inicializar();
  },

   methods: {
    async inicializar() {
      axios
        .get(`${baseApiUrl}api/usuario/search?filter=ativo`)
        .then((res) => {
          this.usuarios = res.data.content.map((s) => {
            s.ativo = s.ativo ? "Ativo" : "Inativo";
            return s;
          });
          console.log(this.usuarios + "Array de usuarios aqui")
        })
        .catch(console.warn("erro"));
    },

    filtrarPorAtivos() {
      if (this.filtroSelecionado === "Todos") {
        // const json = localStorage.getItem(userKey);
        // const jwt = JSON.parse(json);
        // axios.defaults.headers.common["Authorization"] = `Bearer ${jwt.token}`;
        axios
          .get(`${baseApiUrl}api/usuario/search`)
          .then((res) => {
            this.usuarios = res.data.content.map((c) => {
              c.ativo = c.ativo ? "Ativo" : "Inativo";
              return c;
            });
            console.log("todos !!");
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log("ativos !!");
        this.inicializar();
      }
    },
    //método para buscar campus existentes e preencher no array
    async getCampus() {
      const { data } = await this.axios.get(`${baseApiUrl}api/campus/search`);
      this.campusRaw = data;
      this.arraycampus = data.content;
      console.log(this.arraycampus + "array de campus aqui");
    },

    async getCursos() {
      const { data } = await this.axios.get(`${baseApiUrl}api/curso/search`);
      this.cursosRaw = data;
      this.arraycursos = data.content;
      console.log(this.arraycursos + "array de cursos aqui !!");
    },

    editItem(item) {
      this.editIndice = this.usuarios.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.usuarios.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/usuario/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Este usuario foi desabilitado com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/usuario/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Este usuario foi habilitado com sucesso !");
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

    async findCampus(id) {
      const { data } = await this.axios.get(`${baseApiUrl}api/campus/${id}`);
      this.campusRaw = data;
      this.arraycampus = data.content;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(this.arraycampus + "array de campus aqui !!");
    },

    reloadPage: async function () {
      window.location.reload();
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/usuario`, {
            id: this.atributo.id,
            email: this.atributo.email,
            tipo: Number(this.atributo.tipo),
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
            tipo: Number(this.atributo.tipo),
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
        console.log(this.atributo);
        this.usuarios.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>