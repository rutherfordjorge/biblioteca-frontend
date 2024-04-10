<template>
  <v-container>
    <!------------------ nombre boton--------------------->
    <v-btn color="primary" dark @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon> Nuevo Formulario
    </v-btn>
    <v-dialog scrollable v-model="dialog" max-width="1200px">
      <v-overlay v-if="isLoading">
        <v-card color="white" width="90vw" heigt="80vh">
          <v-card-title>
            <span class="headline">Guardando el documento, espere un momento por favor</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="auto" align-self="center">
                <v-icon color="black">mdi-desktop-tower-monitor</v-icon>
              </v-col>
              <v-col cols="11" align-self="center">
                <v-progress-linear
                  stream
                  buffer-value="0"
                  :value="Progreso"
                  color="light-blue"
                  height="15"
                  rounded>
                  <template>
                    <span>{{ Progreso }}%</span>
                  </template>
                </v-progress-linear>
              </v-col>
              <v-col cols="auto" align-self="center">
                <v-icon color="black">mdi-file-plus-outline</v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-overlay>
      <v-card>
        <v-card-title class="primaryBanner lighten-1">
          <span class="headline white--text">Nuevo Formulario</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="validForm" ref="form">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="fechaFormateada"
                      label="Fecha Documento"
                      persistent-hint
                      readonly
                      v-on="on"
                      :rules="rules.fechA_DOC">
                      </v-text-field>
                  </template>
                  <v-date-picker
                    locale="es-CL"
                    :first-day-of-week="1"
                    v-model="editedItem.fechA_DOC"
                    no-title
                    @input="menu1 = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="tipos"
                  v-model="editedItem.tipo"
                  item-text="nombre"
                  item-value="id"
                  autocomplete
                  label="Tipo de Investigación"
                  :rules="rules.tipo">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  :rules="rules.titulo"
                  v-model="editedItem.titulo"
                  label="Titulo">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="tiposAmbitos"
                  v-model="editedItem.tiposAmbitos"
                  item-text="nombrE_AMBITO"
                  item-value="ID_AMBITO"
                  autocomplete
                  label="Seleccionar Ambito"
                  :rules="rules.tiposAmbitos">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="unidades"
                  v-model="editedItem.unidad"
                  item-text="descripcion"
                  item-value="codigo"
                  autocomplete
                  label="Unidad Responsable"
                  :rules="rules.unidad">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="tiposAreasAmbitos"
                  v-model="editedItem.tiposAreasAmbitos"
                  item-text="nombrE_AREA_AMBITO"
                  item-value="ID_AREA_AMBITO"
                  autocomplete
                  label="Seleccionar Área del Ambito"
                  :rules="rules.tiposAreasAmbitos">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="origenId == 2? 8 : 6" :md="origenId == 2? 8 : 6">
                <v-text-field
                  :rules="rules.resumen"
                  v-model="editedItem.resumen"
                  label="Resumen">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="tiposLineas"
                  v-model="editedItem.tiposLineas"
                  item-text="nombrE_LINEA" 
                  item-value="ID_LINEA"
                  autocomplete
                  label="Seleccionar Linea"
                  :rules="rules.tiposLineas">
                </v-autocomplete>
              </v-col>
              <!--
              <v-col cols="12" :sm="origenId == 2? 8 : 6" :md="origenId == 2? 8 : 6">
                <v-text-field
                  :rules="rules.abstract"
                  v-model="editedItem.abstract"
                  label="Abstract">
                </v-text-field>
              </v-col>
              -->
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="clasificacion"
                  v-model="editedItem.clasificacion"
                  item-text="text"
                  item-value="value"
                  autocomplete
                  label="Clasificación Militar"
                  :rules="rules.clasificacion">
                </v-autocomplete>
              </v-col> 
              <v-col v-if="origenId == 2" cols="12" sm="4" md="4">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="edicion"
                  v-model="editedItem.edicion"
                  item-text="text"
                  item-value="value"
                  autocomplete
                  label="Edición"
                  :rules="rules.edicion">
                </v-autocomplete>
              </v-col>
              <!--
              <v-col cols="12" sm="6" md="6">
                <b>Documento</b>
              </v-col>
              -->
              <v-col cols="12" sm="6" md="6">
                <!--<v-btn color="primary" dark @click="dialog = !dialog">
                    <v-icon>mdi-plus</v-icon> Agregar Autor
                </v-btn>-->
                <v-col cols="auto">
                    <formulario-autor :tipoArchivoId="41" :origenId="2" />
                </v-col>
              </v-col>
              <!--
              <v-col cols="12" sm="6" md="6">
                <v-file-input
                  :rules="rules.documento"
                  accept=".pdf"
                  v-model="editedItem.documento"
                  label="Seleccione Documento">
                </v-file-input>
              </v-col>
              -->
              <!--
              <v-col cols="12" sm="6" md="6">
                -<v-btn color="primary" dark @click="dialog = !dialog">
                    <v-icon>mdi-plus</v-icon> Agregar Autor
                </v-btn>--
                <v-col cols="auto">
                    <formulario-autor :tipoArchivoId="41" :origenId="2" />
                </v-col>
              </v-col>
              -->
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FormularioAutor from './formularioAutor.vue';
export default {
  name: "nuevoDocumento",
  props:["tipoArchivoId", "origenId"],
  components: {FormularioAutor},
  data: () => ({
    Progreso: 0,
    menu1: false,
    isLoading: false,
    items: [],
    edicion: [],
    dialog: false,
    clasificacion: [
      { text: "PUBLICO", value: 0 },
      { text: "RESERVADO", value: 1 },
      { text: "SECRETO", value: 2 },
    ],
    estado: [
      { id: 0, nombre: "VIGENTE" },
      { id: 1, nombre: "EN ACTUALIZACIÓN" },
      { id: 2, nombre: "EN ELABORACIÓN" },
    ],
    editedIndex: -1,
    defaultItem: {
      id: 0,
      fechA_DOC: null,
      titulo: null,
      unidad: null,
      clasificacion: null,
      documento: null,   

      tipo: null,
      tiposAmbitos: null,
      tiposAreasAmbitos: null,
      tiposLineas: null,

      resumen: null,
      //abstract: "",
      
      edicion: null,
    },
    editedItem: {
      id: 0,
      fechA_DOC: null,
      titulo: null,
      unidad: null,
      clasificacion: null,
      documento: null,

      tipo: null,
      tiposAmbitos: null,
      tiposAreasAmbitos: null,
      tiposLineas: null,

      resumen: null,
      //abstract: "",

      edicion: null,
    },
    validForm: false,
    rules: {
      fechA_DOC: [(v) => !!v || "Debe seleccionar una fecha"],
      titulo: [(v) => !!v || "Titulo es Requerido"],
      unidad: [(v) => !!v || "La unidad es requerido"],
      clasificacion: [(v) => !!v || "La clasificación es requerida"],
      documento: [(v) => !!v || "El documento es requerido"],

      tipo: [(v) => !!v || "Debe seleccionar el Tipo de Investigación"],
      tiposAmbitos: [(v) => !!v || "Debe seleccionar un Ambito"],
      tiposAreasAmbitos: [(v) => !!v || "Debe seleccionar el Área del Ambito"],
      tiposLineas: [(v) => !!v || "Debe seleccionar una linea"],

      resumen: [(v) => !!v || "Resumen es requerido"],
      //abstract: [(v) => !!v || "Abstract es requerido"],
      
      edicion: [(v) => !!v || "La edición del texto es requerida"],
      pass: [true],
    },
  }),
  async mounted() {
    // console.log(this.unidades);
    for (let i = 2015; i <= new Date().getUTCFullYear(); i++) {
      this.edicion.push(i)
    }
    if (this.unidades == 0) {
      
      await this.fetchUnidades()
    }

    if(this.tipos == 0){
      await this.fetchTiposDocumentos()
    }
   
   if (this.tiposAmbitos == 0){
    await this.fetchtiposAmbitos()
   }

   if(this.tiposAreasAmbitos == 0){
    await this.fetchtiposAreasAmbitos()
   }

   if(this.tiposLineas == 0){
    await this.fetchtiposLineas()
   }

  },
  watch: {
    dialogInstructivo(dialog) {
      if (!dialog) {
        this.documento = "";
        this.$forceUpdate();
      }
    },
    Progreso(val) {
      if (val <= 100) return;
      this.Progreso = 0;
    },
  },
  computed: {
    ...mapGetters("unidadesStore", ["unidades"]),
    ...mapGetters("ambitosStore", ["tiposAmbitos"]), 
    ...mapGetters("areaAmbitosStore",["tiposAreasAmbitos"]),
    ...mapGetters("lineasStore",["tiposLineas"]),
    ...mapGetters(["currentUser"]),
    ...mapGetters("procedimientosStore", ["documentos","tipos"]),
    ...mapGetters("autoresStore",["autores"]),
    fechaFormateada: {
      get: function () {
        if (this.editedItem.fechA_DOC != null) {
          return this.formatearFecha(this.editedItem.fechA_DOC);
        }
        return "";
      },
      set: function () {
        this.editedItem.fechA_DOC = this.formatearFecha(
          this.editedItem.fechA_DOC
        );
      },
    },
  },
  methods: {
    ...mapActions("unidadesStore", ["fetchUnidades"]),
    ...mapActions("ambitosStore",["fetchtiposAmbitos"]),
    ...mapActions("areaAmbitosStore",["fetchtiposAreasAmbitos"]),
    ...mapActions("lineasStore",["fetchtiposLineas"]),
    ...mapActions("procedimientosStore", [
      "fetchDocumentosTipo",
      "fetchDocumentos",
      "fetchTiposDocumentos",
      "postformulario",
      "putActivaDocumento",
    ]),
    ...mapActions("archivosStore", [
      "postArchivo",
      "putArchivo",
      "putActivaArchivo",
      "putBase64Archivo",
    ]),
    toBase64: (file) =>
      new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }),
    formatearFecha(date) {
      if (date == null) return null;
      return this.moment(date).format("YYYY-MM-DD");
    },

    getFormatFecha(f) {
      var fecha = new Date(f).toISOString().substring(0, 10);
      return fecha;
    },

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
        /*
        const result = await this.toBase64(this.editedItem.documento);
        var base64 = result.replace("data:application/pdf;base64,", "");
        var Count = base64.length;
        var chunkSize = 500000;
        var totalBloques = Count / chunkSize;
        */

       //console.log(this.editedItem);
       
        let documento = {
          id: 0,
          fechA_DOC: this.editedItem.fechA_DOC,
          DESCRIPCION: this.editedItem.resumen,
          NOMBRE_ARCHIVO: this.editedItem.titulo,
          UNIDADID: this.editedItem.unidad.codigo,
          TIPOID: this.editedItem.tipo.id,
          CLASIFICACION: this.editedItem.clasificacion.id,
          EDICION: this.editedItem.edicion,
          ORIGENID: this.origenId,
          LINEAID: this.editedItem.tiposLineas.iD_LINEA,
          AUTORES: this.autores
        };

        const res = await this.postformulario(documento).then(async (resp) => {
          

          if (resp.status == 200) {
           
           /*
            let archivo = {
              ID: 0,
              NUMERO: 1,
              NOMBRE: this.editedItem.documento.name,
              RESUMEN: this.editedItem.resumen,
              BASE64: "",
              EXTENCION: this.editedItem.documento.name.replace(/^.*\./, ""),
              NOMBRE_TABLA_ORIGEN: "BIBLIO_GESCON_ARCHIVO",
              ID_DATO_TABLA_ORIGEN: resp.data.id,
              ID_TIPO_ARCHIVO: this.tipoArchivoId,
            };
            */

          /*
            // se crea el archivo en estado 2 de creacion
            await this.postArchivo(archivo).then(async (res) => {
              if (res.status == 200) {
                // se inserta y se hace update de los bloques de base 64
                for (
                  let bloque = 1;
                  bloque <= Math.ceil(totalBloques);
                  bloque++
                ) {
                  var chunkInit = (bloque - 1) * chunkSize;
                  this.Progreso = Math.trunc(
                    (bloque / Math.ceil(totalBloques)) * 100
                  );
                  var subBase64 = base64.substr(
                    chunkInit,
                    Math.min(chunkSize, Count - chunkInit)
                  );
                  archivo.ID = res.data.id;
                  archivo.BASE64 = subBase64;
                  await this.putBase64Archivo(archivo);

                  //una vez insertado todo el base64 se cambia el estado del documento a 1
                }
                await this.putActivaDocumento(resp.data.id).then(
                  async (respuesta) => {
                    if (respuesta.status == 200) {
                      await this.putActivaArchivo(res.data.id).then((respu) => {
                        if (respu.status == 200) {
                          this.$toastr(
                            "success",
                            "Documento Ingresado",
                            "Éxito!"
                          );
                        } else {
                          this.$toastr("error", respu.message, "Error!");
                          return;
                        }
                      });
                    } else {
                      this.$toastr("error", respuesta.message, "Error!");
                      return;
                    }
                  }
                );
              } else {
                this.$toastr("error", res.message, "Error!");
                return;
              }
            });
            */
          } else {
            this.$toastr("error", res.message, "Error!");
            return;
          }
        });
        this.close();
      } else {
        this.$toastr("error", "Formulario Incompleto", "Error!");
      }
      this.isLoading = !this.isLoading;
    },
  },
};
</script>

<style>
</style>