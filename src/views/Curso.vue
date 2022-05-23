<template>
  <v-data-table :headers="titulos" :items="cursos" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página'
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Curso</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="400px">
          <template v-slot:activator="{ on, attrs }" class="template-add">
            <v-btn small class="mx-2 add" fab dark color="green" v-bind="attrs" v-on="on">
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
                      <v-text-field v-model="atributo.label" label="Curso" required></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select v-model="atributo.campus" label="Campus" item-text="label" item-value=id
                        :items="arraycampus">
                        ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fechar">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja {{ mudarStatus }} esta Curso ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialogDesativar = false">
                Não</v-btn>
              <v-btn small color="primary" dark @click="desativeItemConfirm">Sim</v-btn>
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
import { baseApiUrl } from "@/global";
Vue.use(VueAxios, axios);

export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDesativar: false,
    dialogDetalhar: false,
    titulos: [
      { text: "Curso", value: "label" },
      { text: "Campus", value: "campus.label" },
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    cursos: [],
    arraycampus: [],
    editIndice: -1,
    atributo: {
      id: null,
      label: "",
      campus: null,
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      label: "",
      campus: null,
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Curso" : "Editar Curso";
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
  },

  methods: {
    //método para preencher o data table
    async inicializar() {
      axios.get(`${baseApiUrl}api/curso/search`).then((res) => {
        this.cursos = res.data.content;
        console.log(this.cursos + "Arrayyyy de Campussss");
      }).catch(console.warn("erro"));
    },
    //método para buscar campus existentes e preencher no array 
    async getCampus() {
      const { data } = await this.axios.get(`${baseApiUrl}api/campus/search`);
      this.cursosRaw = data;
      this.arraycampus = data.content;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(this.arraycampus + "array de campus aqui")
    },

    editItem(item) {
      this.editIndice = this.cursos.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.cursos.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/curso/${this.atributo.id}`, {
            ativo: false,
          })
          .then((res) => {
            this.cursos = res.data;
            console.log(res.data);
            alert("Esta sala foi desativada com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/curso/${this.atributo.id}`, {
            ativo: true,
          })
          .then((res) => {
            console.log(res.data);
            alert("Este curso foi ativado com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.fecharDesativar();
    },

    reloadPage() {
      window.location.reload();
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
      console.log(this.arraycampus+ "array de campus aqui !!");
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/curso`, {
            id: this.atributo.id,
            label: this.atributo.label,
            campus: this.atributo.campus,
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
        Object.assign(this.cursos[this.editIndice], this.atributo);
      } else {
        axios.post(`${baseApiUrl}api/curso`, {
          label: this.atributo.label,
          campus: this.atributo.campus,

        }).then((res) => {
          this.cursos = res.data;
          alert("Os dados foram adicionados com sucesso !");
          console.log(res.data);
          this.reloadPage();
        });
        console.log(this.atributo)
        this.cursos.push(this.atributo);

      }
      this.fechar();
    },
  },
};
</script>