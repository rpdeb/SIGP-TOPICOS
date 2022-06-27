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
        <v-col sm="2">
          <v-select
            @change="filtrarPorAtivos"
            v-model="filtroSelecionado"
            :items="filtros"
            item-text="Filtro"
            item-value="label"
          ></v-select>
        </v-col>
        <v-dialog v-model="dialog" max-width="1000px">
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
                <v-row>
                  <v-col sm="4">
                    <v-select
                      v-model="atributo.matriz"
                      label="Matriz"
                      item-text="matriz"
                      item-value="codMatriz"
                      onchange="getMatriz(nome)"
                      :items="arraymatriz"
                    ></v-select>
                  </v-col>
                  <v-col sm="4">
                    <v-select
                      v-model="atributo.disciplina"
                      label="Disciplina"
                      item-text="label"
                      item-value="codigoMatriz"
                      :items="arraydisciplinas"
                    ></v-select>
                  </v-col>
                  <v-col sm="4">
                    <v-select
                      v-model="atributo.codpesoa"
                      label="Professor"
                      item-text="nome"
                      item-value="codPessoa"
                      :items="arrayprofessores"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col sm="4">
                    <v-select
                      v-model="diaSemana"
                      label="Dia da Semana"
                      item-text="diasDaSemana"
                      item-value="id"
                      :items="diasDaSemana"
                    />
                  </v-col>

                  <v-col sm="4">
                    <v-select
                      v-model="atributo.turno"
                      label="Turno"
                      item-text="turno"
                      item-value="turno"
                      :items="turnos"
                    ></v-select>
                  </v-col>

                  <v-col sm="3" id="horario-style">
                    <v-select
                      v-model="horarios"
                      label="Horário"
                      item-text="diasDaSemana"
                      item-value="label"
                      :items="arrayoptionshora"
                      multiple
                    />
                    <v-btn small>
                      <v-icon
                        small
                        class="mr-2"
                        @click="adicionarHorarios()"
                        color="blue"
                      >
                        mdi-plus
                      </v-icon></v-btn
                    >
                  </v-col>
                </v-row>

                <v-row>
                  <!-- <v-col sm="4">
                    <v-label>Bloco-Sala</v-label>
                    <v-select
                      v-model="atributo.sala"
                      :items="arraysalas"
                      item-label="Bloco-Sala"
                      item-text="label"
                      :rules="[(v) => !!v || 'Campo Obrigatório']"
                      required
                    ></v-select>
                  </v-col> -->

                  <v-col sm="4">
                    <v-select
                      label="Salas"
                      v-bind:items="arraysalas"
                      v-model="atributo.sala"
                      item-text="`${label}, ${bloco.label}`"
                      item-value="id"
                      max-height="auto"
                      autocomplete
                    >
                      <template slot="selection" slot-scope="data">
                        {{ data.label }}, {{ data.bloco.label }}
                      </template>
                      <template slot="item" slot-scope="data">
                        <v-list-tile-content>
                          <v-list-tile-title
                            v-html="
                              `${data.item.label}, ${data.item.bloco.label}`
                            "
                          >
                          </v-list-tile-title>
                          <v-list-tile-sub-title
                            v-html="data.item.group"
                          ></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </template>
                    </v-select>
                  </v-col>
                  
                  <v-col sm="4">
                     <v-select
                      v-model="atributo.semestre"
                      label="Semestre"
                      item-value="id"
                      :items="semestreselecionado"
                    ></v-select>

                  </v-col>
                </v-row>
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


<style>
#horario-style {
  display: inline;
}
</style>


