<template>
  <v-data-table :headers="titulos" :items="salas" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página',
  }">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Sala</v-toolbar-title>
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
                    <v-col cols="8" sm="6" md="5">
                      <v-text-field v-model="atributo.label" label="Sala" required></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="5" md="5">
                      <v-select v-model="atributo.tipo" label="Tipo de Sala" :items="tiposdesala" item-text="label"
                        item-value="id" @input="selecionarTipoSala">
                        ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="5">
                      <v-select v-model="atributo.bloco" label="Bloco/Piso" item-text="label" item-value="id"
                        :items="arrayBlocos">
                        ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="5">
                      <v-text-field v-model="atributo.capacidade" label="Capacidade" type="number"></v-text-field>
                    </v-col>

                    <v-col cols="8" sm="30" md="40">
                      <v-text-field v-model="atributo.estruturaFisica" label="Estrutura Física"></v-text-field>
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
    <template v-slot:[`item.acoes`]="{ item }">
      <v-icon small class="mr-2" @click="detalharItem(item)" color="brown">mdi-eye</v-icon>
      <v-icon small class="mr-2" @click="editItem(item)" color="blue">
        mdi-pencil
      </v-icon>
      <v-icon small @click="desativeItem(item)" color="red">
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
    dialogDesativar: false,
    dialogDetalhar: false,
    titulos: [
      { text: "Sala", value: "label" },
      { text: "Tipo de Sala", value: "tipo" },
      { text: "Bloco/Piso", value: "bloco.label" },
      { text: "Capacidade", value: "capacidade" },
      //{ text: "Estrutura Física", value: "estruturaFisica" },
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    //tiposdesala: [{id:"0", label:"Sala"}, {id:"1", label:"Laboratório de Informática"}],
    tiposdesala: [
      "Sala",
      "Laboratório de Informática",
      "Laboratório de Ciências",
    ],
    tipodesalaselecionado: null,
    salas: [],
    blocos: [],
    blocosRaw: [],
    arrayBlocos: [],
    editIndice: -1,
    atributo: {
      id: null,
      label: "",
      capacidade: null,
      bloco: null,
      estruturaFisica: null,
      tipo: null,
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      label: "",
      capacidade: null,
      bloco: null,
      estruturaFisica: null,
      tipo: null,
      ativo: true,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Sala" : "Editar Sala";
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
    this.getBlocos();
  },

  methods: {
    async inicializar() {
      axios
        .get(`${baseApiUrl}api/sala/search`)
        .then((res) => {
          this.salas = res.data.content.map((s) => {
            s.ativo = s.ativo ? "Ativo" : "Inativo";
            return s;
          });
          console.log(this.blocos + "Array de Sala");
        })
        .catch(console.warn("erro"));
    },

    detalharItem(item) {
      this.editIndice = this.salas.indexOf(item);
      this.atributo = Object.assign({}, item);
      var id = this.atributo.estruturaFisica;
      axios.get(`${baseApiUrl}api/sala/` + id).then((res) => {
        this.atributo.estruturaFisica = res.data;
      });

      this.dialogDetalhar = true;
    },

    async getBlocos() {
      const { data } = await this.axios.get(`${baseApiUrl}api/bloco/search`);
      this.blocosRaw = data;
      this.arrayBlocos = data.content;
      console.log(this.arrayBlocos + "array de blocos aqui");
    },

    editItem(item) {
      this.editIndice = this.salas.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.salas.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/sala/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Esta sala foi desabilitado com sucesso !");
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .patch(`${baseApiUrl}api/sala/${this.atributo.id}/${true}`)
          .then((res) => {
            console.log(res.data);
            alert("Esta sala foi habilitado com sucesso !");
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

    reloadPage: async function () {
      window.location.reload();
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

    async findBloco(id) {
      const { data } = await this.axios.get(`${baseApiUrl}api/bloco/${id}`);
      this.blocosRaw = data;
      this.arrayBlocos = data.content;
      //this.arraycampus = data.filter((d) => d.label);
      console.log(this.arrayBlocos + "array de blocos aqui !!");
    },

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/sala`, {
            id: this.atributo.id,
            label: this.atributo.label,
            capacidade: this.atributo.capacidade,
            bloco: this.atributo.bloco,
            estruturaFisica: this.atributo.estruturaFisica,
            tipo: this.atributo.tipo,
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
        Object.assign(this.salas[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/sala`, {
            label: this.atributo.label,
            capacidade: this.atributo.capacidade,
            bloco: this.atributo.bloco,
            estruturaFisica: this.atributo.estruturaFisica,
            tipo: this.atributo.tipo,
            ativo: true,
          })
          .then((res) => {
            this.salas = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          });
        console.log(this.atributo);
        this.salas.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>