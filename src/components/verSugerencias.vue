<template>
  <v-container>
    <v-row>
      <v-col cols="9"></v-col>
      <v-col cols="3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar Sugerencia"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-container fluid>
      <v-data-table
        :headers="headers"
        :loading="isLoading"
        loading-text="Cargando...por favor esperar"
        :items="items"
        :search="search"
      >
        <template v-slot:item.fechA_HORA="{ item }">
          {{ getFormatFecha(item.fechA_HORA) }}
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <!-- <template v-slot:item.acciones="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-2" v-on="on" @click="goTDInicio(item)"
                >mdi-chevron-right</v-icon
              >
            </template>
            <span>Detalle</span>
          </v-tooltip>
        </template> -->
        <!-- <template v-slot:no-data>
          <v-btn color="primary" @click="reload">Volver a buscar</v-btn>
        </template> -->
      </v-data-table>
    </v-container>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "verSugerencia",
  components: {},
  data: () => ({
    menu1: false,
    items: [],
    tipoDocumento: [],
    ItemDetailModal: false,
    ItemEdit: false,
    isLoading: false,
    search: "",
    dialogDelete: false,
    deleteDocumento: null,
    headers: [
      { text: "Fecha", value: "fechA_HORA" },
      { text: "Sugerencia", sortable: true, value: "sugerencia" },
      { text: "Usuario", value: "usuario" },
      // { text: "Acciones", value: "acciones", sortable: false, align: "center" },
    ],
    editedIndex: -1,
    defaultItem: {
      id: 0,
      fechA_HORA: null,
      sugerencia: "",
      usuario: 0,
    },
  }),
  async mounted() {
    this.reload();
  },
  watch: {},
  computed: {
    ...mapGetters("unidadesStore", ["unidades"]),
    fechaFormateada: {
      get: function () {
        if (this.editedItem.fechA_DOC != null) {
          return this.formatearFecha(this.editedItem.fechA_DOC);
        }
        return "";
      },
      set: function () {
        this.editedItem.fechA_DOC = this.formatearFecha(
          this.editedItem.fechA_DOC
        );
      },
    },
  },
  methods: {
    ...mapActions("procedimientosStore", [
      "fetchSugerencias",
      "fetchSugerencia",
      "putSugerencia",
    ]),
    async reload(){
      this.isLoading=!this.isLoading;
      await this.fetchSugerencias().then((res) => {
          if (res.status == 200) {
              this.items = res.data;
          }
          });
      this.isLoading=!this.isLoading;
    },
    deleteItem(item) {
      this.deleteUnidad = item;
      this.dialogDelete = true;
    },
    formatearFecha(date) {
      if (date == null) return null;
      return this.moment(date).format("YYYY-MM-DD");
    },
    getFormatFecha(f) {
      var fecha = new Date(f).toISOString().substring(0, 10);
      return fecha;
    },
  },
};
</script>

<style>
</style>