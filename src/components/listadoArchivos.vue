<template>
    <v-container fluid>
        <v-row>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-6' : 'col-6'"
            >
                <v-btn
                    color="primary"
                    dark
                    class="ma-2"
                    @click="open"
                    v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false"
                >
                    NUEVO ARCHIVO <v-icon right>mdi-plus</v-icon>	
                </v-btn>

                <!-- esto estaba abajo v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false" -->
                <v-btn
                    color="secondary" 
                    dark
                    class="ma-2"
                    @click="openAccess"
                    v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false"
                >
                    ACCESO <v-icon right>mdi-account-star</v-icon>	
                </v-btn>

                <!-- SOLO PERFIL DIVDOC -->
                <v-btn
                    color="secondary"
                    outlined
                    class="ma-2"
                    v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false"
                    :to="{ name: `estadistica`, params: { id: conocimientoId } }"
                >
                    ESTADÍSTICAS <v-icon right>mdi-chart-histogram</v-icon>	
                </v-btn>

                <!-- SOLO PERFIL DIVDOC -->
                <v-btn
                    color="secondary"
                    outlined
                    class="ma-2"
                    v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false"
                    :to="{ name: `auditoria`, params: { id: conocimientoId } }"
                >
                    AUDITORÍA <v-icon right>mdi-book-open-page-variant</v-icon>	
                </v-btn>

            </v-col>
            
            <v-spacer></v-spacer>

            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-2' : 'col-6'"
            >
                <v-select
                    v-model="items"
                    :items="itemsPerPage"
                    label="Cant por pág"
                    outlined
                    dense
                ></v-select>
            </v-col>

            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-4' : 'col-12'"
            >
                <v-text-field
                    v-model="busqueda"
                    :append-icon="busqueda != oldBusqueda ? 'mdi-magnify-plus-outline' : 'mdi-magnify'"
                    label="Buscar en el listado"
                    @click:append="buscar"
                    @change="buscar"
                    hint="Criterio de búsqueda + 'ENTER'"
                    outlined
                    dense
                />
            </v-col>
            
        </v-row>

        <v-data-table
            :headers="headers"
            :loading="isLoading"
            loading-text="Cargando... por favor espere"
            :items="archivos"
            disable-pagination
            hide-default-footer
        >
            <!-- Imprime descripcion del estado del archivo -->
            <template v-slot:item.estado="{ item }">
                {{ item.estadO_SIGLA.nombre }}
            </template>

            <template v-slot:item.acciones="{ item }">
                
                <ver-archivo 
                    :key="item.id" 
                    :item="item"
                    v-if="item.digitalid != null && (item.acceso || conocimiento.rolid == parseInt(currentUser.Rol))"
                />

                <v-tooltip
                    top
                    v-if="item.digitalid != null && !item.acceso && conocimiento.rolid != parseInt(currentUser.Rol)"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on"
                        >
                            <v-icon>mdi-file-document</v-icon>
                        </v-btn>
                    </template>
                    <span>Documentación Reservada o Secreta, solicite el acceso al Operador de este contenedor</span>
                </v-tooltip>

                <subir-archivo 
                    :key="item.id" 
                    :item="item" 
                    @updated="getData"
                    v-if="
                        item.digitalid == null 
                        && conocimiento.rolid == parseInt(currentUser.Rol)
                    "
                >
                    <v-icon>mdi-upload</v-icon>
                </subir-archivo>

                <subir-archivo 
                    :key="item.id+item.nombre" 
                    :item="item" 
                    @updated="getData"
                    v-else-if="
                        item.digitalid != null 
                        && conocimiento.rolid == parseInt(currentUser.Rol)
                    "
                >
                    <v-icon>mdi-autorenew</v-icon>
                </subir-archivo>

                <v-tooltip 
                    top 
                    v-if="conocimiento.rolid == parseInt(currentUser.Rol)"
                >
                    <template v-slot:activator="{ on }">
                        <v-icon small class="mr-2" v-on="on" @click="editItem(item)">mdi-pencil</v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>
                <!-- v-if="item.materia.clasificacion != 'S'" -->
                
                <!-- para borrar -->

                <v-tooltip 
                    top
                    v-if="conocimiento.rolid == parseInt(currentUser.Rol)"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" @click="DeleteArchivo(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Eliminar Documento</span>
                </v-tooltip>  

                    <!-- para confirmar borrar -->
                    
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
                                    Está a punto de quitar este registro, esta acción es permanente, ¿desea continuar?.
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
                        @click="confirmDeleteArchivo"
                        >
                        Si, Quitar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            </template>
        </v-data-table>

        <!-- PAGINACIÓN SERVER SIDE -->
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
        
        <!-- Dialog crear archivo -->
        <v-dialog 
            v-model="crearArchivoModal"
            persistent
            :max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
        >
            <v-card>
                <v-card-title class="grey darken-4">
                    <span class="text-h5 white--text">{{ formTitle }}</span>
                    <v-spacer />
                    <v-btn 
                        icon
                        dark
                        size="x-small"
                        class="float-end ma-2"
                        @click="crearArchivoModal = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                
                    <v-form v-model="validForm" ref="form">

                            <v-row class="mt-4">

                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-text-field
                                        label="Nombre"
                                        outlined
                                        v-model="editedItem.nombre"
                                        :rules="rules.required"
                                        counter="40"
                                    ></v-text-field>
                                </v-col>

                                <v-col
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-select
                                        label="Edición"
                                        outlined
                                        v-model="editedItem.edicion"
                                        :rules="rules.required"
                                        :items="años"
                                        hint="Año de la edición o de publicación."
                                        persistent-hint
                                    ></v-select>
                                </v-col>
                                
                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-autocomplete
                                        v-model="editedItem.coleccionid"
                                        outlined
                                        :items="colecciones"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Colección"
                                        :hint="colecciones.length == 0 ? `Debe tener al menos una colección, comuníquese con un administrador` : `Puede digitar un criterio para buscar.`"
                                        :persistent-hint="colecciones.length == 0"
                                        :rules="rules.required"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-autocomplete
                                        v-model="editedItem.clasificacionid"
                                        outlined
                                        :items="clasificaciones"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Clasificación"
                                        :hint="`Puede digitar un criterio para buscar.`"
                                        :rules="rules.required"
                                    ></v-autocomplete>
                                </v-col>

                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-textarea
                                        label="Descripción"
                                        outlined
                                        :rules="rules.requiredArea"
                                        v-model="editedItem.descripcion"
                                        counter="300"
                                    ></v-textarea>
                                </v-col>
                                
                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-textarea
                                        label="Metadatos"
                                        outlined
                                        :rules="rules.requiredArea"
                                        v-model="editedItem.meta"
                                        counter="500"
                                        hint="Ejemplo: Autor, Editorial, ISBN, etc."
                                        persistent-hint
                                    ></v-textarea>
                                </v-col>
                                
                                <v-col 
                                    :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
                                >
                                    <v-autocomplete
                                        v-model="editedItem.estado"
                                        outlined
                                        :items="estado"
                                        item-text="nombre"
                                        item-value="id"
                                        label="Estado"
                                        :hint="`Debe tener al menos un estado.`"
                                        :rules="rules.required"
                                    ></v-autocomplete>
                                </v-col>

                            </v-row>

                    </v-form>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="secondary"
                        text
                        outlined
                        @click="crearArchivoModal = false"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="save"
                        :loading="isLoading"
                        :disabled="isLoading || colecciones.length == 0"
                    >
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
            
        </v-dialog>

        <!-- Dialog de accesos -->
        <v-dialog 
            v-model="accesosModal"
            persistent
            :max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
        >
            <v-card>
                <v-card-title class="grey darken-4">
                    <span class="text-h5 white--text">Control de Acceso</span>
                    <v-spacer />
                    <v-btn 
                        icon
                        dark
                        size="x-small"
                        class="float-end ma-2"
                        @click="accesosModal = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                
                    <accesos v-if="this.currentUser.Rol" :conocimientoId="conocimientoId" />

                </v-card-text>
            </v-card>
            
        </v-dialog>

    </v-container>
</template>

<script>

import { mapActions, mapGetters } from "vuex";
import VerArchivo from "@/components/verArchivo"
import SubirArchivo from "@/components/subirArchivo";

// Accesos
import Accesos from "@/components/accesos";

// Notificación
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
	name: 'listadoArchivos',
    props: {
        conocimientoId: {
            type: Number,
            required: true,
        },
    },
    components: {
		VerArchivo,
        SubirArchivo,
        Accesos,
	},
	data: () => ({
        page: 1,
        oldPage: 1,
        items: 10,
        busqueda: "",
        oldBusqueda: "",
        deleteDialog: false,
        idArchivoEliminar: null,
        crearArchivoModal: false,
        accesosModal:false,
        validForm: false,
        editedIndex: -1,
        editedItem: {
            // solo para put
            id: null,
            digitalid: null,
            // elementos para post
            conocimientoid: null,
            coleccionid: null,
            clasificacionid: null,
            estado: null,
            nombre: null,
            descripcion: null,
            edicion: null,
            meta: null,
            
        },

        defaultItem: {
            id: null,
            digitalid: null,
            conocimientoid: null,
            coleccionid: null,
            clasificacionid: null,
            estado: null,
            nombre: null,
            descripcion: null,
            edicion: null,
            meta: null,
        
        },

		headers: [
            { text: 'Colección', value: 'coleccion.nombre', align: 'left', sortable: false, width: '15%' },
            { text: 'Nombre / Código', value: 'nombre', align: 'left', sortable: false, width: '15%' },
            { text: 'Descripción', value: 'descripcion', align: 'left', sortable: false, width: '30%' },
            { text: 'Edición', value: 'edicion', align: 'left', sortable: false, width: '10%' },
            { text: 'Clasificación', value: 'clasificacion.nombre', align: 'left', sortable: false, width: '10%' },
            { text: 'Estado', value: 'estado', align: 'left', sortable: false, width: '10%' },
            { text: 'Acciones', value: 'acciones', align: 'right', sortable: false, width: '10%' },
        ],
        rules: {
            required:[
                v => !!v || "Este campo es requerido",
            ],
            requiredList:[
                v => v.length > 0 || "Este campo es requerido",
            ],
            requiredArea:[
                v => v? v.length < 500 || "El campo debe tener menos de 500 caracteres": "Este campo es requerido",
            ],
        },
        itemsPerPage: [
            5, 10, 50
        ],
        estado: [],
        clasificaciones: [],
        colecciones: [],
        años: [],
        conocimiento: null,
    }),

    watch: {
        async dialog (val) {
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
        async items() {
            this.page = 1;
            await this.getData()
        },
        
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 && this.currentUser ? `Nuevo Archivo` : `Editar Archivo`
        },

        ...mapGetters("bibliotecaStore", ["archivos", "pages", "isLoading"]),
        ...mapGetters(["currentUser"]),
    },
    async created() {
        
        for (var i = 2025; i > 1980; i--) {
            this.años.push(i)
        }

        const respCla = await this.getClasificacion()
        if (respCla.status == 200) {
            this.clasificaciones = respCla.data
        }
        
        const respCol = await this.getColecciones(this.conocimientoId)
        
        if (respCol.status == 200) {
            this.colecciones = respCol.data
        }

        const respCon = await this.getConocimientoById(this.conocimientoId)
        if (respCon.status == 200) {
            this.conocimiento = respCon.data
        }

        const respEst = await this.getEstados()
        if (respEst.status == 200) {
            this.estado = respEst.data
        }

        await this.getData()

    },
    methods: {

        getEstadoNombre(id) {
                const estado = this.estados.find(e => e.id === id);
                return estado ? estado.nombre : 'Desconocido';
        },

        async getData() {
            await this.getArchivos({ 
                page: this.page,
                items: this.items,
                search: this.busqueda,
                conocimientoId: this.conocimientoId,
            });

                
                // Mapear los IDs de los estados v/s nombres
        //         this.archivos = this.archivos.map(archivo => {
        //         const estado = this.estado.find(e => e.id === archivo.estado);
        //         return {
        //         ...archivo,
        //         estadoNombre: estado ? estado.nombre : 'Desconocido'
        //     };
        // });

        },

        open() {
            this.resetValidation()
            this.editedIndex = -1
            this.editedItem = Object.assign({}, this.defaultItem)
            this.crearArchivoModal = true
        },

        openAccess() {
            this.accesosModal = true
        },

        editItem(item) {
            this.resetValidation()
            this.editedIndex = this.archivos.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.crearArchivoModal = true
        },

        //funcion para borrar

        async DeleteArchivo(item){
            // console.log('elimina: ', item.id)
        this.idArchivoEliminar = item.id
        this.deleteDialog = true
        },

        async confirmDeleteArchivo(){
            // await this.deleteArchivo(item.id)
            this.deleteArchivo(this.idArchivoEliminar).then(async resp => {
                if (resp.status == 200) {
                    toastr.success("Se ha eliminado el archivo correctamente", "Éxito!")
                    await this.getData()
                }
                else {
                    toastr.error("Ha ocurrido un problema al eliminar el registro.", "Error")
                }
            })
            await this.getData()
            this.deleteDialog = false
            // await setTimeout(() => {
            
            // }, 300);
        },

        async save() {
            this.validate();
            if (this.validForm) {
                
                if (this.editedIndex > -1) {
                    //debe ser un llamado asincrono para poder ver el resultado en vue sin utilizar promesas.
                    
                    const payload = {
                        id: this.editedItem.id,
                        digitalid: this.editedItem.digitalid,
                        conocimientoid: this.editedItem.conocimientoid,
                        coleccionid: this.editedItem.coleccionid,
                        clasificacionid: this.editedItem.clasificacionid,
                        estado: this.editedItem.estado,
                        nombre: this.editedItem.nombre,
                        descripcion: this.editedItem.descripcion,
                        edicion: this.editedItem.edicion,
                        meta: this.editedItem.meta,
                    }
                    const res = await this.putArchivo(payload);
                    
                    if (res.status == 200) {
                        toastr.success("Se ha actualizado la información correctamente", "Éxito!");
                        await this.getData()
                    }
                    else {
                        toastr.error("Ha ocurrido un error", "Error!");
                        return;
                    }
                } else {
                    await this.postArchivo({
                        conocimientoid: this.conocimientoId,
                        coleccionid: this.editedItem.coleccionid,
                        clasificacionid: this.editedItem.clasificacionid,
                        estado: this.editedItem.estado,
                        nombre: this.editedItem.nombre,
                        descripcion: this.editedItem.descripcion,
                        edicion: this.editedItem.edicion,
                        meta: this.editedItem.meta,
                    })
                    .then(async resp => {
                        if (resp.status == 200) {
                            toastr.success("Se ha creado correctamente el borrador del archivo", "Éxito!");
                            this.page = 1
                            await this.getData()
                        }
                        else {
                            if (resp.status == 409) {
                                toastr.error(resp.message, "Error!");
                                return;
                            }
                            else if (resp.status == 401) {
                                toastr.error(resp.message, "Error!");
                                return;
                            }
                            else {
                                toastr.error(`Error ${resp.status} no manejado por el sistema, por favor comuníquese con un administrador`, "Error!");
                                return;
                            }
                        }
                    });
                }
                this.crearArchivoModal = false
            }
        },

        async buscar() {
            if (this.busqueda != this.oldBusqueda) {
                await this.getData()
                this.oldBusqueda = this.busqueda
                this.page = 1
            }
        },

        resetValidation(){
            if(this.$refs.form){
                //limpia los mensajes de validación de formulario abiertos previamente
                this.$refs.form.resetValidation();
            }
        },

        validate() {
            this.$refs.form.validate();
        },

        getFormatFecha(d, sec = false) {
            const date = new Date(d)
            let formatedDate = [
                (date.getDate()).toString().padStart(2, "0"),
                (date.getMonth() + 1).toString().padStart(2, "0"),
                date.getFullYear(),
            ].join('-')
            
            if (sec) {
                formatedDate += " " + [
                    date.getHours().toString().padStart(2, "0"),
                    date.getMinutes().toString().padStart(2, "0"),
                    date.getSeconds().toString().padStart(2, "0"),
                ].join(":")
            }
            return formatedDate
        },

        ...mapActions("bibliotecaStore", [
            "getArchivos",
            "postArchivo",
            "putArchivo",
            "getClasificacion",
            "getEstados",
            "deleteArchivo"
        ]),

        ...mapActions("coleccionesStore", [
            "getColecciones",
        ]),

        ...mapActions("conocimientosStore", [
            "getConocimientoById"
        ]),
        ...mapActions("auditorStore", [
            "contarTipoyClasificacion"]),

    }
}

</script>