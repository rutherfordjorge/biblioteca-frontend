<template>
  <v-container>
    <v-btn color="primary" dark @click="dialog = !dialog"
      ><v-icon>mdi-plus</v-icon> Nuevo Documento
    </v-btn>
    <v-dialog scrollable v-model="dialog" max-width="1200px">
      <v-overlay v-if="isLoading">
        <v-card color="white" width="90vw" heigt="80vh">
          <v-card-title>
            <span class="headline"
              >Guardando el documento, espere un momento por favor</span
            >
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
                  rounded
                >
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
          <span class="headline white--text">Nuevo Documento !</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="validForm" ref="form">
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="fechaFormateada"
                      label="Fecha Documento"
                      persistent-hint
                      readonly
                      v-on="on"
                      :rules="rules.fechA_DOC"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="es-CL"
                    :first-day-of-week="1"
                    v-model="editedItem.fechA_DOC"
                    no-title
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="unidades"
                  v-model="editedItem.unidad"
                  item-text="descripcion"
                  item-value="codigo"
                  autocomplete
                  label="Unidad"
                  :rules="rules.unidad"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  :rules="rules.numero"
                  v-model="editedItem.numero"
                  label="Numero"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="tipos"
                  v-model="editedItem.tipo"
                  item-text="nombre"
                  item-value="id"
                  autocomplete
                  label="Tipo"
                  :rules="rules.tipo"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="clasificacion"
                  v-model="editedItem.clasificacion"
                  item-text="text"
                  item-value="value"
                  autocomplete
                  label="Clasificación"
                  :rules="rules.clasificacion"
                ></v-autocomplete>
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
                  :rules="rules.edicion"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  persistent-hint
                  return-object
                  :items="estado"
                  v-model="editedItem.estado"
                  item-text="nombre"
                  item-value="id"
                  autocomplete
                  label="Estado"
                  :rules="rules.estado"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" :sm="origenId == 2? 8 : 12" :md="origenId == 2? 8 : 12">
                <v-text-field
                  :rules="rules.descripcion"
                  v-model="editedItem.descripcion"
                  label="Descripción"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <b>Documento</b>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-file-input
                  :rules="rules.documento"
                  accept=".pdf"
                  v-model="editedItem.documento"
                  label="Seleccione Documento"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "nuevoDocumento",
  props:["tipoArchivoId", "origenId"],
  components: {},
  data: () => ({
    Progreso: 0,
    menu1: false,
    isLoading: false,
    items: [],
    tipos: [],
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
      numero: "",
      descripcion: null,
      tipo: null,
      clasificacion: null,
      edicion: null,
      unidad: null,
      documento: null,
    },
    editedItem: {
      id: 0,
      fechA_DOC: null,
      numero: "",
      descripcion: null,
      tipo: null,
      clasificacion: null,
      edicion: null,
      unidad: null,
      documento: null,
    },
    validForm: false,
    rules: {
      fechA_DOC: [(v) => !!v || "Debe seleccionar una fecha"],
      unidad: [(v) => !!v || "La unidad es requerido"],
      numero: [(v) => !!v || "El numero es requerido"],
      descripcion: [(v) => !!v || "La descripción es requerida"],
      tipo: [(v) => !!v || "El tipo es requerido"],
      clasificacion: [(v) => !!v || "La clasificación es requerida"],
      edicion: [(v) => !!v || "La edición del texto es requerida"],
      estado: [(v) => !!v || "El estado del texto es requerido"],
      documento: [(v) => !!v || "El documento es requerido"],
      pass: [true],
    },
  }),
  async mounted() {
    // console.log(this.unidades);
    for (let i = 2015; i <= new Date().getUTCFullYear(); i++) {
      this.edicion.push(i)
    }
    if (this.unidades == 0) {
      // await this.fetchUnidades().then(resp => {
      //   console.log(resp);
      // });
      await this.fetchUnidades()
    }
    if (this.tiposDocumentos == 0) {
      let resp = await this.fetchTiposDocumentos();
      resp.data.forEach((element) => {
        if (this.origenId == 2) {
          if (element.id >= 27 && element.id <= 32) {
            this.tipos.push(element);
          }
        } else if (this.origenId == 1 ) {
          if (element.id >= 1 && element.id <= 26 && element.id != 20) {
            this.tipos.push(element);
          }
        }
      });
    } else {
      this.tiposDocumentos.forEach((element) => {
        if (this.origenId == 2) {
          if (element.id >= 27 && element.id <= 32) {
            this.tipos.push(element);
          }
        } else if (this.origenId == 1) {
          if (element.id >= 1 && element.id <= 26 && element.id != 20) {
            this.tipos.push(element);
          }
        }
      });
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
    ...mapGetters(["currentUser"]),
    ...mapGetters("procedimientosStore", ["documentos", "tiposDocumentos"]),
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
    ...mapActions("procedimientosStore", [
      "fetchDocumentosTipo",
      "fetchDocumentos",
      "fetchTiposDocumentos",
      "postDocumento",
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
        const result = await this.toBase64(this.editedItem.documento);
        var base64 = result.replace("data:application/pdf;base64,", "");
        var Count = base64.length;
        var chunkSize = 500000;
        var totalBloques = Count / chunkSize;
        let documento = {
          id: 0,
          fechA_DOC: this.editedItem.fechA_DOC,
          numero: this.editedItem.numero,
          descripcion: this.editedItem.descripcion,
          nombrE_ARCHIVO: this.editedItem.documento.name,
          unidadid: this.editedItem.unidad.codigo,
          tipoid: this.editedItem.tipo.id,
          edicion: this.editedItem.edicion,
          clasificacion: this.editedItem.clasificacion.id,
          origenid: this.origenId,
        };
   
        const res = await this.postDocumento(documento).then(async (resp) => {
          if (resp.status == 200) {
            let archivo = {
              ID: 0,
              NUMERO: 1,
              NOMBRE: this.editedItem.documento.name,
              DESCRIPCION: this.editedItem.descripcion,
              BASE64: "",
              EXTENCION: this.editedItem.documento.name.replace(/^.*\./, ""),
              NOMBRE_TABLA_ORIGEN: "BIBLIO_ARCHIVO",
              ID_DATO_TABLA_ORIGEN: resp.data.id,
              ID_TIPO_ARCHIVO: this.tipoArchivoId,
            };
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