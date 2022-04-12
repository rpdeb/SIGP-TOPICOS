<template>
  <v-data-table
    :headers="titulos"
    :items="blocos"
    :search="search"
    class="elevation-2 data-table"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Bloco</v-toolbar-title>
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
                      <v-select
                        v-model="itemAtual.campus"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Campus"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="itemAtual.bloco"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Bloco"
                        required
                      ></v-select>
                    </v-col>
                     <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="itemAtual.sala"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Sala"
                        required
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
              @click="checkForm">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.acoes`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="blue"> mdi-pencil </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    titulos: [
      {
        text: "Câmpus",
        value: "campus",
        sortable: false,
      },
      {
        text: "Bloco",
        value: "bloco",
        sortable: false,
      },
      {
        text: "Sala",
        value: "sala",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],

    errors: [],
    blocos: [],
    editIndice: -1,

    itemAtual: {
      id: null,
      campus: "",
      bloco: "",
      sala: "",
    },

    itemPadrao: {
      id: null,
      campus: "",
      bloco: "",
      sala: "",
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Bloco" : "Editar Dados";
    },
  },

  watch: {
    dialog(val) {
      val || this.fechar();
    },
  },

  editItem(item) {
    this.editIndice = this.blocos.indexOf(item);
    this.itemAtual = Object.assign({}, item);
    this.dialog = true;
  },

  checkForm() {
    if (this.itemAtual.campus && this.itemAtual.bloco && this.itemAtual.sala ) {
      this.salvar();
      return true;
    }

    this.errors = [];

    if (!this.itemAtual.campus) {
      this.errors.push("O câmpus é obrigatório.");
    }

    if (!this.itemAtual.bloco) {
      this.errors.push("O bloco é obrigatório.");
    }

    if (!this.itemAtual.sala) {
      this.errors.push("A sala é obrigatória.");
    }
  },

  fechar() {
    this.dialog = false;
    this.$nextTick(() => {
      this.itemAtual = Object.assign({}, this.itemPadrao);
      this.editIndice = -1;
    });
  },
};
</script>