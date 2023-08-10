<template>
  <v-container>
    <v-btn icon x-small @click="verDocumento">
      <v-icon>{{ Icon }}</v-icon>
    </v-btn>

    <v-dialog v-model="dialogModal" width="90vw" heigt="90vh">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn depressed icon @click="reset">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <embed
            :src="url"
            type=""
            frameborder="0"
            width="100%"
            :height="$vuetify.breakpoint.lgAndUp ? '700px' : '500px'"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogInstructivo" persistent width="90vw" heigt="80vh">
      <v-card>
        <v-card-title>
          <span class="headline"
            >Obteniendo el documento, espere un momento por favor</span
          >
          <v-spacer />
          <!-- <v-btn icon @click="dialogInstructivo = false">
                <v-icon>mdi-close</v-icon>
            </v-btn> -->
        </v-card-title>

        <v-card-text>
          <v-row align="center">
            <v-col cols="1" align-self="center">
              <v-icon color="black">mdi-desktop-tower-monitor</v-icon>
            </v-col>
            <v-col cols="10" align-self="center">
              <v-progress-linear
                stream
                buffer-value="0"
                :value="Progreso"
                color="light-blue"
                height="15"
                rounded
              >
                <template>
                  <strong>{{ Progreso }}%</strong>
                </template>
              </v-progress-linear>
            </v-col>
            <v-col cols="1" align-self="center">
              <v-icon color="black">mdi-file</v-icon>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default {
  name: "VerDocumento",
  props: ["Icon", "ID", "clasificacion"],
  components: {},
  data() {
    return {
      //documento: "data:application/pdf;base64,",
      documento: "",
      edicion: ["2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"],
      url: null,
      dialogInstructivo: false,
      dialogModal: false,
      Progreso: 0,
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
    ...mapGetters(["currentUser"]),
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
  async mounted() {
    // console.log('id del componente ver documento: ', this.ID)
  },
  methods: {
    ...mapActions("archivosStore", ["fetchArchivoBloque", "fetchCountArchivo"]),

    async BaseToBlob(base64) {
      var binary = atob(base64.replace(/\s/g,''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
      var blob = new Blob([view], { type: "application/pdf" });
      // console.log(blob);
      return URL.createObjectURL(blob);
    },

    async BaseToArrayBuffer(base64) {
      var binary = atob(base64.replace(/\s/g, ""));
      var len = binary.length;
      var bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    },

    async verDocumento() {
      try {
        this.dialogInstructivo = !this.dialogInstructivo;
        const res = await this.fetchCountArchivo(this.ID);
        if (res.status == 200) {
          for (let index = 1; index <= res.data; index++) {
            this.Progreso = Math.trunc((index / res.data) * 100);
            var param = { id: this.ID, bloque: index };
            const res2 = await this.fetchArchivoBloque(param);
            if (res2.status == 200 && res2.data.basE64.length != 0) {
              this.documento += res2.data.basE64;
            } else {
              this.Progreso = 0;
              this.dialogModal = false;
              this.dialogInstructivo = false;
              return this.$toastr(
                "error",
                "Documento no encontrado contacte al administrador",
                "Error!"
              );
            }
          }
          if (this.clasificacion != 0) {
            const existingPdfBytes = await this.BaseToArrayBuffer(
              this.documento
            );
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const TimesRomanItalicFont = await pdfDoc.embedFont(
              StandardFonts.Helvetica
            );
            const pages = pdfDoc.getPages();
            pages.map((element) => {
              const height = element.getHeight();
              element.drawText(this.currentUser.Nombres + " " + new Date(Date.now()).toISOString().substring(0, 10),
                {
                  x: height / 9 ,
                  y: height / 2.5 + 300,
                  size: 32,
                  getHeight: 1,
                  margin: 0,
                  font: TimesRomanItalicFont,
                  color: rgb(0.95, 0.1, 0.1),
                  rotate: degrees(-45),
                }
              );
            });
            var doc = await pdfDoc.saveAsBase64();
            this.url = await this.BaseToBlob(doc);
          }
          else{
            // console.log(this.documento);
            this.url = await this.BaseToBlob(this.documento);
            // console.log(this.url);
          }
          this.Progreso = 0;
          this.dialogInstructivo = !this.dialogInstructivo;
          this.dialogModal = !this.dialogModal;
        } else {
          return this.$toastr("error", "Ha ocurrido un error", "Error!");
        }
      } catch (error) {
        // console.log(error);
        return this.$toastr(
          "error",
          "Ha ocurrido un error, contacte al administrador",
          "Error!"
        );
      }
    },
    reset() {
      this.dialogModal = false;
      this.dialogInstructivo = false;
    },
  },
};
</script>

<style>
</style>