<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { baseApiUrl, semestreKey } from "@/global";
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
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    ofertas: [],
    salasRaw: [],
    arraybloco: [],
    arraysalas: [],
    horarios: [],
    arrayoptionshora: ["horario1", "horario2", "horario3", "horario4"],
    arraysemestres: [],
    semestreselecionado:'',
    arraydisciplinas: [],
    arraymatriz: [],
    arrayprofessores: [],
    turnos: ["MANHA", "TARDE", "NOITE"],
    diasDaSemana: ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"],
    filtros: ["Ativos", "Todos"],
    filtroSelecionado: "Ativos",
    editIndice: -1,
    atributo: {
      id: null,
      horario: {
        horario1: false,
        horario2: false,
        horario3: false,
        horario4: false,
        turno: "",
        diaSemana: "",
      },
      matriz: null,
      disciplina: null,
      sala: null,
      bloco: null,
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
      bloco: null,
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
    this.getBloco();
    this.getSemestres();
    this.getProfessores();
    this.getDisciplinas();
    this.getMatriz();
  },

  methods: {
    //método para preencher o data table
    async inicializar() {
      axios
        .get(
          `${baseApiUrl}api/oferta/search?filter=ativo&sort=asc&orderBy=disciplina`
        )
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
      const { data } = await this.axios.get(
        `${baseApiUrl}api/sala/search?sort=asc&orderBy=label`
      );
      this.salasRaw = data;
      this.arraysalas = data.content;
      console.log(this.arraysalas + "array de sala aqui");
    },

    async getBloco() {
      const { data } = await this.axios.get(
        `${baseApiUrl}api/bloco/search?sort=asc&orderBy=label`
      );
      this.arraybloco = data.content;
      console.log(this.arraybloco + "array de bloco aqui");
    },

    async getSemestres() {
      this.semestreselecionado = localStorage.getItem(semestreKey);
      console.log('valor de key: ',semestreKey);
      // const { data } = await this.axios.get(
      //   `${baseApiUrl}api/semestre/search?sort=asc&orderBy=label`
      // );
      // this.arraysemestres = data.content;
      // console.log(this.arraysemestres + "array de semestre aqui");
    },

    async getProfessores() {
      const { data } = await this.axios.get(
        `${baseApiUrl}api/professor/getAll?porPagina=1000&paginaAtual=0`
      );
      this.arrayprofessores = data;
      console.log(this.arrayprofessores + "array de professores aqui");
    },

    async getDisciplinas() {
      var campus = "Palmas";
      var codmatriz = "011001";

      const { data } = await this.axios.get(
        `${baseApiUrl}api/matriz/searchDisciplinaByMatriz?campus=${campus}&codHabilitacao=${codmatriz}&porPagina=100&paginaAtual=0`
      );
      this.arraydisciplinas = data;
      console.log(this.arraydisciplinas + "array de disciplinas aqui");
    },

    async getMatriz(curso) {
      var curso = "Sistemas%20de%20Informacao";
      const { data } = await this.axios.get(
        `${baseApiUrl}api/matriz/searchMatrizByCurso?curso=${curso}&porPagina=100&paginaAtual=0`
      );
      this.arraymatriz = data;
      console.log(this.arraymatriz + "array de matriz aqui");
    },

    filtrarPorAtivos() {
      if (this.filtroSelecionado === "Todos") {
        // const json = localStorage.getItem(userKey);
        // const jwt = JSON.parse(json);
        // axios.defaults.headers.common["Authorization"] = `Bearer ${jwt.token}`;
        axios
          .get(`${baseApiUrl}api/oferta/search`)
          .then((res) => {
            this.ofertas = res.data.content.map((c) => {
              c.ativo = c.ativo ? "Ativo" : "Inativo";
              return c;
            });
            console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.inicializar();
      }
    },

    adicionarHorarios() {
      const listahorarios = [];
      listahorarios.push(
        this.atributo.horario1,
        this.atributo.horario2,
        this.atributo.horario3,
        this.atributo.horario4,
        this.atributo.turno,
        this.atributo.diaSemana
      );
      console.log("lista de horarios :", listahorarios);
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
        const request = {
          horario: [
            {
              horario1: this.atributo.horario.horario1,
              horario2: this.atributo.horario.horario2,
              horario3: this.atributo.horario.horario3,
              horario4: this.atributo.horario.horario4,
              turno: this.atributo.horario.turno,
              diaSemana: this.atributo.horario.diaSemana,
            },
          ],
          disciplina: this.atributo.disciplina,
          sala: this.atributo.sala,
          bloco: this.atributo.bloco,
          codpesoa: this.atributo.codpesoa,
          codDiciplina: this.atributo.codDiciplina,
          ativo: this.atributo.ativo,
          semestre: this.atributo.semestre,
        };
        axios
          .put(`${baseApiUrl}api/oferta`, request)
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
            bloco: this.atributo.bloco,
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