<template>
  <v-data-table
    :headers="titulos"
    :items="ofertas"
    :search="search"
    class="elevation-2 data-table"
    :footer-props="{
      'items-per-page-text': 'Itens por página',
    }"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Oferta de Disciplina</v-toolbar-title>
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
          <template v-slot:activator="{ on, attrs }" class="template-add">
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
            <!-- inserir mensagem para a interface -->
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="8" sm="5" md="5">
                      <v-select
                        v-model="atributo.sala"
                        label="Sala"
                        item-text="label"
                        item-value="id"
                        :items="arraysalas"
                      ></v-select>
                      <v-select
                        v-model="atributo.semestre"
                        label="Semestre"
                        item-text="label"
                        item-value="id"
                        :items="arraysemestres"
                      ></v-select></v-col
                  ></v-row>
                </v-container>

                <v-container>
                  <v-row>
                    <v-col cols="8" sm="5" md="5">
                      <v-select
                        v-model="atributo.codPessoa"
                        label="Professor"
                        item-text="nome"
                        item-value="id"
                        :items="arrayprofessores"
                      ></v-select
                    ></v-col>
                  <v-col cols="8" sm="5" md="5">
                      <v-select
                        v-model="atributo.matriz"
                        label="Código de Disciplina"
                        item-text="matriz"
                        item-value="matriz"
                        :items="matrizes"
                      ></v-select
                    ></v-col>
                  </v-row>
                </v-container>
                <v-col cols="8" sm="5" md="5">
                  <v-select
                    v-model="diaSemana"
                    label="Dia da Semana"
                    item-text="diasDaSemana"
                    item-value="id"
                    :items="diasDaSemana"
                  />

                  <v-select
                    v-model="turno"
                    label="Turno"
                    item-text="turno"
                    item-value="turno"
                    :items="turnos"
                  />

                </v-col>
                <v-col cols="8" sm="5" md="5">
                  <v-container fluid>
                    <v-row>
                      <v-checkbox
                        v-model="horario1"
                        label="horario1"
                        value="horario1"
                        hide-details
                      ></v-checkbox>

                      <v-checkbox
                        v-model="horario2"
                        label="horario2"
                        value="horario2"
                        hide-details
                      ></v-checkbox>

                      <v-checkbox
                        v-model="horario3"
                        label="horario3"
                        value="horario3"
                        hide-details
                      ></v-checkbox>

                      <v-checkbox
                        v-model="horario4"
                        label="horario4"
                        value="horario4"
                        hide-details
                      ></v-checkbox>
                    </v-row>
                  </v-container>
                </v-col>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="fechar">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="salvar"
                >Salvar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja {{ mudarStatus }} este oferta ?</v-card-title
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
import { baseApiUrl } from "@/global";
Vue.use(VueAxios, axios);

