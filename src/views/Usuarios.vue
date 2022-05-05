<template>
  <v-data-table
    :headers="titulos"
    :items="usuarios"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
           'items-per-page-text':'produtos por página'
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
        ></v-text-field>
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
              ><v-icon dark> mdi-plus</v-icon></v-btn
            >
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
                      <v-select
                        v-model="atributo.tipo"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="tipo"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.login"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Login"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.campus"
                        :items="items"
                        label="Campus"
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.curso"
                        :items="items"
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
              <v-btn 
              small color="primary" 
              class="mr-4"
              @click="salvar">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

         <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja {{ mudarStatus }} este usuário? </v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
               <v-btn small color="warning" dark @click="dialogDesativar=false">Não</v-btn>
               <v-btn small color="primary" class="mr-4" @click="desativeItemConfirm">Sim</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.acoes`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="blue"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="desativeItem(item)" color="red"> mdi-power-standby </v-icon>
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
    titulos: [
      {
        text: "tipo",
        value: "tipo",
        sortable: false,
      },
      {
        text: "Login",
        value: "login",
        sortable: false,
      },
      {
        text: "Câmpus",
        value: "campus",
        sortable: false,
      },
      {
        text: "Curso",
        value: "curso",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    usuarios: [],
    tiposPerfil: [],
    login: [],
    campus: [],
    curso: [],
    editIndice: -1,
    atributo: {
      id: null,
      tipo: "",
      login: "",
      campus: "",
      curso: "",
      ativo: true,
    },

    atributoPadrao: {
      id: null,
      tipo: "",
      login: "",
      campus: "",
      curso: "",
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Usuário" : "Editar Dados";
    },
    mudarStatus() {
      return this.atributo.ativo == "Ativo" ? "desativar " : "ativar ";
    }
  },

  watch: {
    dialog(val) {
      val || this.fechar();
    },
  },

   mounted() {
    this.inicializar();
  },


  methods: {
      //método para preencher o data table
     async inicializar() {
      this.axios
        .get(`${baseApiUrl}api/usuario/search`)
        .then((res) => {
          this.cursos = res.data.map((d) => ({...d,campus: d.campus.map((a) => a.label),}))
             console.dir(res+"sucesuuu");
             console.dir(this.cursos+"segura papaiiii");
        })
        .catch((error) => {
          console.warn(error);
        });
      await Promise.all([this.getCampus()]);
    },
      //método para buscar campus existentes e preencher no array 
      async getCampus() {
      const { data } = await this.axios.get(`${baseApiUrl}api/usuario/search`);
      this.campusRaw = data;
      this.arraycampus = data;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(`${this.arraycampus}array de campus aquii !!!!!!!!!!!`)
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
        patch(`${baseApiUrl}api/usuario/${this.atributo.id}`, {
            ativo: false,
          })
          .then((res) => {
            this.usuarios = res.data;
            console.log(res.data);
            alert("Usuário desativado com sucesso!");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/usuarios/${this.atributo.id}`,{
            ativo: true,
          })
          .then((res) => {
            console.log(res.data);
            alert("Usuário ativado com sucesso !");
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

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/usuario`, {
            id: this.atributo.id,
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
        axios.post(`${baseApiUrl}api/usuario`, {
          label: this.atributo.label,
        }).then((res) => {
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