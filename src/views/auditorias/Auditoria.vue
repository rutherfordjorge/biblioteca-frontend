<template>
  <v-container fluid>
<v-row dense>
    <breadcrumb :items="bredItems"  />
    <v-spacer></v-spacer>
  </v-row>
      <v-col cols="12" class="text-center">
    <h2>Auditor de usuarios y visualizaciones</h2>
  </v-col>
  <v-row dense class="text-justify">
    <v-col cols="12" class="px-1">
      <v-card elevation="1">
        <v-card-text>
          <b>Este modulo tiene como objetivo, auditar y visualizar los movimientos de los visitantes a Textos Doctrinarios, registrando principalmente su direccion IP
            y los documentos visualizados en tiempo real.
          </b>
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
                  :items="listaAuditoria"
                  :search="search"
              >
                  <template v-slot:item.personal.nombre="{ item }">
                      {{ item.personal.nombre}} {{ item.personal.apellidO_PATERNO }} {{ item.personal.apellidO_MATERNO}}
                  </template>

                  <template v-slot:item.creacion="{ item }">
                      {{ getFormatFecha(item.creacion) }}
                  </template>

              </v-data-table>
          </v-container>
      </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Breadcrumb from "@/components/base/breadcrumb";

export default {
  name: "Usuarios",
  components: {
    Breadcrumb,
  },
  data: () => ({
    search: "",
    headers: [
      { text: "RUN", value: "personal.run", groupable: false, sortable: false, width: "5%", align: "center" },
      { text: "Nombre Completo", value: "personal.nombre", groupable: false, sortable: false, width: "12%" , align: "center"},
      { text: "Unidad", value: "personal.unidad", width: "5%", sortable: false, align: "center" },
      { text: "Ultima conexión", value: "creacion", width: "6%", sortable: false, align: "center" },
      { text: "IP Registrada", value: "ip", width: "4%", sortable: false, align: "center" },
      { text: "Colección consultada", value: "coleccion.nombre", width: "10%", sortable: false, align: "center" },
      { text: "Clasificación documento consultado", value: "clasificacion.nombre", width: "5%", sortable: false , align: "center"},
      { text: "Documento visualizado", value: "nombre", width: "10%", sortable: false, align: "center" },
    ],
    bredItems: [
        { text: "INICIO", disabled: false, to: { name: `inicio` } },
        { text: "TEXTOS DOCTRINARIOS", disabled: false, to: { name: `archivos`, props: { id: 1 } }},
        { text: "AUDITORIA", disabled: true, to: ``},
    ],
  }),
  
  computed: {
    ...mapGetters("auditorStore", ["listaAuditoria", "isLoading"]),
  },
  async mounted() {
    this.getAuditor();
  },
  methods: {
    getFormatFecha(f) {
      let fechaToISO = new Date(f).toISOString().substring(0, 10);
      let fecha = `${fechaToISO.substring(8, 10)}/${fechaToISO.substring(5, 7)}/${fechaToISO.substring(0, 4)}`;
      return fecha;
    },
    ...mapActions("auditorStore", ["getAuditor"]),
  },
};
</script>