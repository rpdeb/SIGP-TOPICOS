<template>
  <v-data-table :headers="titulos" :items="sala" :search="search" class="elevation-2 data-table" :footer-props="{
    'items-per-page-text': 'Itens por página'
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
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.sala" label="Sala" required></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select v-model="atributo.campus" label="Campus-Bloco/Piso" :items="campusbloco"></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.estruturafisica" label="Estrutura Física"></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select v-model="atributo.tipodesala" label="Tipo de Sala" :items="tiposdesala">
                        ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-text-field v-model="atributo.capacidade" label="Capacidade" type="number"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog = false">Cancelar</v-btn>
              <v-btn small color="primary" class="mr-4" @click="checkForm">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDesativar" max-width="400px">
          <v-card>
            <v-card-title class="text-h5">Deseja {{ mudarStatus }} esta Sala ?</v-card-title>
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
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDesativar: false,
    dialogDetalhar: false,
    titulos: [
      { text: "Sala", value: "sala" },
      { text: "Campus-Bloco/Piso", value: "campus" },
      { text: "Status", value: "ativo" },
      { text: "Ações", value: "acoes" },
    ],
    salas: [
      {
        sala: "Sala 14",
        campus: "Palmas - Bloco B",
      },
      {
        sala: "Sala 11",
        campus: "Dianopolis - Bloco A",
      },
    ],
    campus: [],
    campusbloco: [],
    tiposdesala: [],
    editIndice: -1,
    atributo: {
      id: null,
      sala: " ",
      campus: "",
      capacidade: null,
      estruturafisica: "",
      tipodesala: " ",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      sala: "",
      campus: "",
      capacidade: null,
      estruturafisica: "",
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

  methods: {
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
          .patch(url + "/desativar/" + this.atributo.id, {
            ativo: false,
          })
          .then((res) => {
            this.salas = res.data;
            console.log(res.data);
            alert("Esta sala foi desativada com sucesso !");
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
            alert("Esta sala foi ativada com sucesso !");
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
          .put(url, {})
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
        axios.post(url, {}).then((res) => {
          this.salas = res.data;
          alert("Os dados foram adicionados com sucesso !");
          console.log(res.data);
          this.reloadPage();
        });
        this.salas.push(this.atributo);
      }
      this.fechar();
    },
  },
};
</script>