<template>
    <v-container>
        
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    v-on="on" 
                    @click="addPdf(item)"
                >
                    <slot></slot>
                </v-btn>
            </template>
            <span>Subir/Cambiar Archivo</span>
        </v-tooltip>

        <!-- Dialog para subir archivo -->
        <v-dialog 
            v-model="addPdfModal"
            persistent
            :max-width="$vuetify.breakpoint.mdAndUp ? '45vw' : '85vw'"
        >
            <v-card>
                <v-card-title class="grey darken-4">
                    <span class="text-h5 white--text">Adjuntar Archivo</span>
                    <v-spacer />
                    <v-btn 
                        icon
                        dark
                        size="x-small"
                        class="float-end ma-2"
                        @click="addPdfModal = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                
                <v-card-text>
                    <v-form @submit.prevent ref="addPdfForm" v-model="validAddPdfForm">
                        <v-row dense class="text-justify">
                            
                            <v-col cols="12" class="px-4 mt-4">
                                <v-file-input
                                    type="file"
                                    id="docpicker"
                                    accept=".pdf"
                                    label="Documento"
                                    chips
                                    outlined
                                    counter
                                    show-size
                                    hint="Pinche dentro del contendor y seleccione un documento .pdf para subir"
                                    persistent-hint
                                    v-model="nuevoDocumento"
                                />

                            </v-col>

                            <v-col cols="12" class="px-4 mt-4">
                                <v-btn
                                    type="submit"
                                    class="ma-2"
                                    style="float: right;"
                                    :loading="isUploading"
                                    :disabled="isUploading || nuevoDocumento == null"
                                    color="primary"
                                    @click="subirArchivo"
                                    prepend-icon="mdi-upload"
                                >
                                    Subir Archivo
                                </v-btn>
                            </v-col>

                        </v-row>
                    </v-form>
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
import { mapActions } from "vuex";

// Notificación
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
    name: "subirArchivo",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        isUploading: false,
        progreso: 0,
        addPdfModal: false,
        validAddPdfForm: false,
        nuevoDocumento: null,
    }),
    computed: {
        
    },
    watch: {
        progreso(val) {
            if (val <= 100) return;
            this.progreso = 0;
        },
    },
    methods: {
        addPdf() {
            this.resetValidation();

            this.addPdfModal = true;
        },

        resetValidation(){
            if(this.$refs.addPdfForm)
                this.$refs.addPdfForm.resetValidation();
        },

        toBase64: (file) => new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        }),

        async subirArchivo() {
            this.progreso = 0
            this.addPdfModal = false
            this.isUploading = true

            const result = await this.toBase64(this.nuevoDocumento);
            const base64 = result.replace("data:application/pdf;base64,", "");
            const Count = base64.length;
            const chunkSize = 500000;
            const totalBloques = Count / chunkSize;

            let archivo = {
                ID: 0,
                NUMERO: 1,
                NOMBRE: this.nuevoDocumento.name,
                DESCRIPCION: this.item.nombre,
                BASE64: "",
                EXTENCION: this.nuevoDocumento.name.replace(/^.*\./, ""),
                NOMBRE_TABLA_ORIGEN: "DOCUMENTOS",
                ID_DATO_TABLA_ORIGEN: this.item.id,
                ID_TIPO_ARCHIVO: 9, // documento
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
                        this.progreso = Math.trunc(
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
                    
                    await this.putActivaArchivo(res.data.id).then(resp => {
                        if (resp.status != 200) {
                            toastr.error(resp.message, "Error!");
                            this.isUploading = false
                            this.addPdfModal = true
                            return;
                        }
                    });

                    await this.putArchivosDigitalId({id: this.item.id, digitalId: res.data.id})
                    .then(resp => {
                        if (resp.status == 200) {
                            toastr.success("Documento Ingresado","Éxito!")
                        } else {
                            toastr.error(resp.message, "Error!");
                            this.isUploading = false
                            this.addPdfModal = true
                            return;
                        }
                    });

                } else {
                    toastr.error(res.message, "Error!");
                    this.isUploading = false
                    this.addPdfModal = true
                    return;
                }
            });
            
            // emitir para actualizar componente padre
            this.$emit("updated");

            this.isUploading = false
        },
        ...mapActions("bibliotecaStore", [
            "putArchivosDigitalId",
        ]),
        ...mapActions("archivosStore", [
            "postArchivo",
            "putBase64Archivo",
            "putActivaArchivo",
        ]),
    },
}

</script>

<style scoped>
    .container {
        display: contents !important;
    }
</style>