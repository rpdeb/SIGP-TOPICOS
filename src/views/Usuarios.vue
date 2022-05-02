<template>
  <v-data-table
    :headers="titulos"
    :items="usuario"
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
            <p v-if="errors.length">
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
             </ul>
            </p>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                     <v-col cols="8" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.perfil"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Perfil"
                        required
                      ></v-text-field>
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
                      <v-text-field
                        v-model="atributo.campus"
                        :items="items"
                        label="Campus"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field
                        v-model="atributo.curso"
                        :items="items"
                        label="Curso"
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
              <v-btn 
              small color="primary" 
              class="mr-4"
              @click="checkForm">Salvar</v-btn>
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
               <v-btn small color="warning" dark @click="dialog=false">Não</v-btn>
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
export default {
  data: () => ({
    search: "",
    dialog: false,
    titulos: [
      {
        text: "Perfil",
        value: "perfil",
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

    errors: [],
    usuarios: [
      {
        perfil: "Gestão Adm.",
        login: "exemplo@unitins.br",
        campus: "Augustinópolis",
        curso: "Medicina",
      },
      {
        perfil: "Coordenador",
        login: "fredson@unitins.br",
        campus: "Palmas (Graciosa)",
        curso: "Sistemas de Inf.",
      },
      {
        perfil: "Administrador",
        login: "aldirlyra@unitins.br",
        campus: "Palmas (Graciosa)",
        curso: "Sistemas de Inf.",
      },
    ],

    perfil: [],
    login: [],
    campus: [],
    curso: [],
    editIndice: -1,

    atributo: {
      id: null,
      perfil: "",
      login: "",
      campus: "",
      curso: "",
      ativo: true,
    },

    atributoPadrao: {
      id: null,
      perfil: "",
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

  methods: {
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
          .patch(url + "/desativar/" + this.atributo.id, {
            ativo: false,
          })
          .then((res) => {
            this.salas = res.data;
            console.log(res.data);
            alert("Usuário desativado com sucesso!");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(url + "/ativar/" + this.atributo.id, {
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

    validaForm() {
      if (
        this.atributo.perfil &&
        this.atributo.login &&
        this.atributo.campus &&
        this.atributo.curso
      ) {
        this.salvar();
        return true;
      }

      this.errors = [];

      if (!this.atributo.perfil) {
        this.errors.push("O perfil é obrigatório.");
      }
      if (!this.atributo.login) {
        this.errors.push("O login é obrigatório.");
      }
    },

    fechar() {
      this.dialog = false;
      this.$nextTick(() => {
        this.atributo = Object.assign({}, this.atributoPadrao);
        this.editIndice = -1;
      });
    },
  },
};
</script>