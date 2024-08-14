<template>
    <v-container>

        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on"
                    color="primary"
                    @click="verDocumento()"
                >
                    <v-icon>mdi-file-document-outline</v-icon>
                </v-btn>
            </template>
            <span>Ver Documento</span>
        </v-tooltip>

        <v-dialog v-model="documentoModal" width="90vw" heigt="90vh">
            <v-card>
                <v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn depressed icon @click="documentoModal = false">
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

        <v-overlay v-if="isUploading">
            <v-card color="white" width="90vw" heigt="80vh">
                <v-card-title>
                    <span class="headline"
                    >Subiendo el archivo, espere un momento por favor</span
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
                            :value="progreso"
                            color="light-blue"
                            height="15"
                            rounded
                        >
                            <template>
                                <span>{{ progreso }}%</span>
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
        
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Notificación
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
    name: "verArchivo",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        isUploading: false,
        progreso: 0,
        documentoModal: false,
        documento: null,
        url: null,
        editedItem: {},
    }),
    computed: {        
        ...mapGetters(["currentUser"]),
    },
    watch: {
        progreso(val) {
            if (val <= 100) return;
            this.progreso = 0;
        },
    },
    methods: {
        async BaseToArrayBuffer(base64) {
            var binary = atob(base64.replace(/\s/g, ""));
            var len = binary.length;
            var bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        },

        async BaseToBlob(base64) {
            var binary = atob(base64.replace(/\s/g,''));
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (let i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            var blob = new Blob([view], { type: "application/pdf" });
            return URL.createObjectURL(blob);
        },

        async verDocumento() {
            try {
                this.documento = null
            
                this.progreso = 0
                this.isUploading = true

                const res = await this.getCountArchivo(this.item.digitalid);

                if (res.status == 200) {
                    for (let index = 1; index <= res.data; index++) {
                        this.progreso = Math.trunc((index / res.data) * 100);
                        var param = { id: this.item.digitalid, bloque: index };
                        const res2 = await this.getArchivo(param);

                        if (res2.status == 200 && res2.data.basE64.length != 0) {
                            this.documento += res2.data.basE64;
                        } else {
                            this.documentoModal = false
                            this.isUploading = false
                            this.progreso = 0
                            return toastr.error("Documento no encontrado contacte al administrador","Error!")
                        }
                    }

                    if (this.clasificacion != 0) {
                        const existingPdfBytes = await this.BaseToArrayBuffer(this.documento);

                        const pdfDoc = await PDFDocument.load(existingPdfBytes);

                        const TimesRomanItalicFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

                        const pages = pdfDoc.getPages();
                        pages.map(element => {
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
                                opacity: 0.3,
                            });
                        });
                        const doc = await pdfDoc.saveAsBase64();
                        this.url = await this.BaseToBlob(doc);
                        
                        // martca el documento como leído
                        await this.postLogArchivo({id: this.item.id})
                    }
                    else{
                        this.url = await this.BaseToBlob(this.documento);
                    }
                    this.isUploading = false
                    this.documentoModal = true
                } else {
                    return toastr.error("Ha ocurrido un error", "Error!");
                }
            } catch (error) {
                console.log('error', error)
                toastr.error("Ha ocurrido un error, contacte al administrador 2","Error!")
            }
        },
        
        ...mapActions("archivosStore", [
            "getCountArchivo",
            "getArchivo",
        ]),

        ...mapActions("logArchivosStore", [
            "postLogArchivo",
        ]),
    },
}

</script>

<style scoped>
    .container {
        display: contents !important;
    }
</style>