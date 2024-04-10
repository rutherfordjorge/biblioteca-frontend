<template>
  <v-container>
    <v-card class="elevation-0">
      <v-overlay v-if="Documentos.isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card-title>
        <v-breadcrumbs
          class="font-weight-medium"
          :items="bredItems"
          large
        ></v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="Documentos.busqueda"
          append-icon="mdi-magnify"
          label="Buscar en el Listado"
          @click:append="buscar"
          @change="buscar"
          single-line
          hide-details
        >
        </v-text-field>
      </v-card-title>
      <v-container fluid>
        <v-data-table
          :headers="Documentos.headers"
          :loading="Documentos.isLoading"
          loading-text="Cargando...por favor esperar"
          :items="Documentos.items"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.fechA_DOC="{ item }">
            <v-chip small color="white">
              {{ getFormatFecha(item.fechA_DOC) }}
            </v-chip>
          </template>
          <template v-slot:item.numero="{ item }">
            <v-chip small color="white">
              {{ item.numero }}
            </v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.estado="{ item }">
            <v-chip
              small
              :color="colorEstado(item.estado.id)"
              text-color="white"
              class="text-descripcion"
            >
              {{ descripcionEstado(item.estado.id) }}
            </v-chip>
          </template>
          <template v-slot:item.clasificacion="{ item }">
            <v-chip
              small
              :color="colorClasificacion(item.clasificacion.id)"
              text-color="white"
              class="text-descripcion"
            >
              {{ descripcionClasificacion(item.clasificacion.id) }}
            </v-chip>
          </template>
          <template v-slot:item.edicion="{ item }">
            <v-chip class="text-descripcion" color="white">
              {{ item.edicion }}
            </v-chip>
          </template>
          <template v-slot:item.descripcion="{ item }">
            <v-badge class="text-descripcion" color="none">
              {{ item.descripcion }}
            </v-badge>
          </template>
          <template v-slot:item.acciones="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small class="md-3" v-on="on" @click="editItem(item)"
                  >mdi-pencil</v-icon
                >
              </template>
              <span>Editar</span>
              <br />
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small class v-on="on" @click="editCargar(item)"
                  >mdi-arrow-collapse</v-icon
                >
              </template>
              <span>Cargar nueva version</span>
              <br />
            </v-tooltip>

            <v-tooltip v-if="$route.params.id != 20" top>
              <template v-slot:activator="{ on }">
                <v-icon small class="md-3" v-on="on" @click="deleteItem(item)"
                  >mdi-delete
                </v-icon>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
          <template v-slot:item.ver="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <ver-documento
                  v-if="(parseInt(currentUser.Rol) == 0 && item.clasificacion.id == 0 && item.estado.id <= 2) ||
                   (parseInt(currentUser.Rol) == 222 && item.clasificacion.id <= 1 && item.estado.id <= 2) ||
                   (parseInt(currentUser.Rol) == 223 && item.clasificacion.id <= 2 && item.estado.id <= 2) ||
                   (parseInt(currentUser.Rol) == 221 && item.clasificacion.id <= 3 && item.estado.id <= 3)"
                  v-on="on"
                  Icon="mdi-magnify"
                  :ID="item.documentoId"
                  :clasificacion="item.clasificacion"
                  v-bind:key="item.id"
                />
                <!-- item.documentoId -->
                <v-icon small v-else title="No tiene acceso para ver éste texto"
                  >mdi-cancel</v-icon
                >
              </template>
              <span>Detalle</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-row class="text-center" dense>
          <v-col cols="12">
            <v-pagination
              v-model="Documentos.page"
              :length="Documentos.pages"
              :total-visible="10"
              :disabled="Documentos.isLoading || Documentos.pages == 1"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    
    <!-- Modal Eliminar -->
    <v-dialog v-model="dialogDelete" max-width="290">
      <eliminar-documento :key="editedItem.id" @closeDelete="closeDelete" :tipoArchivoId="81" :origenId="2" :item="editedItem"/>
    </v-dialog>

    <!-- Editar Doc -->
    <v-dialog v-model="dialog" max-width="1200px">
      <editar-documento :key="editedItem.id" @close="close" @close2="close2" :tipoArchivoId="81" :origenId="2" :item="editedItem"/>
    </v-dialog>

    <!-- Guardar Doc -->
    <v-dialog v-model="dialogCargar" max-width="1200px">
      <guardar-documento :key="editedItem.id" @closeEdit="closeEdit" :tipoArchivoId="81" :origenId="2" :item="editedItem"/>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VerDocumento from "@/components/verDocumento.vue";
import EditarDocumento from "@/components/editarDocumento.vue";
import GuardarDocumento from '@/components/guardarDocumento.vue';
import EliminarDocumento from '@/components/eliminarDocumento.vue';

