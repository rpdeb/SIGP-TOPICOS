<template>
  <v-data-table :headers="titulos" :items="semestres" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página',
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Semestres</v-toolbar-title>
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
              <span class="text-h5">{{ tituloForm }}</span>
            </v-card-title>
            <!-- <p v-if="errors.length">
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
             </ul>
            </p> -->
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <!--   <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.ano"
                        label="Ano"
                        required
                      ></v-select>
                    </v-col> -->
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.label" label="Semestre" required></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select v-model="atributo.oferta" :items="items" :rules="[(v) => !!v || 'Item obrigatório!']"
                        label="Oferta" required></v-select>
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

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja {{ mudarStatus }} este Campus ?</v-card-title>
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
        text: "Semestre",
        value: "label",
        sortable: false,
      },
      {
        text: "Oferta",
        value: "oferta",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    semestres: [],
    editIndice: -1,
    atributo: {
      id: null,
      label: "",
      oferta: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      label: "",
      oferta: "",
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
  },

  mounted() {
    this.inicializar();
  },

  methods: {
    inicializar() {
      axios
        .get(`${baseApiUrl}api/semestre/search`)
        .then((res) => {
          this.semestre = res.data;
          console.log(this.semestre + "Arrayyyy de Semestree");
        })
        .catch(console.warn("erro"));
    },

    editItem(item) {
      this.editIndice = this.semestres.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
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

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}/api/semestre`, {
            ativo: false,
          })
          .then((res) => {
            console.log(res.data);
            alert("Este semestre foi desativado com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}/api/semestre`, {
            ativo: true,
          })
          .then((res) => {
            console.log(res.data);
            alert("Esta semestre foi ativada com sucesso !");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.fecharDesativar();
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}/api/semestre`, {
            id: this.atributo.id,
            label: this.atributo.label,
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
        axios.post(`${baseApiUrl}/api/semestre`, {
          label: this.atributo.label,
          oferta: this.atributo.oferta
        }).then((res) => {
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