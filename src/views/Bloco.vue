<template>
  <v-data-table :headers="titulos" :items="blocos" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página'
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Bloco</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small class="mx-2 add" fab dark color="green" v-bind="attrs" v-on="on">
              <v-icon dark> mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar Bloco</span>
            </v-card-title>
            <!-- inserir mensagem para a interface -->
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.bloco" :rules="[v => !!v || 'Item obrigatório!']"
                        label="Bloco/Piso" required></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select v-model="atributo.campus" :items="arraycampus" item-value=id :rules="[v => !!v || 'Item obrigatório!']"
                        label="Campus" required></v-select>
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
              <v-btn small color="primary" class="mr-4" @click="salvar">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja remover este Bloco ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog = false">
                Não</v-btn>
              <v-btn small color="primary" dark @click="deleteItemConfirm">Sim</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.acoes`]="{ item }">
      <v-icon small class="mr-2" @click="deleteItem(item)" color="blue"> mdi-delete </v-icon>
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
import { baseApiUrl } from '@/global';
//Inserir importações
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    titulos: [
      {
        text: "Campus",
        value: "campus.label",
        sortable: false,
      },
      {
        text: "Bloco/Piso",
        value: "bloco",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    blocos: [],
    blocosRaw:[],
    arraycampus: [],
    editIndice: -1,
    atributo: {
      id: null,
      campus:null,
      bloco: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      bloco: "",
      campus: null,
      ativo: true,
    },
  }),

    watch: {
      dialog(val) {
        val || this.fechar();
      },
    },

  mounted() {
    this.inicializar();
    this.getCampus();
  },
  methods: {
    async inicializar() {
      axios.get(`${baseApiUrl}api/bloco/search`).then((res) => {
        this.blocos = res.data.content;
        console.log(this.blocos + "Arrayyyy de Blocossss");
      }).catch(console.warn("erro"));
    },
    //método para buscar campus existentes e preencher no array 
    async getCampus() {
      const { data } = await this.axios.get(`${baseApiUrl}api/campus/search`);
      this.blocosRaw = data;
      this.arraycampus = data.content;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(this.arraycampus + "array de campus aqui")
    },

    editItem(item) {
      this.editIndice = this.blocos.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

  

    desativeItem(item) {
      this.editIndice = this.blocos.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/blocos`, {
            ativo: false,
          })
          .then((res) => {
            console.log(res.data);
            alert("Este blocos foi desativado com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/blocos`, {
            ativo: true,
          })
          .then((res) => {
            console.log(res.data);
            alert("Esta blocos foi ativada com sucesso !");
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
      this.cursosRaw = data;
      this.arraycampus = data.content;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(this.arraycampus+ "array de campus aquii !");
    },

     reloadPage(){
      window.location.reload();
    },

    salvar() {
        axios
          .post(`${baseApiUrl}api/bloco`, {

          })
          .then((res) => {
            this.blocos = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        this.blocos.push(this.atributo);
      this.fechar();
    },
  },
};
</script>