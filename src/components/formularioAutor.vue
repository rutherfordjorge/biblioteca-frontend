<template>
  <v-container>
    <!--------------- nombre del boton --------------------->
    <v-btn color="primary" dark @click="dialog = !dialog"
      ><v-icon>mdi-plus</v-icon> Formulario Autor
    </v-btn>
    <!------------------------------------------------------>
    <v-dialog scrollable v-model="dialog" max-width="500px">
      <v-overlay v-if="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card>
        <v-card-title class="primaryBanner lighten-1">
          <span class="headline white--text">Agregar Autor</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="validForm" ref="form">
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :rules="rules.nombre"
                  v-model="editedItem.nombre"
                  label="Nombre">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :rules="rules.apellidoPaterno"
                  v-model="editedItem.apellidoPaterno"
                  label="Apellido Paterno">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :rules="rules.apellidoMaterno"
                  v-model="editedItem.apellidoMaterno"
                  label="Apellido Materno">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :rules="rules.tituloProfesional"
                  v-model="editedItem.tituloProfesional"
                  label="Titulo Profesional">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :rules="rules.gradoAcademico"
                  v-model="editedItem.gradoAcademico"
                  label="Grado Academico">
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <!--<v-spacer></v-spacer>-->
          <v-btn color="red darken-1" text @click="close">Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "nuevoAutor",
  props:["tipoArchivoId", "origenId"],
  components: {},
  data: () => ({
    Progreso: 0,
    menu1: false,
    isLoading: false,
    items: [],
    edicion: [],
    dialog: false,
    editedIndex: -1,
    defaultItem: {
      id: 0,
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      tituloProfesional: null,
      gradoAcademico: null,
    },
    editedItem: {
      id: 0,
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      tituloProfesional: null,
      gradoAcademico: null,
    },
    validForm: false,
    rules: {
      nombre: [(v) => !!v || "Nombre es requirido"],
      apellidoPaterno: [(v) => !!v || "Apellido Paterno es requerido"],
      apellidoMaterno: [(v) => !!v || "Apellido Materno es requerido"],
      tituloProfesional: [(v) => !!v || "Titulo Profesional es requerido"],
      gradoAcademico: [(v) => !!v || "Grado Academico es requerido"],
      pass: [true],
    },
  }),
  async mounted() {
    
    this.cleanAutor();
  },
  watch: {
    dialogInstructivo(dialog) {
      if (!dialog) {
        this.$forceUpdate();
      }
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
    ...mapGetters("procedimientosStore", ["documentos", "tiposDocumentos"]),
    ...mapGetters("autoresStore",["autores"]),
  },
  methods: {
    ...mapActions("procedimientosStore", ["fetchDocumentosTipo",]),
    ...mapActions("autoresStore",["postAutor", "addAutor", "cleanAutor"]),
    //...mapActions("archivosStore", ["postArchivo",]),
    validate() {
      this.$refs.form.validate();
    },
    close() {
      this.dialog = !this.dialog;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.$refs.form.resetValidation();
      }, 300);
    },
    async save() {
      this.isLoading = !this.isLoading;
      this.validate();
      if (this.validForm) {

        //console.log(this.editedItem);
        
        let autor = {
          //ID_AUTOR: 0,
          NOMBRE_AUTOR: this.editedItem.nombre,
          APELLIDO_PATERNO: this.editedItem.apellidoPaterno,
          APELLIDO_MATERNO: this.editedItem.apellidoMaterno,
          TIPO_TITULO_PROFESIONAL: this.editedItem.tituloProfesional,
          GRADO_ACADEMICO: this.editedItem.gradoAcademico,
        };
        
        this.addAutor(autor),

        console.log(this.autores)
        /*if(this.tiposLineas == 0){
          await this.fetchAutores(autor);
          }

        
        const res = await this.postAutor(autor).then(async (resp) => {

          if (resp.status == 200) {
            //
          } else{
            this.$toastr("error", res.message, "Error!");
            return;
          }
        });
        */
        this.close();
      } else {
        this.$toastr("error", "Formulario Incompleto", "Error!");
      }
      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>