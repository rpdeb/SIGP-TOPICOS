<template>
  <v-data-table
    :headers="titulos"
    :items="ofertas"
    :search="search"
    class="elevation-2 data-table"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de Oferta</v-toolbar-title>
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
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Matriz Curricular"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Periodo"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Disciplina"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Dia da semana"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Professor"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Turno"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Campus-Bloco/Piso"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="8" sm="6" md="4">
                      <v-select
                        v-model="atributo.oferta"
                        :items="items"
                        :rules="[v => !!v || 'Item obrigatório!']"
                        label="Sala"
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="8" sm="4" md="3">
                    <v-container fluid>
                    <p>{{ selected }}</p>
                    <v-checkbox
                      v-model="selected"
                      label="1º Aula"
                      value="1Aula"
                    ></v-checkbox>
                    </v-container>
                    </v-col>

                    <v-col cols="8" sm="3" md="4">
                    <v-container fluid>
                    <p>{{ selected }}</p>
                    <v-checkbox
                      v-model="selected"
                      label="2º Aula"
                      value="2Aula"
                    ></v-checkbox>
                    </v-container>
                    </v-col>

                    <v-col cols="8" sm="3" md="4">
                    <v-container fluid>
                    <p>{{ selected }}</p>
                    <v-checkbox
                      v-model="selected"
                      label="3º Aula"
                      value="3Aula"
                    ></v-checkbox>
                    </v-container>
                    </v-col>

                    <v-col cols="8" sm="3" md="4">
                    <v-container fluid>
                    <p>{{ selected }}</p>
                    <v-checkbox
                      v-model="selected"
                      label="4º Aula"
                      value="4Aula"
                    ></v-checkbox>
                    </v-container>
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
    // selected: ['1Aula'],
    titulos: [
      {
        text: "Periodo",
        value: "periodo",
        sortable: false,
      },
      {
        text: "Disciplina",
        value: "disciplina",
        sortable: false,
      },
      {
        text: "Turno",
        value: "turno",
        sortable: false,
      },
      {
        text: "Ações",
        value: "acoes",
        sortable: false,
      },
    ],

    errors: [],
    ofertas: [],
    editIndice: -1,

    atributo: {
      id: null,
      oferta: "",
      semestre: "",
      
    },

    atributoPadrao: {
      id: null,
      oferta: "",
      semestre: "",
      
    },
  }),

  computed: {
    tituloForm() {
      return this.editIndice === -1 ? "Ofertar Disciplina" : "Editar Oferta";
    },
  },

  watch: {
    dialog(val) {
      val || this.fechar();
    },
  },

  editItem(item) {
    this.editIndice = this.ofertas.indexOf(item);
    this.atributo = Object.assign({}, item);
    this.dialog = true;
  },

  checkForm() {
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