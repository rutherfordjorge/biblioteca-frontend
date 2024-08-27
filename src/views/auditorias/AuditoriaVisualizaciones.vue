<template>
    <v-container fluid>
  <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
        <v-col cols="12" class="text-center">
      <h2>Control de Visualizaciones</h2>
    </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <!-- <b>El objetivo de la “Biblioteca Virtual” es difundir la Doctrina Operacional, la Doctrina de Funcionamiento, la Doctrina Valórica del Ejército y la Doctrina Conjunta, como también, los procedimientos internos establecidos por la institución, permitiendo a todo el personal de planta de la institución el acceso a los textos doctrinarios, base fundamental para el correcto desarrollo de las actividades propias de la función militar.</b> -->
            <b
              >Aca se encuentra el control de visualizacion de la biblioteca virtual</b
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
      <v-card class="elevation-0">

            <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar usuario en el listado"
                    single-line
                    hide-details
                ></v-text-field>         
            </v-card-title>

            <v-container fluid>
                <v-data-table
                    :headers="headers"
                    :loading="isLoading"
                    loading-text="Cargando... por favor espere"
                    :items="listaDocumentosUsuario"
                    :search="search"
                >
                    <template v-slot:item.persona.nombre="{ item }">
                        {{ item.persona.nombre}} {{ item.persona.apellidO_PATERNO }} {{ item.persona.apellidO_MATERNO}}
                    </template>

                    <template v-slot:item.creacion="{ item }">
                        {{ getFormatFecha(item.creacion) }}
                    </template>

                    <template v-slot:item.estado="{ item }">
                        {{ item.estado === 1 ? 'ACTIVO' : '' }}
                        {{ item.estado === 0 ? 'BORRADO' : '' }}
                    </template>

                    <template v-slot:item.acciones="{ item }">
                        
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-icon small class="mr-2" v-on="on" @click="editItem(item)">mdi-pencil</v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "visualizaciones",
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

        headers: [
            { text: "Grado", value: "persona.grado", groupable: false, sortable: false, width: "1%"},
            { text: "RUN", value: "persona.run", groupable: false, sortable: false, width: "5%", align: 'center'},
            { text: "Nombre Completo", value: "persona.nombre", groupable: false, sortable: false, width: "10%"},        
            { text: "paterno", value: "persona.apellidO_PATERNO", groupable: false, sortable: false, align: ' d-none'},
            { text: "materno", value: "persona.apellidO_MATERNO", groupable: false, sortable: false, align: ' d-none'},
            { text: "Unidad", value: "persona.unidad", width: "5%", sortable: false},
            { text: "Ultima conexión", value: "creacion",width: "6%", sortable: false},
            { text: "Documento visualizado", value: "parametros", sortable: false, width: "5%", align: 'left'},
            //{ text: "Nombre texto", value: "documento",width: "12%", sortable: false, align: 'center'},
            
        ],
        roles: [],
        unidades: [],
        bredItems: [
        {
          text: "Inicio",
          disabled: false,
          href: `/inicio`,
        },
        {
          text: "Auditoria",
          disabled: false,
          href: `/auditoria`,
        },
        {
          //text: "Inicio",
          text: "Control de visualizaciones",
          disabled: true,
          href: `/auditoria/visualizaciones`,
        },
      ],
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
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
        },
        
        ...mapGetters(["currentUser"]),
        ...mapGetters("usuariosStore", ["usuarios", "isLoading"]),
        ...mapGetters("auditorStore", ["listaDocumentosUsuario", "isLoading"]),
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
        
        const List = await this.getVerDocumentoPorUsuario()
        console.log(List)
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
        ...mapActions("auditorStore",["getVerDocumentoPorUsuario"]),
        ...mapActions("archivosStore",["fetchArchivosOrigen"])
    },
};
</script>