export default {
  name: "ListaBiblioteca",
  components: { 
    VerDocumento,
    EditarDocumento,
    GuardarDocumento,
    EliminarDocumento,
    },
  data: () => ({
    tipoDocumento: [],
    ItemDetailModal: false,
    ItemEdit: false,
    dialog: false,
    dialogCargar: false,
    dialogDelete: false,
    deleteDocumento: null,
    bredItems: [
      {
        text: "Inicio",
        disabled: false,
        href: `/inicio`,
      },
      {
        text: "Textos Doctrinarios",
        disabled: false,
        href: `/inicio/doctrina`,
      },
    ],
    Documentos: {
      items: [],
      headers: [
        {
          text: "Fecha",
          value: "fechA_DOC",
          align: "center",
          sortable: false,
          width: "10%",
        },
        {
          text: "Número",
          groupable: false,
          align: "center",
          value: "numero",
          sortable: false,
          width: "10%",
        },
        {
          text: "Descripción",
          value: "descripcion",
          sortable: true,
          align: "left",
          width: "40%",
        },
        //{ text: "Tipo", value: "tipo.nombre", width: "10%" },
        //{ text: "Unidad", value: "unidad.sigla", width: "10%" },
        {
          text: "Estado",
          sortable: false,
          value: "estado",
          align: "center",
          width: "10%",
        },
        {
          text: "Edición",
          value: "edicion",
          align: "center",
          sortable: false,
          width: "10%",
        },
        {
          text: "Clasificación",
          sortable: false,
          align: "center",
          value: "clasificacion",
          width: "10%",
        },
      ],
      isLoading: true,
      busqueda: "",
      oldBusqueda: "",
      page: 1,
      oldPage: 1,
      pages: 0,
    },
    clasificacion: [
      { id: 0, nombre: "PUBLICO" },
      { id: 1, nombre: "RESERVADO" },
      { id: 2, nombre: "SECRETO" },
    ],
    estado: [
      { id: 1, nombre: "VIGENTE" },
      { id: 2, nombre: "EN ACTUALIZACIÓN" },
      { id: 3, nombre: "EN ELABORACIÓN" },
    ],
    edicion: [
      { text: "2015", value: 2015 },
      { text: "2016", value: 2016 },
      { text: "2017", value: 2017 },
      { text: "2018", value: 2018 },
      { text: "2019", value: 2019 },
      { text: "2020", value: 2020 },
      { text: "2021", value: 2021 },
      { text: "2022", value: 2022 },
      { text: "2023", value: 2023 },
    ],
    editedIndex: -1,
    editedItem: {
      id: 0,
      fechA_DOC: null,
      numero: "",
      ruta: 0,
      descripcion: null,
      tipo: 1,
      unidad: null,
      edicion: 2015,
      estado: {},
      documento: null,
      clasificacion: {},
    },
  }),
  async mounted() {
    if (this.unidades == 0) {
      await this.fetchUnidades();
    }
    if (this.tiposDocumentos == 0) {
      await this.fetchTiposDocumentos();
    }
    if (this.currentUser.Rol == 221) {
      this.Documentos.headers.push({
        text: "Acciones",
        value: "acciones",
        sortable: false,
        align: "center",
        width: "5%",
      });
    }

    if (this.$route.params.id != 20) {
      this.Documentos.headers.push({
        text: "Ver",
        value: "ver",
        sortable: false,
        align: "center",
        width: "5%",
      });
    }

    const res = await this.fetchTipoDocumento(this.$route.params.id);
    this.tipoDocumento = res.data;
    this.bredItems.push({
      text: `${this.tipoDocumento.nombre}`,
      disabled: true,
      href: `/`,
    });
    this.reload(this.Documentos.page, this.Documentos.busqueda);
  },
  watch: {
    Documentos: {
      deep: true,
      async handler() {
        if (this.Documentos.page != this.Documentos.oldPage) {
          this.Documentos.oldPage = this.Documentos.page;
          await this.reload(this.Documentos.page, this.Documentos.busqueda);
        }
      },
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
    ...mapGetters("unidadesStore", ["unidades"]),
    ...mapGetters("procedimientosStore", ["tiposDocumentos"]),
  },
  methods: {
    ...mapActions("unidadesStore", ["fetchUnidades"]),
    ...mapActions("procedimientosStore", [
      "fetchDocumentosTipo",
      "fetchDocumentosBorrados",
      "fetchTipoDocumento",
      "fetchTiposDocumentos",
    ]),
    ...mapActions("archivosStore", [
      "fetchArchivosOrigen",
    ]),
    async reload(page, busqueda) {
      this.Documentos.items = [];
      this.Documentos.isLoading = true;
      let params = { page: page, busqueda: busqueda };
      if (this.$route.params.id == 20) {
        await this.fetchDocumentosBorrados(params).then((resp) => {
          setTimeout(() => {
            this.procesado(resp.data);
          }, 1000 * 1);
        });
      } else if (this.$route.params.id == 0) {
        await this.fetchDocumentos(params).then((resp) => {
          // console.log(resp);
          setTimeout(() => {
            this.procesado(resp.data);
          }, 1000 * 1);
        });
      } else {
        await this.fetchDocumentosTipo({
          page: page,
          busqueda: busqueda,
          tipoId: this.$route.params.id,
        }).then((resp) => {
          setTimeout(() => {
            this.procesado(resp.data);
          }, 1000 * 1);
        });
      }
      this.Documentos.isLoading = !this.Documentos.isLoading;
    },
    async buscar() {
      if (this.Documentos.busqueda != this.Documentos.oldBusqueda) {
        this.search != ""
          ? (this.Documentos.page = 1)
          : (this.Documentos.page = this.Documentos.oldPage);
        this.Documentos.oldBusqueda = this.Documentos.busqueda;
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }
    },
    editItem(item) {
     console.log(item);
      this.editedIndex = this.Documentos.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    editCargar(item) {
      this.editedIndex = this.Documentos.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogCargar = true;
    },
    deleteItem(item) {
      this.editedIndex = this.Documentos.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    descripcionEstado(estadoID) {
      return estadoID == 1
        ? "VIGENTE"
        : estadoID == 2
        ? "EN ACTUALIZACIÓN"
        : estadoID == 3
        ? "EN ELABORACIÓN"
        : "SIN TIPO";
    },
    colorEstado(estadoID) {
      let color;
      if (estadoID == 1) color = "success";
      else if (estadoID == 2) color = "orange";
      else if (estadoID == 3) color = "red";
      else color = "info";
      return color;
    },
    descripcionClasificacion(ClasificacionID) {
      return ClasificacionID == 0
        ? "PUBLICO"
        : ClasificacionID == 1
        ? "RESERVADO"
        : ClasificacionID == 2
        ? "SECRETO"
        : "SIN CLASIFICACION";
    },
    colorClasificacion(ClasificacionID) {
      //otorga colores a los estados
      let color;
      if (ClasificacionID == 0) color = "blue";
      else if (ClasificacionID == 1) color = "orange";
      else if (ClasificacionID == 2) color = "red";
      else color = "info";

      return color;
    },
    async close() {
      this.dialog = !this.dialog;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    async close2() {
      this.dialog = !this.dialog;
    },
    async closeEdit() {
      // funcion de cerrar en la ventana de dialogo de cargar nueva version
      this.dialogCargar = !this.dialogCargar;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    async closeDelete() {
      this.dialogDelete = !this.dialogDelete;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    modalShown() {
      setTimeout(() => {
        this.$refs.mymap.mapObject.invalidateSize();
      }, 100);
    },
    getFormatFecha(f) {
      var fecha = new Date(f).toISOString().substring(0, 10);
      return fecha;
    },
    async procesado(datos) {
      // console.log(datos)
      const itemTmp = datos.data;
      // console.log('temp:', itemTmp)
      await itemTmp.forEach(async (item) => {
        item.documentoId = await this.getArchivoId(item.id);
        switch (item.estado) {
          case 1:
            item.estado = {id: 1, nombre: 'VIGENTE'}
            break;
          case 2:
            item.estado = {id: 2, nombre: 'EN ACTUALIZACIÓN'}
            break;
          case 3:
            item.estado = {id: 3, nombre: 'EN ELABORACIÓN'}
            break;  
          default:
            break;
        }
        item.documentoID = await this.getArchivoId(item.id);
        switch (item.clasificacion) {
          case 0:
            item.clasificacion = {id: 0, nombre:'PUBLICO'}
            break;
          case 1:
            item.clasificacion = {id: 1, nombre:'RESERVADO'}
            break;
          case 2:
            item.clasificacion = {id: 2, nombre:'SECRETO'}
            break;
          default:
            break;
        }

        // console.log(item)
      });

      this.Documentos.page = datos.page;
      this.Documentos.pages = datos.pages;
      // this.Documentos.items = datos.data;
      setTimeout(() => {
        this.Documentos.items = itemTmp;
        this.Documentos.isLoading = false;
      }, 500);
    },
    async getArchivoId(archivoid) {
      // console.log('id: ', archivoid)
      let archivoId = 0;
      let param = { id: archivoid, tipo: 81, sistema: 7 };
      await this.fetchArchivosOrigen(param).then((resp) => {
        // console.log('resp: ', resp)
        archivoId = resp.data[0].id;
      });

      // console.log('archivoId: ', archivoId)
      return archivoId;
    },
  },
};
</script>

<style>
.theme--dark.v-progress-linear {
  color: #000000 !important;
}

.breadcrumbs {
  font-weight: 100;
}

.text-descripcion {
  font-size: 11.5px !important;
}
</style>



    