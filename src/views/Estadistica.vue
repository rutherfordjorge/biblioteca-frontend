<template>
    <v-container fluid>
        <v-col cols="12" class="text-center">
            <h2>Gestión de Estadisticas de la Biblioteca Virtual</h2>
        </v-col>
        <v-col cols="12" class="text-center">
            <h4>Modulo en creacion</h4>
        </v-col>
        <v-card class="elevation-0">
       

            <v-container fluid>
  
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "usuarios",
    data: () => ({
        search: "",
        dialog: false,
        editedItem:{
            run: null,
            persona: {},
            rol: {},
            unidad: {},
            creacion: Date.now(),
            estado: 1,
        },
        editItemRunValidated: false,
        defaultItem:{
            run: null,
            persona: {},
            rol: {},
            unidad: {},      
            creacion: Date.now(),
            estado: 1,
        },
        editedIndex: -1,
        validForm: false,
        rules: {
            rut: [
                (v) => !!v || "El RUN del usuario es requerido",
                (v) => (v && isNaN(v) == false) || "Debe ingresar solo números",
            ],
            required:[
                (v) => !!v || "Este campo es requerido",
            ],
        },
        headers: [
            { text: "Grado", value: "persona.grado", groupable: false, sortable: false},
            { text: "Nombre Completo", value: "persona.nombre", groupable: false, sortable: false},      
            { text: "Unidad", value: "unidad.sigla" },
            { text: "Creación", value: "creacion" },
            { text: "Estado", value: "estado" },
            { text: "Acciones", value: "acciones", sortable: false, align: 'right'},
            { text: "Acciones", value: "acciones", sortable: false, align: 'right'},
            { text: "Acciones", value: "acciones", sortable: false, align: 'right'},
            { text: "Acciones", value: "acciones", sortable: false, align: 'right'},
            { text: "Acciones", value: "acciones", sortable: false, align: 'right'},

        ],
        roles: [],
        unidades: [],
        estados: [
            {
                id: 1,
                nombre: 'Activo'
            },
            {
                id: 0,
                nombre: 'Borrado'
            },
        ],
    }),
    computed: {
                
        ...mapGetters(["currentUser"]),
        ...mapGetters("usuariosStore", ["usuarios", "isLoading"]),
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
    },
    async mounted() {
        this.getUsuarios();
        
        const respUnidades = await this.getUnidades();
        this.unidades = respUnidades.data;
        
        const respRoles = await this.getRoles();
        this.roles = respRoles.data;
    },
    methods: {
        getFormatFecha(f) {
            let fechaToISO = new Date(f).toISOString().substring(0,10);
            let fecha = `${fechaToISO.substring(8,10)}/${fechaToISO.substring(5,7)}/${fechaToISO.substring(0,4)}`;
            return fecha;
        },
        async buscarPersonal() {
            if(this.editedItem.run) {
                const resp = await this.getPersona(this.editedItem.run);

                if(resp.status == 200) {
                    this.editedItem.persona = {
                        grado: resp.data.grado,
                        nombre: resp.data.nombre,
                        apellidO_PATERNO: resp.data.apellidO_PATERNO
                    }
                    this.editItemRunValidated = true;
                }
                else {
                    this.$toastr("warning", "No se ha encontrado una persona con ese RUN", "Éxito!");
                }
            }
        },
        editItem (item) {
            if(this.$refs.form) 
                this.$refs.form.resetValidation();//limpia los mensajes de validación de formulario abiertos previamente

            //deshabilita el formulario cuando no se ha ingresado un run en la creación de usuario
            this.editItemRunValidated = this.editedItem === -1 ?  false : true;
            
            this.editedIndex = this.usuarios.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        close () {
            this.editItemRunValidated = false;

            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            })
        },

        async save () {
            this.validate();
            if (this.validForm) {
                if (this.editedIndex > -1) {
                    //debe ser un llamado asincrono para poder ver el resultado en vue sin utilizar promesas.
                    const res = await this.putUsuario(this.editedItem);

                    if (res.status == 200) {
                        this.$toastr("success", "Se ha actualizado la información correctamente", "Éxito!");
                        Object.assign(this.usuarios[this.editedIndex], this.editedItem)
                    }
                    else {
                        this.$toastr("error", "Ha ocurrido un error", "Error!");
                        return;
                    }          
                } else {
                    await this.postUsuario(this.editedItem)
                    .then((resp) => {
                        if (resp.status == 200) {
                            this.$toastr("success", "Se registro el nuevo usuario correctamente", "Éxito!");
                            this.usuarios.push(this.editedItem)
                        }
                        else {
                            if (resp.status == 409) {
                                this.$toastr("error", "Esta persona ya tiene una cuenta de usuario activa en el sistema", "Error!");
                                return;
                            }
                            else if (resp.status == 401) {
                                this.$toastr("error", "No tiene los permisos en el sistema para crear usuarios", "Error!");
                                return;
                            }
                            else if (resp.status == 406) {
                                this.$toastr("error", "Debe seleccionar un Rol y una Unidad por favor", "Error!");
                                return;
                            }
                            else if (resp.status == 404) {
                                this.$toastr("error", "Esta persona no está activa en la base de personal", "Error!");
                                return;
                            }
                            else {
                                this.$toastr("error", `Error ${resp.status} no manejado por el sistema, por favor comuníquese con un administrador`, "Error!");
                                return;
                            }
                        }
                    });
                }
                this.close()
            }
        },
        
        validate() {
            this.$refs.form.validate();
        },
        ...mapActions("usuariosStore", [
            "getUsuarios",
            "postUsuario", 
            "putUsuario",
            "getRoles", 
            "getUnidades", 
            "getPersona"
        ]),
    },
};
</script>
