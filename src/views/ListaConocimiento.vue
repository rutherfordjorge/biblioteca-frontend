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
          loading-text="Cargando...por favor espere"
          :items="Documentos.items"
          disable-pagination
          hide-default-footer
        >
          <template v-slot:item.fechA_DOC="{ item }">
            {{ getFormatFecha(item.fechA_DOC) }}
          </template>
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <template v-slot:item.clasificacion="{ item }">
            <v-chip
              small
              :color="colorClasificacion(item.clasificacion)"
              text-color="white"
              class="text-descripcion"
            >
              {{ descripcionClasificacion(item.clasificacion) }}
            </v-chip>
          </template>
          <template v-slot:item.acciones="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2" v-on="on" @click="editItem(item)"
                  >mdi-pencil</v-icon
                >
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2" v-on="on" @click="editCargar(item)"
                  >mdi-arrow-collapse</v-icon
                >
              </template>
              <span>Cargar nueva version</span>
              <br />
            </v-tooltip>
            <v-tooltip v-if="$route.params.id != 20" top>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2" v-on="on" @click="deleteItem(item)"
                  >mdi-delete</v-icon
                >
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
            <template v-slot:item.ver="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <ver-documento
                  v-if="
                    (item.clasificacion == 2 &&
                      parseInt(currentUser.Rol) == 161) ||
                    item.clasificacion == 1 ||
                    item.clasificacion == 0
                  "
                  v-on="on"
                  Icon="mdi-magnify"
                  :ID="item.documentoId"
                  v-bind:key="item.documentoId"
                />
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
      <eliminar-documento :key="editedItem.id" @="closeDelete" :tipoArchivoId="102" :origenId="3" :item="editedItem"/>
    </v-dialog>
    <!-- Editar Doc -->
    <v-dialog v-model="dialog" max-width="1200px">
      <editar-documento :key="editedItem.id" @close="close" :tipoArchivoId="102" :origenId="3" :item="editedItem"/>
    </v-dialog>
    <!-- Guardar Doc -->
    <v-dialog v-model="dialogCargar" max-width="1200px">
      <guardar-documento :key="editedItem.id" @closeEdit="closeEdit" :tipoArchivoId="102" :origenId="3" :item="editedItem"/>
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
    name: "ListaConocimiento",
    components: {
    VerDocumento,
    EditarDocumento,
    GuardarDocumento,
    EliminarDocumento,
    },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogCargar: false,
    bredItems: [
      {
        text: "Inicio",
        disabled: false,
        href: `/inicio`,
      },
      {
        text: "Gestión del Conocimiento",
        disabled: false,
        href: `/inicio/conocimiento`,
      },
    ],
    Documentos: {
      items: [],
      headers: [
        { text: "Fecha", value: "fechA_DOC", width: "15%" },
        {text: "Titulo", value:"titulo",width:"25%"},
        /*
        {
          text: "Numero",
          align: "left",
          sortable: true,
          value: "numero",
          width: "10%",
        },
        */
       { text: "Resumen", value: "resumen", width: "25%" },
       /*{ text: "Abstract", value: "abstract", width: "40%" },*/
        //{ text: "Descripción", value: "descripcion", width: "40%" },
        { text: "Área del Ámbito", value: "area_ambito.nombre", width: "10%" },
        { text: "Línea", value: "linea.nombre", width: "10%" },
        //{ text: "Tipo", value: "tipo.nombre", width: "10%" },
        { text: "Unidad", value: "unidad.sigla", width: "10%" },
        {
          text: "Seguridad Militar",
          sortable: false,
          value: "clasificacion",
          width: "5%",
        },
      ],
      isLoading: true,
      busqueda: "",
      oldBusqueda: "",
      page: 1,
      oldPage: 1,
      pages: 0,
    },
    clasi: [
      { id: 0, nombre: "PUBLICO" },
      { id: 1, nombre: "RESERVADO" },
      { id: 2, nombre: "SECRETO" },
    ],
    editedIndex: -1,
    editedItem: {
      id: 0,
      fechA_DOC: null,
      numero: "",
      ruta: 0,
      descripcion: null,
      tipo: null,
      unidad: null,
      documento: null,
      clasificacion: null,
    },
  }),
  async mounted() {
    if (this.unidades == 0) {
      await this.fetchUnidades();
    }
    if (this.tiposDocumentos == 0) {
      await this.fetchTiposDocumentos();
    }
    if (this.currentUser.Rol == 161) {
      this.Documentos.headers.push({
        text: "Acciones",
        value: "acciones",
        sortable: false,
        align: "center",
        width: "10%",
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
      "fetchDocumentos",
      "fetchDocumentosBorrados",
      "fetchTiposDocumentos",
      "putBloquearDocumento",
      "fetchTipoDocumento",
    ]),
    ...mapActions("archivosStore", [
      "fetchArchivosOrigen",
      "putBloquearArchivo",
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
      else if (ClasificacionID == 1) color = "warning";
      else if (ClasificacionID == 2) color = "red";
      else color = "info";
      return color;
    },
    async close() {
      this.dialog = false;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    async closeEdit() {
      // funcion de cerrar en la ventana de dialogo de cargar nueva version
      this.dialogCargar = false;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    async closeDelete() {
      this.dialogDelete = false;
      setTimeout(async () => {
        await this.reload(this.Documentos.page, this.Documentos.busqueda);
      }, 300);
    },
    getFormatFecha(f) {
      var fecha = new Date(f).toISOString().substring(0, 10);
      return fecha;
    },
    async procesado(datos) {
      const itemTmp = datos.data;
      // console.log('temp:', itemTmp)
      await itemTmp.forEach(async (item) => {
        item.documentoId = await this.getArchivoId(item.id);
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
      let param = { id: archivoid, tipo: 41, sistema: 7 };
      await this.fetchArchivosOrigen(param).then((resp) => {
        // console.log('resp: ', resp)
        archivoId = resp.data[0].id;
      });

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
</style>