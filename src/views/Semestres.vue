<template>
  <v-data-table
    :headers="titulos"
    :items="semestres"
    :search="search"
    class="elevation-2 data-table" 
      :footer-props="{
           'items-per-page-text':'products per page'
      }"
    
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Semestres</v-toolbar-title>
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
                        v-model="atributo.semestre"
                        :items="items"
                        label="Semestre"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Oferta"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="warning" dark @click="dialog=false">
                Cancelar
              </v-btn>
              <v-btn 
              small color="primary" 
              class="mr-4"
              @click="validaForm">Salvar</v-btn>
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
        text: "Semestre",
        value: "semestre",
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
    errors: [],
    semestres: [],
    editIndice: -1,
    atributo: {
      id: null,
      oferta: "",
      semestre: "",
      ativo: true,
    },
    atributoPadrao: {
      id: null,
      oferta: "",
      semestre: "",
      ativo: true,      
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Cadastrar Semestre" : "Editar Semestre";
    },
  },

editItem(item) {
    this.editIndice = this.semestres.indexOf(item);
    this.atributo = Object.assign({}, item);
    this.dialog = true;
  },

  validaForm() {
    if (this.atributo.semestre && this.atributo.oferta) {
      this.salvar();
      return true;
    }

    this.errors = [];

    if (!this.atributo.semestre) {
      this.errors.push("O câmpus é obrigatório.");
    }

    if (!this.atributo.oferta) {
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