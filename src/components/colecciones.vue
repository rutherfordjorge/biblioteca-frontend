<template>
    <v-container fluid>
        
        <v-row>
            <v-col cols="12" class="text-center">
                <span class="title">COLECCIONES</span>
            </v-col>
        </v-row>

        <v-row>
            <v-col
                :class="$vuetify.breakpoint.mdAndUp ? 'col-3' : 'col-12'"
            >
                <v-btn
                    color="primary"
                    dark
                    @click="dialog=true"
                >
                    NUEVA COLECCIÓN
                </v-btn>
            </v-col>
        </v-row>

        <v-data-table
            :headers="headers"
            :loading="isLoading"
            loading-text="Cargando... por favor espere"
            :items="colecciones"
        >
            <template v-slot:item.acciones="{ item }">
                
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn
                            icon
                            v-on="on" 
                            @click="confirmDeleteItem(item)"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Eliminar Colección</span>
                </v-tooltip>
                
            </template>
            
            <!-- PERSONALZACIÓN DE LA TABLA -->
            <template v-slot:no-data>
                No existen colecciones creadas para esta fuente del conocimiento.
            </template>

        </v-data-table>
            
        <v-dialog
            v-model="dialog"
            persistent
            :max-width="$vuetify.breakpoint.mdAndUp ? '45vw' : '85vw'"
        >
            <v-card>
                <v-card-title class="primary">
                    <span class="text-h5 white--text">{{ formTitle }}</span>
                    <v-spacer />
                    <v-btn dark icon @click="close">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-form v-model="validForm" ref="form">
                        <v-container>
                            <v-row>
                                <v-col 
                                    cols="12"
                                    v-if="editedIndex === -1"
                                >
                                    <v-text-field
                                        label="Nombre"
                                        outlined
                                        v-model="editedItem.nombre"
                                        counter="100"
                                    ></v-text-field>
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
                        @click="close"
                    >
                        Cancelar
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="save"
                    >
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// Notificación
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
    name: "Anexos",
    props: {
        conocimientoId: {
            type: Number,
            required: true,
        },
    },
    components:{

    },
    data: () => ({
        colecciones: [],
        headers: [
            { text: 'Código', value: 'id', align: 'left', sortable: false, width: '20%' },
            { text: 'Nombre', value: 'nombre', align: 'left', sortable: false, width: '60%' },
            { text: 'Acciones', value: 'acciones', align: 'right', sortable: false, width: '20%' },
        ],
        dialog: false,
        editedIndex: -1,
        validForm: false,
        editedItem: {
            id: null,
            nombre: null,
        },
        defaultItem: {
            id: null,
            nombre: null,
        },
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nueva colección' : 'Editar colección'
        },
        ...mapGetters("coleccionesStore", [
            "isLoading",
        ]),
    },
    watch: {
        async dialog (val) {
            
            val || this.close();
        },
    },
    async beforeMount() {
        await this.getData()
    },
    methods: {
        async getData() {
            const resp = await this.getColecciones(this.conocimientoId)
            this.colecciones = resp.data
        },

        async save() {
            // console.log(item)
            const resp = await this.postColeccion({
                conocimientoId: this.conocimientoId,
                nombre: this.editedItem.nombre
            })

            if (resp.status == 200) {
				toastr.success("Se agregó la colección correctamente", "Éxito!")
                await this.getData()
                this.close()
			}
            else {
                toastr.error("Ha ocurrido un problema", "Error")
            }
        },
        async confirmDeleteItem(item){
            const resp = await this.deleteColeccion(item.id)
            
            if (resp.status == 200) {
				toastr.success("Se ha eliminado el registro", "Éxito!")
                await this.getData()
                this.close()
			}
            else {
                toastr.error("Ha ocurrido un problema", "Error")
            }
        },
        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                // asigna el código de unidad con el que se crean nuevos registros
                this.editedIndex = -1;
            })
        },
        
        validate() {
            this.$refs.form.validate();
        },

        ...mapActions("coleccionesStore", [
            "getColecciones",
            "postColeccion",
            "putColeccion",
            "deleteColeccion",
        ]),
    },
};
</script>