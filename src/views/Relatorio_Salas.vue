<template>
  <v-data-table :headers="titulos" :items="oferta" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página',
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Oferta</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line hide-details>
        </v-text-field>
        <v-spacer></v-spacer>
        <v-select
          @change="filtrarPorAtivos" 
          v-model="filtroSelecionado"
          :items="filtros"
        ></v-select>
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
                    <v-col cols="8" sm="5" md="5">
                      <v-select v-model="atributo.carbs" label="Nome" type="label"
                        >
                        ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="5">
                      <v-select v-model="atributo.curso" label="Curso" item-text="label" item-value="id"
                        :items="arrayBlocos">
                        ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="5">
                      <v-text-field v-model="atributo.turno" label="Turno" type="label"></v-text-field>
                    </v-col>

                    <v-col cols="8" sm="5" md="5">
                      <v-select v-model="atributo.tipo" label="Tipo de Sala" :items="tiposdesala" item-text="label"
                        item-value="id" @input="selecionarTipoSala">
                        ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog = false">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDetalhar" max-width="700px">
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="align-center">Estrutura Física</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ atributo.estruturaFisica }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja {{ mudarStatus }} esta sala ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog = false">
                Não</v-btn>
              <v-btn small color="primary" dark @click="desativeItemConfirm">Sim</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    
        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja {{ mudarStatus }} esta oferta ?</v-card-title
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
      { text: "Carbs", value: "nome", sortable: false },
      { text: "Curso", value: "label", sortable: false },
      { text: "Turno", value: "label", sortable: false },
      { text: "Tipo de Sala", value: "label", sortable: false },
      { text: "Ações", value: "acoes" },
    ],
    filtros: ['Todos','Sala', 'Curso', 'Periodo'],
    turnos: ["matutino", "vespertino", "noturno"],
    tiposdesala: [{id:"1", label:"Sala"}, {id:"2", label:"Laboratório de Informática"}],
    curso: ["S.I", "Direito", "Agronomia"],
    tipodesalaselecionado: null,
    filtroSelecionado: "",
    cursosRaw: [],
    relatorio: [],

    atributo:{

    id: null,
    carbs: null,
    curso: null,
    turno: null,
    tipo: 1,
    ativo: true,
    },

    atributoPadrao:{
      id: null,
    carbs: null,
    curso: null,
    turno: null,
    tipo: 1,
    },
    ativo: true,
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
    this.inicializar();
  },

  methods: {
    async inicializar() {
      axios
        .get(`${baseApiUrl}api/oferta/search?filter=ativo`)
        .then((res) => {
          this.oferta = res.data.content.map((s) => {
            s.ativo = s.ativo ? "Ativo" : "Inativo";
            return s;
          });
          console.log(this.oferta + "Array de oferta aqui")
        })
        .catch(console.warn("erro"));
    },

    filtrarPorAtivos() {
      if (this.filtroSelecionado === "Todos") {
        // const json = localStorage.getItem(userKey);
        // const jwt = JSON.parse(json);
        // axios.defaults.headers.common["Authorization"] = `Bearer ${jwt.token}`;
        axios.get(`${baseApiUrl}api/sala/search`).then((res) => {
          this.salas = res.data.content
          .map((c) => {
              c.ativo = c.ativo ? "Ativo" : "Inativo";
              return c;
            });
          console.log("todos !!")
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        console.log("ativos !!")
        this.inicializar();
      }
    },

editItem(item) {
      this.editIndice = this.oferta.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.oferta.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/oferta/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Esta oferta foi desabilitada com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/oferta/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Esta oferta foi habilitada com sucesso !");
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

    selecionarTipoSala() {
      switch (this.tipodesalaselecionado) {
        case "Sala":
          this.tipo = 0;
          break;
        case "Laboratório de Informática":
          this.tipo = 1;
          break;
        case "Laboratório de Ciências":
          this.tipo = 2;
          break;
        default:
          this.tipo = 0;
      }
    },

    
    reloadPage: async function () {
      window.location.reload();
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/oferta`, {
            id: this.atributo.id,
            carbs: this.atributo.carbs,
            curso: this.atributo.curso,
            turno: this.atributo.turno,
            tipo: Number(this.atributo.tipo),
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
        Object.assign(this.oferta[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/oferta`, {
            carbs: this.atributo.carbs,
            curso: this.atributo.curso,
            turno: this.atributo.turno,
            tipo: Number(this.atributo.tipo),
            ativo: true,
          })
          .then((res) => {
            this.oferta = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        console.log(this.atributo);
        this.oferta.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>