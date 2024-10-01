<template>
    <v-container fluid>

        <v-row>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-2' : 'col-6'"
            >
                <v-btn
                    color="primary"
                    dark
                    @click="saveDialog=true"
                >
                    NUEVO ACCESO
                    <v-icon right>mdi-plus</v-icon>
                </v-btn>
            </v-col>

            <!-- <v-spacer></v-spacer>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-4' : 'col-12'"
            >
                <v-text-field
                    v-model="search"
                    :append-icon="search != oldSearch ? 'mdi-magnify-plus-outline' : 'mdi-magnify'"
                    label="Buscar usuario en el listado"
                    @click:append="buscar"
                    @change="buscar"
                    hint="Escriba su criterio de búsqueda RUN, nombres, unidad o perfil y presione 'ENTER'"
                    outlined
                    dense
                />
            </v-col> -->
            
        </v-row>

        <v-data-table
            :headers="headers"
            :loading="isLoading"
            loading-text="Cargando... por favor espere"
            :items="accesos"
        >

            <template v-slot:item.nombres="{ item }">
                {{  item.persona.nombres }} {{ item.persona.apellidO_PATERNO }} {{ item.persona.apellidO_MATERNO }}
            </template>

            <template v-slot:item.creacion="{ item }">
                {{  getFormatFecha(item.creacion) }}
            </template>

            <template v-slot:item.acciones="{ item }">
                
                <!-- <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on" 
                            @click="editItem(item)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar Acceso</span>
                </v-tooltip> -->

                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on" 
                            @click="deleteItem(item)"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Eliminar Acceso</span>
                </v-tooltip>
            </template>
            
            <!-- PERSONALZACIÓN DE LA TABLA -->
            <template v-slot:no-data>
                No se han encontrado datos que mostrar
            </template>

        </v-data-table>

        <!-- NUEVO O EDITAR USUARIO -->
        <v-dialog
            v-model="saveDialog"
            :max-width="$vuetify.breakpoint.mdAndUp ? '50vw' : '80vw'"
        >
            <v-card>
                <v-card-title class="primary">
                    <span class="text-h5 white--text">{{ formTitle }}</span>
                    <v-spacer />
                </v-card-title>

                <v-card-text>
                    <v-form v-model="validForm" ref="form">
                        <v-container>
                            <v-row>

                                <v-col cols="12" class="text-center mt-2">
                                    <v-btn
                                        color="primary"
                                        text
                                        outlined
                                        @click="personaDialog = true"
                                    >
                                        Buscar Persona
                                        <v-icon>mdi-magnify-plus-outline</v-icon>
                                    </v-btn>
                                </v-col>

                                <v-col cols="12">

                                    <v-alert
                                        border="left"
                                        colored-border
                                        type="info"
                                        prominent
                                        elevation="2"
                                        v-if="!editedItem.persona.run"
                                        class="mt-4"
                                    >
                                        <span class="alerta">
                                            Debe seleccionar una persona desde el botón "Buscar personal"
                                        </span>
                                    </v-alert>

                                    <v-card
                                        color="indigo lighten-5"
                                        elevation="1"
                                        v-else
                                    >
                                        <v-card-text>
                                            <v-row dense>

                                                <v-col cols="4" class="text-center">
                                                    <v-avatar
                                                        size="150px"
                                                        class="mt-2 Avatar"
                                                    >
                                                        <v-img
                                                            lazy-src="/avatar.svg"
                                                            :src="editedItem.persona.foto"
                                                            contain
                                                        />
                                                    </v-avatar>
                                                </v-col>

                                                <v-col cols="8">
                                                    <v-col cols="12">
                                                        GRADO: {{ editedItem.persona.grado }}
                                                    </v-col>
                                                    <v-col cols="12">
                                                        NOMBRES: {{ editedItem.persona.nombres }}
                                                    </v-col>
                                                    <v-col cols="12">
                                                        APELLIDOS: {{ editedItem.persona.apellidO_PATERNO }} {{ editedItem.persona.apellidO_MATERNO }}
                                                    </v-col>
                                                    <v-col cols="12">
                                                        UNIDAD: {{ editedItem.persona.unidad }}
                                                    </v-col>
                                                </v-col>

                                            </v-row>
                                        </v-card-text>
                                    </v-card>

                                </v-col>

                                <v-col cols="12">
                                    <v-autocomplete
                                        v-model="editedItem.tipO_ACCESO"
                                        outlined
                                        :items="tiposAcceso"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Perfiles de usuario"
                                        return-object
                                        :disabled="!editedItem.persona.run ? true : false"
                                    ></v-autocomplete>
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="secondary"
                        text
                        outlined
                        @click="saveDialog=false"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        :disabled="!editedItem.persona.run ? true : false"
                        color="primary"
                        @click="save"
                    >
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- AGREGA PERSONA AL FORMULARIO -->
        <v-dialog
            v-model="personaDialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable
        >
            <v-card>
                <v-card-title class="primary">
                    <span class="text-h5 white--text">BUSCAR PERSONAL</span>
                    <v-spacer />
                    <v-btn dark icon @click="personaDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <add-persona :key="Date.now()" @addPersona="addPersona" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- DIALOG Eliminar -->
        <v-dialog 
            v-model="deleteDialog"
            persistent
            :max-width="$vuetify.breakpoint.mdAndUp ? '50vw' : '80vw'"
        >
            <v-card>
                <v-card-title class="primary">
                    <span class="white--text">
                        Eliminar Acceso
                    </span>
                    <v-spacer />
                    <v-btn dark icon @click="deleteDialog = false">
                    <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="pt-10">
                            <v-alert
                                type="error"
                                prominent
                                border="left"
                                outlined
                            >
                                Está a punto de quitar este permiso, esta acción es permanente, ¿desea continuar?.
                            </v-alert>
                        </v-col>
                </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="secondary"
                        outlined
                        @click="deleteDialog = false"
                    >
                        No, Cancelar
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="confirmDeleteItem"
                    >
                        Si, Quitar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import AddPersona from "@/components/base/addPersona"