export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDesativar: false,
    dialogDetalhar: false,
    titulos: [
      { text: "Disciplina", value: "label" },
      { text: "Sala", value: "sala.label" },
      { text: "Turno", value: "horario.turno" },
      { text: "Semestre", value: "semestre.label" },
      { text: "Professor", value: "professor.nome" },
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    ofertas: [],
    matrizes: [],
    salasRaw: [],
    arraysalas: [],
    arraysemestres: [],
    arraydisciplinas: [],
    arrayprofessores:[],
    turnos: ["MANHA", "TARDE", "NOITE"],
    diasDaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"],
    editIndice: -1,
    atributo: {
      id: null,
      horario: {
        horario1: true,
        horario2: true,
        horario3: true,
        horario4: true,
        turno: "",
        diaSemana: "",
      },
      disciplina: null,
      sala: null,
      codpesoa: null,
      codDiciplina: null,
      ativo: true,
      semestre: null,
    },
    atributoPadrao: {
      id: null,
      horario: {
        horario1: true,
        horario2: true,
        horario3: true,
        horario4: true,
        turno: "",
        diaSemana: "",
      },
      disciplina: null,
      sala: null,
      codpesoa: null,
      codDiciplina: null,
      ativo: true,
      semestre: null,
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar oferta" : "Editar oferta";
    },
    mudarStatus() {
      console.log(this.atributo);
      return this.atributo.ativo == true ? "desativar " : "ativar";
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

  props: {
    horario: {
      type: Object,
      default: function () {
        return {
          horario1: Boolean,
          horario2: Boolean,
          horario3: Boolean,
          horario4: Boolean,
          turno: "",
          diaSemana: "",
        };
      },
    },
  },

  mounted() {
    this.inicializar();
    this.getSalas();
    this.getSemestres();
    this.getProfessores();
    this.getDisciplinas();
  },

  methods: {
    //método para preencher o data table
    async inicializar() {
      axios
        .get(`${baseApiUrl}api/oferta/search`)
        .then((res) => {
          this.ofertas = res.data.content.map((c) => {
            c.ativo = c.ativo ? "Ativo" : "Inativo";
            return c;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getSalas() {
      const { data } = await this.axios.get(`${baseApiUrl}api/sala/search`);
      this.salasRaw = data;
      this.arraysalas = data.content;
      console.log(this.arraysalas + "array de sala aqui");
    },

    async getSemestres() {
      const { data } = await this.axios.get(`${baseApiUrl}api/semestre/search`);
      this.arraysemestres = data.content;
      console.log(this.arraysemestres + "array de semestre aqui");
    },

    async getProfessores() {
      const { data } = await this.axios.get(`${baseApiUrl}api/professor/getAll?porPagina=100&paginaAtual=0`);
      this.arrayprofessores = data.content;
      console.log(this.arrayprofessores + "array de semestre aqui");
    },

    async getDisciplinas() {
      const { data } = await this.axios.get(
        `${baseApiUrl}api/matriz/searchDisciplinaByMatriz`
      );
      this.arraydisciplinas = data.content;
      console.log(this.arraydisciplinas + "array de disciplinas aqui");
    },

     async getMatrizes() {
      const { data } = await this.axios.get(
        `${baseApiUrl}api/matriz/getAll?porPagina=100&paginaAtual=0`
      );
      this.matrizes = data.content;
      console.log(this.matrizes + "array de disciplinas aqui");
    },

    editItem(item) {
      this.editIndice = this.oferta.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialog = true;
    },

    desativeItem(item) {
      this.editIndice = this.ofertas.indexOf(item);
      this.atributo = Object.assign({}, item);
      this.dialogDesativar = true;
    },

    desativeItemConfirm() {
      if (this.atributo.ativo == "Ativo") {
        axios
          .patch(`${baseApiUrl}api/oferta/${this.atributo.id}/${false}`)
          .then((res) => {
            console.log(res.data);
            alert("Este oferta foi desabilitada com sucesso !");
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
            alert("Este oferta foi habilitada com sucesso !");
            this.reloadPage();
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

    salvar() {
      if (this.editIndice > -1) {
        axios
          .put(`${baseApiUrl}api/oferta`, {
            id: this.atributo.id,
            label: this.atributo.label,
            sala: this.atributo.sala,
            ativo: this.atributo.ativo === true,
          })
          .then((res) => {
            alert("Os dados foram atualizados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
        Object.assign(this.ofertas[this.editIndice], this.atributo);
      } else {
        axios
          .post(`${baseApiUrl}api/oferta`, {
            horario: {
              horario1: this.atributo.horario.horario1,
              horario2: this.atributo.horario.horario2,
              horario3: this.atributo.horario.horario3,
              horario4: this.atributo.horario.horario4,
              turno: this.atributo.horario.turno,
              diaSemana: this.atributo.horario.diaSemana,
            },
            disciplina: this.atributo.disciplina,
            sala: this.atributo.sala,
            codpesoa: this.atributo.codpesoa,
            codDiciplina: this.atributo.codDiciplina,
            ativo: this.atributo.ativo,
            semestre: this.atributo.semestre,
          })
          .then((res) => {
            this.ofertas = res.data;
            alert("Os dados foram adicionados com sucesso !");
            console.log(res.data);
            this.reloadPage();
          })
          .catch((error) => {
            console.log(error);
          });
        console.log(this.atributo);
        this.ofertas.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>