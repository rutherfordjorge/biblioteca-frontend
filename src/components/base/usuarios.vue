<template>
    <v-container fluid>

        <v-row>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-2' : 'col-6'"
            >
                <v-btn
                    v-if="editable"
                    color="primary"
                    dark
                    @click="saveDialog=true"
                >
                    NUEVO USUARIO
                    <v-icon right>mdi-plus</v-icon>
                </v-btn>
            </v-col>

            <v-spacer></v-spacer>
            
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-2 text-right' : 'col-6 text-right'"
            >
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-chip
                            v-if="editable"
                            v-on="on"
                            :color="!deletedLess ? 'blue' : 'red'"
                            outlined
                            @click="borradosToggle"
                            class="mt-1"
                        >
                            <span class="mr-2">{{ !deletedLess ? 'Todos los usuarios' : 'Excluye expirados' }}</span>
                            <v-spacer />
                            <v-icon small>{{ !deletedLess ? 'mdi-account-multiple-minus' : 'mdi-account-multiple-plus' }}</v-icon>
                        </v-chip>
                    </template>
                    <span>{{ !deletedLess ? 'Presione para excluir cuentas expiradas' : 'Presione para ver todas las cuentas' }}</span>
                </v-tooltip>
            </v-col>
            
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
            </v-col>
            
        </v-row>

        <v-data-table
            :headers="headers"
            :loading="isLoading"
            loading-text="Cargando... por favor espere"
            :items="usuarios"
            disable-pagination
            hide-default-footer
        >

            <template v-slot:item.nombres = "{ item }">
                {{ item.persona.nombres }} {{ item.persona.apellidO_PATERNO }} {{ item.persona.apellidO_MATERNO }}
            </template>

            <template v-slot:item.creacion = "{ item }">
                {{ getFormatFecha(item.creacion) }}
            </template>

            <template v-slot:item.estado = "{ item }">
                <v-chip
                    small
                    :color="item.estado == 1 ? 'green' : 'grey'"
                    outlined
                >
                    {{ item.estado == 1 ? 'ACTIVO' : 'EXPIRADO'}}
                </v-chip>
            </template>

            <template v-slot:item.acciones="{ item }">
                
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on" 
                            @click="editItem(item)"
                            v-if="editable"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar Usuario</span>
                </v-tooltip>
                
            </template>
            
            <!-- PERSONALZACIÓN DE LA TABLA -->
            <template v-slot:no-data>
                No se han encontrado usuarios registrados en el sistema
            </template>

        </v-data-table>

        <v-row class="text-center" dense>
            <v-col cols="12">
                <v-pagination
                    v-model="page"
                    :length="pages"
                    :total-visible="items"
                    :disabled = "isLoading || pages == 1"
                ></v-pagination>
                <br />
            </v-col>
        </v-row>

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
                                        v-if="!editedItem.run"
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
                                        v-model="editedItem.rol"
                                        outlined
                                        :items="roles"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Perfiles de usuario"
                                        return-object
                                        :disabled="!editedItem.run ? true : false"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col cols="12">
                                    <v-autocomplete
                                        v-model="editedItem.unidad"
                                        outlined
                                        :items="unidades"
                                        :item-text="getUnidadText"
                                        item-value="codigo"
                                        label="Unidad de Uso"
                                        return-object
                                        :disabled="!editedItem.run ? true : false"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col cols="12">
                                    <v-autocomplete
                                        v-model="editedItem.estado"
                                        outlined
                                        :items="estados"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Estado del perfil"
                                        :disabled="!editedItem.run ? true : false"
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
                        :disabled="!editedItem.run ? true : false"
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
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import AddPersona from "@/components/base/addPersona"

export default {
    name: "usuarios",
    props: {
        editable: {
            type: Boolean,
            required: false,
            default: false,
        },
        unidadCodigo: {
            type: String,
            required: false,
            default: '',
        },
    },
    components:{
        AddPersona,
    },
    data: () => ({
        usuarios: [],
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
            run: null,
            persona: {},
            rol: {},
            unidad: {},
            estado: 1,
        },
        defaultItem: {
            run: null,
            persona: {},
            rol: {},
            unidad: {},
            estado: 1,
        },
        headers: [
            { text: "Grado", value: "persona.grado", groupable: false, sortable: false },
            { text: "Nombre Completo", value: "nombres", groupable: false, sortable: false, width: '30%' },      
            { text: "Unidad", value: "unidad.sigla" , groupable: false, sortable: false },
            { text: "Rol", value: "rol.nombre" , groupable: false, sortable: false },
            { text: "Fono", value: "persona.movil" , groupable: false, sortable: false },
            { text: "Correo", value: "persona.correointer" , groupable: false, sortable: false },
            { text: "Creación", value: "creacion" , groupable: false, sortable: false },
            { text: "Estado", value: "estado" , groupable: false, sortable: false },
        ],
        rules: {
            required:[
                v => !!v || "Este campo es requerido",
            ],
            requiredList:[
                v => v.length > 0 || "Este campo es requerido",
            ],
        },
        roles: [],
        unidades: [],
        estados: [
            { id: 1, nombre: 'Activo'},
            { id: 0, nombre: 'Borrado'},
        ],
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
        },
        ...mapGetters("usuariosStore", [
            "isLoading",
            "pages",
        ]),
    },
    watch: {
        async saveDialog (val) {
            if (this.editedIndex === -1) {
                this.editedItem.rol = this.roles[0]
                this.editedItem.unidad = this.unidades[0]
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
        
        const respUnidades = await this.getUnidades()
        this.unidades = respUnidades.data

        const respRoles = await this.getRoles()
        this.roles = respRoles.data
    },
    methods: {
        async getData() {
            const resp = await this.getUsuarios({ page: this.page, items: this.items, search: this.search, unidadCodigo: this.unidadCodigo, deletedLess: this.deletedLess ? 'true' : ''  })

            this.usuarios = resp
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
            this.editedItem.run = item.run
            this.personaDialog = false
        },

        async deleteItem(item){
            console.log('elimina: ', item)
            this.deleteDialog = true
        },
        
        async confirmDeleteItem(){
            // await this.deleteReferencia(item.id)
            await this.getData()
        },

        async save () {
            if (this.editedIndex === -1) {
            // es un usuario nuevo
                const resp = await this.postUsuario(this.editedItem);
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
            else {
            // se actualiza el usuario
                const resp = await this.putUsuario(this.editedItem);
                if (resp.status == 200) {
                    this.saveDialog = false
                    await this.getData()
                    toastr.success("Se ha actualizado el usuario correctamente", "Éxito!")
                }
                else {
                    console.log('error al guardar: ', resp)
                    this.saveDialog = false
                    toastr.error("Ha ocurrido un error", "Error!")
                    return;
                }
            }
        },

        async editItem (item) {
            this.editedIndex = this.usuarios.indexOf(item);
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

        ...mapActions("usuariosStore", [
            "getUsuarios",
            "postUsuario",
            "putUsuario",
            "deleteUsuario",
            "getRoles", 
            "getUnidades", 
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