export default {
    name: "accesos",
    props: {
        conocimientoId: {
            type: Number,
            required: true,
        },
    },
    components:{
        AddPersona,
    },
    data: () => ({
        accesos: [],
        items: 10,
        page: 1,
        oldPage: 1,
        search: '',
        oldSearch: '',
        saveDialog: false,
        deleteDialog: false,
        personaDialog: false,
        editedIndex: -1,
        validForm: false,
        deletedLess: false,
        editedItem: {
            id: null,
            persona: {},
            tipoAcceso: {},
        },
        defaultItem: {
            id: null,
            persona: {},
            tipoAcceso: {},
        },
        headers: [
            { text: "Grado", value: "persona.grado", groupable: false, sortable: false },
            { text: "Nombre Completo", value: "nombres", groupable: false, sortable: false, width: '40%' },      
            { text: "Tipo de Acceso", value: "tipO_ACCESO.nombre" , groupable: false, sortable: false, width: '20%' },
            { text: "Creación", value: "creacion" , groupable: false, sortable: false },
            { text: "Acciones", value: "acciones" , groupable: false, sortable: false, align: 'right' },
        ],
        rules: {
            required:[
                v => !!v || "Este campo es requerido",
            ],
            requiredList:[
                v => v.length > 0 || "Este campo es requerido",
            ],
        },
        tiposAcceso: [],
        
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
        },
        ...mapGetters("accesosStore", [
            "isLoading",
        ]),
    },
    watch: {
        async saveDialog (val) {
            if (this.editedIndex === -1) {
                this.editedItem.tipO_ACCESO = this.tiposAcceso[0]
            }
            val || this.close();
            this.resetValidation();
        },
        page: {
            deep: true,
            async handler() {
                if (this.page != this.oldPage) {
                    await this.getData();
                    this.oldPage = this.page;
                }
            }
        },
    },
    async beforeMount() {
        if (this.editable){
            this.headers.push({ text: "Acciones", value: "acciones", sortable: false, align: 'right'})
        }
        else {
            this.deletedLess = true
        }

        await this.getData()
        
        const respTiposAcceso = await this.getTipoAccesos()
        this.tiposAcceso = respTiposAcceso.data
    },
    methods: {
        async getData() {
            const resp = await this.getAccesos(this.conocimientoId)
            if (resp.status == 200) {
                // console.log('accesos: ', resp.data)
                this.accesos = resp.data
            }
        },

        async buscar(){
            if (this.search != this.oldSearch) {
                this.oldSearch = this.search;
                this.page = 1;
                await this.getData();
            }
        },

        async borradosToggle() {
            this.deletedLess = !this.deletedLess
            await this.getData()
        },

        async addPersona(item) {
            this.editedItem.persona = item
            this.personaDialog = false
        },

        async deleteItem(item){
            console.log('elimina: ', item)
            this.editedIndex = this.accesos.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.deleteDialog = true
        },
        
        async confirmDeleteItem(){
            await this.deleteAcceso(this.editedItem.id)
            await this.getData()
            await setTimeout(() => {
                this.deleteDialog = false
            }, 300);
        },

        async save () {
            if (this.editedIndex === -1) {
            // es un usuario nuevo
                const payload = {
                    CONOCIMIENTOID: this.conocimientoId,
                    TIPO_ACCESOID: this.editedItem.tipO_ACCESO.id,
                    RUN: this.editedItem.persona.run,
                }
                
                const resp = await this.postAcceso(payload);
                if (resp.status == 200) {
                    this.saveDialog = false
                    await this.getData()
                    toastr.success("Se ha creado el usuario correctamente", "Éxito!")
                }
                else if (resp.status == 409) {
                    this.saveDialog = false
                    toastr.error("El usuario ya existe en este sistema", "Error!")
                    return;
                }
                else {
                    console.log('error al guardar: ', resp)
                    this.saveDialog = false
                    toastr.error("error", "Ha ocurrido un error", "Error!")
                    return;
                }
            }
            // else {
            // se actualiza el usuario
                // const resp = await this.putUsuario(this.editedItem);
                // if (resp.status == 200) {
                //     this.saveDialog = false
                //     await this.getData()
                //     toastr.success("Se ha actualizado el usuario correctamente", "Éxito!")
                // }
                // else {
                //     console.log('error al guardar: ', resp)
                //     this.saveDialog = false
                //     toastr.error("Ha ocurrido un error", "Error!")
                //     return;
                // }
            // }
        },

        async editItem (item) {
            this.editedIndex = this.accesos.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.saveDialog = true;
        },

        close () {
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            })
        },
        
        validate() {
            this.$refs.form.validate();
        },

        resetValidation(){
            if(this.$refs.form) 
                this.$refs.form.resetValidation();//limpia los mensajes de validación de formulario abiertos previamente
        },
        
        getFormatFecha(f) {
            let fechaToISO = new Date(f).toISOString().substring(0,10);
            let fecha = `${fechaToISO.substring(8,10)}/${fechaToISO.substring(5,7)}/${fechaToISO.substring(0,4)}`;

            return fecha;
        },

        getUnidadText(item) {
            // entra solo si existe información en item
            if (item.codigo) {
                return `${item.codigo.toUpperCase()} - ${item.sigla.toUpperCase()} - ${item.descripcion.toUpperCase()}`;
            }
        },

        ...mapActions("accesosStore", [
            "getAccesos",
            "getTipoAccesos",
            "postAcceso",
            "deleteAcceso",
        ]),

        ...mapActions("personasStore", [
            "getPersonas",
        ]),
    },
};
</script>

<style scoped>
.Avatar {
	border: 3px solid #7888E147 !important;
}
</style>