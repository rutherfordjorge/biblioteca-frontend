<template>
    <v-container fluid>

        <v-row>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-3' : 'col-6'"
            >
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="open"
                    v-if="conocimiento != null ? conocimiento.rolid == parseInt(currentUser.Rol) : false"
                >
                    NUEVO ARCHIVO
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
            <template v-slot:item.acciones="{ item }">
                
                <ver-archivo 
                    :key="item.id" 
                    :item="item"
                    
                />
                <!-- v-if="item.materia.clasificacion != 'S'" -->
                
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
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VerArchivo from "@/components/verArchivo"

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
	},
	data: () => ({
        page: 1,
        oldPage: 1,
        items: 10,
        busqueda: "",
        oldBusqueda: "",

		headers: [
            { text: 'Colección', value: 'coleccion.nombre', align: 'left', sortable: false, width: '15%' },
            { text: 'Nombre', value: 'nombre', align: 'left', sortable: false, width: '15%' },
            { text: 'Descripción', value: 'descripcion', align: 'left', sortable: false, width: '40%' },
            { text: 'Edición', value: 'edicion', align: 'left', sortable: false, width: '10%' },
            { text: 'Clasificación', value: 'clasificacion.nombre', align: 'left', sortable: false, width: '10%' },
            { text: 'Acciones', value: 'acciones', align: 'right', sortable: false, width: '10%' },
        ],
        rules: {
            required:[
                v => !!v || "Este campo es requerido",
            ],
            requiredList:[
                v => v.length > 0 || "Este campo es requerido",
            ],
        },
        itemsPerPage: [
            5, 10, 50
        ],

        clasificaciones: [],
        colecciones: [],
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
        ...mapGetters("bibliotecaStore", ["archivos", "pages", "isLoading"]),
        ...mapGetters(["currentUser"]),
    },
    async created() {
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

        await this.getData()

    },
    methods: {
        async getData() {
            await this.getArchivos({ 
                page: this.page,
                items: this.items,
                search: this.busqueda,
                conocimientoId: this.conocimientoId,
            });
        },

        open() {

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
            "getClasificacion"
        ]),

        ...mapActions("coleccionesStore", [
            "getColecciones",
        ]),

        ...mapActions("conocimientosStore", [
            "getConocimientoById"
        ]),
    }
}

</script>