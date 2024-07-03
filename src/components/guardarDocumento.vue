<template>
  <div>
    <v-overlay v-if="isLoading">
      <v-card color="white" width="90vw" heigt="80vh">
        <v-card-title>
          <span class="headline"
            >Guardando el documento, espere un momento por favor</span
          >
        </v-card-title>
        <v-card-text>
          <v-row align="center">
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
        <span class="headline black--text">Cargar nueva versión</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="validForm" ref="form">
          <v-row>
            <v-col cols="6" sm="5" md="5">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
              </v-menu>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <b>Documento :</b>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-file-input
                :rules="rules.documento"
                accept=".pdf"
                v-model="item.documento"
                label="Seleccione Documento *.PDF"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
          <!-- <v-btn color="blue darken-1" text @click="closeEdit">Cancelar</v-btn> -->
          <v-btn color="blue darken-1" text @click="close3">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="edit_doc">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "guardarDocumento",
  props: ["tipoArchivoId", "origenId", "item"],
  components: {},
  data: () => ({
    Progreso: 0,
    isLoading: false,
    menu1: false,
    editedIndex: -1,
    defaultItem: {
      id: 0,
      fechA_DOC: null,
      numero: "",
      ruta: 0,
      descripcion: null,
      tipo: null,
      unidad: null,
      documento: null,
      clasificacion: null,
    },
    validForm: false,
    rules: {
      documento: [(v) => !!v || "El documento es requerido"],
      pass: [true],
    },
  }),
  async mounted() {},
  watch: {
    Progreso(val) {
      if (val <= 100) return;
      this.Progreso = 0;
    },
  },
  computed: {
    ...mapGetters("unidadesStore", ["unidades"]),
  },
  methods: {
    ...mapActions("unidadesStore", ["fetchUnidades"]),
    ...mapActions("procedimientosStore", [
      "fetchTiposDocumentos",
      "putActivaDocumento",
      "putBloquearDocumento",
      "putDocumento",
    ]),
    ...mapActions("archivosStore", [
      "fetchArchivosOrigen",
      "putActivaArchivo",
      "putBloquearArchivo",
      "putCleanBase64Archivo",
      "putArchivo",
      "putBase64Archivo",
    ]),
    validate() {
      return this.$refs.form.validate();
    },
    toBase64: (file) =>
      new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }),
    async edit_doc() {
      this.validate();
      this.isLoading = true;
      if (this.item.edicion != 0) {
        let documento = {
          id: this.item.id,
          fechA_DOC: this.item.fechA_DOC,
          numero: this.item.numero,
          descripcion: this.item.descripcion,
          nombrE_ARCHIVO: this.item.documento.name,
          unidadid: this.item.unidad.codigo,
          tipoid: this.item.tipo.id,
          edicion: this.item.edicion,
          clasificacion: this.item.clasificacion,
          estado: this.item.estado,
          origenid: this.origenId,
        };
        await this.putDocumento(documento).then(async (resp) => {
          if (resp.status == 200) {
            const result = await this.toBase64(this.item.documento);
            var base64 = result.replace("data:application/pdf;base64,", "");
            var Count = base64.length;
            var chunkSize = 500000;
            var totalBloques = Count / chunkSize;
            let archivo = {
              ID: this.item.documentoId,
              NUMERO: 0,
              NOMBRE: this.item.documento.name,
              DESCRIPCION: this.item.descripcion,
              BASE64: "",
              EXTENCION: this.item.documento.name.replace(/^.*\./, ""),
              NOMBRE_TABLA_ORIGEN: "BIBLIO_ARCHIVO",
              ID_DATO_TABLA_ORIGEN: this.item.id,
              ID_TIPO_ARCHIVO: this.tipoArchivoId,
            };
            await this.putCleanBase64Archivo(this.item.documentoId);
            await this.putArchivo(archivo).then(async (res) => {
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
                  let base = {
                    ID: this.item.documentoId,
                    BASE64: subBase64,
                  };
                  await this.putBase64Archivo(base);
                  //una vez insertado todo el base64 se cambia el estado del documento a 1
                }
                // console.log(res.data)
                await this.putActivaDocumento(this.item.id).then(
                  async (respuesta) => {
                    if (respuesta.status == 200) {
                      await this.putActivaArchivo(this.item.documentoId).then(
                        (respu) => {
                          if (respu.status == 200) {
                            this.$toastr(
                              "success",
                              "Documento modificado con exito",
                              "Éxito!"
                            );
                            this.Progreso = 0;
                          } else {
                            this.$toastr("error", respu.message, "Error!");
                            return;
                          }
                        }
                      );
                    } else {
                      this.$toastr("error", respuesta.message, "Error!");
                      return;
                    }
                  }
                );
              } else {
                // console.log(res.message);
                this.$toastr("error", res.message, "Error!");
                return;
              }
            });
          } else {
            if (resp.status === 404)
              this.$toastr(
                "error",
                "No se ha encontrado el registro",
                "Error!"
              );
            else if (resp.status === 401)
              this.$toastr(
                "error",
                "No tiene acceso para realizar esta operación",
                "Error!"
              );
            else {
              this.$toastr("error", resp.statusText, "Error!");
            }
            return;
          }
        });
        this.closeEdit();
        this.close();
        this.close3();
        this.isLoading = false;
      } else {
        this.$toastr("error", "Formulario Incompleto", "Error!");
      }
    },
    closeEdit() {
      this.$emit("closeEdit");
    },
    close() {
      this.$emit("close");
    },
    close3() {
      this.$emit("close3");
    }
    
  },
};
</script>

<style>
.theme--dark.v-progress-linear {
  color: #000000 !important;
}

.breadcrumbs {
  font-weight: 100;
}
</style>