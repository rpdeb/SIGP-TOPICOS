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
                      <v-text-field
                        v-model="atributo.bloco"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Bloco"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.campus"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Campus"
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
              @click="validaForm">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

         <v-dialog v-model="dialogDelete" max-width="400px">
          <v-card>
            <v-card-title class="text-h5"
              >Deseja deletar este Bloco ?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog=false">
                Não</v-btn
              >
              <v-btn small color="primary" dark @click="deleteItemConfirm"
                >Sim</v-btn
              >
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
export default {
  data: () => ({
    search: "",
    dialog: false,
    titulos: [
      {
        text: "Campus",
        value: "campus",
        sortable: false,
      },
      {
        text: "Bloco",
        value: "bloco",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],
    errors: [],
    blocos: [
      {
        campus: "Palmas",
        bloco: "Bloco A",
      },
       {
        campus: "Palmas",
        bloco: "Bloco B",
      },
    ],
    editIndice: -1,
    atributo: {
      id: null,
      campus: "",
      bloco: "",
    },
    atributoPadrao: {
      id: null,
      campus: "",
      bloco: "",
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

  deleteItem(item) {
    this.editIndice = this.blocos.indexOf(item);
    this.atributo = Object.assign({}, item);
    this.dialogDelete = true;
  },

deleteItemConfirm(){

},
  validaForm() {
    if (this.atributo.campus && this.atributo.bloco) {
      this.salvar();
      return true;
    }
    this.errors = [];
    if (!this.atributo.campus) {
      this.errors.push("O câmpus é obrigatório.");
    }
    if (!this.atributo.bloco) {
      this.errors.push("O bloco é obrigatório.");
    }
  },

  fechar() {
    this.dialog = false;
    this.$nextTick(() => {
      this.atributo = Object.assign({}, this.atributoPadrao);
      this.editIndice = -1;
    });
  },
};
</script>