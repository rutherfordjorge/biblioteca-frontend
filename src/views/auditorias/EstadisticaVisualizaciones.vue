<template>
  <v-container fluid>
    <v-row dense>
      <breadcrumb :items="bredItems"  />
      <v-spacer></v-spacer>
    </v-row>
    <v-col cols="12" class="text-center">
      <h2>Estadísticas de la biblioteca virtual</h2>
    </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-1">
        <v-card elevation="4">
          <v-card-text>
            <b>En esta sección, podrá apreciar la cantidad de consultas que se realizan a las distintas categorías de textos doctrinarios.
              Esto permite llevar un control estadístico de las categorías más consultadas, con el objetivo de orientar al mando en la toma de decisiones.
            </b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="2" md="3" lg="6">
          <v-card elevation="4">
            <div v-if="isLoading" class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p>Cargando datos...</p>
            </div>
            <div v-else>
            <v-row dense>
              <v-card-text v-if="card.title === 'COLECCIONES'">
                <apexchart type="pie" height="600" :options="coleccionChartOptions" :series="coleccionChartSeries"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'CLASIFICACIONES'">
                <apexchart type="pie" height="600" :options="clasificacionChartOptions" :series="clasificacionChartSeries"></apexchart>
              </v-card-text>
            </v-row>
            </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";
import Breadcrumb from "@/components/base/breadcrumb";
import cardEstadistica from "@/components/auditorias/cardEstadistica.vue";

export default {
  name: "Visualizaciones",
  components: {
    cardEstadistica, 
    Breadcrumb, 
    apexchart: VueApexCharts,
  },
  data() {
    return {
      bredItems: [
          { text: "INICIO", disabled: false, to: { name: `inicio` } },
          { text: "TEXTOS DOCTRINARIOS", disabled: false, to: { name: `archivos`, props: { id: 1 } }},
          { text: "MODULO DE ESTADISTICAS", disabled: false, to: { name: `estadistica`}},
          { text: "ESTADISTICA DE VISUALIZACIONES", disabled: true, to: `` },
      ],
      cards: [
          { title: "COLECCIONES", to: {name: "estadistica-colecciones"}, rol: [221]},
          { title: "CLASIFICACIONES", to: {name: "estadistica-clasificaciones"}, rol: [221]},
      ],
      coleccionChartSeries: [],
      coleccionChartOptions: {
        chart: { type: 'pie'},
        title: { text: "Estadísticas de consultas por colecciones", align: "center"},
        labels: ['Doctrina Conjunta', 'Doctrina de Funcionamiento', 'Doctrina Operacional', 'Doctrina Valórica', 'Textos matrices', 'Otras publicaciones'],
        colors: [
          '#FF5733', // Rojo para Doctrina Conjunta
          '#388E3C', // Verde para Doctrina de Funcionamiento
          '#3357FF', // Azul para Doctrina Operacional
          '#FF33A1', // Rosa para Doctrina Valórica
          '#FF8C33', // Naranja para Textos matrices
          '#8C33FF', // Morado para Otras publicaciones
        ],
        legend: { position: 'right', align: 'center'},
        dataLabels: { enabled: true,
          formatter: function (val, opts) {
            return opts.w.globals.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
          }
        },
      },
      clasificacionChartSeries: [],
      clasificacionChartOptions: {
        chart: { type: 'pie'},
        title: { text: "Estadísticas de consultas por clasificación", align: "center"},
        labels: ['Público', 'Reservado', 'Secreto'],
        colors: [
          '#1E88E5', // Público
          '#FFC107', // Reservado
          '#D32F2F', // Secreto
        ],
        legend: { position: 'right', align: 'center'},
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.globals.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
          }
        },
      },
      isLoading: true,
      isDarkTheme: false, // Inicializa el tema como claro
    };
  },
  async mounted() {
    try {
      const resp = await this.contarTipoID();
      if (resp.status === 200) {
        this.setChartData(resp.data);
        this.isLoading = false;
      }
    } catch (error) {
      this.isLoading = false;
    }

    // Escucha cambios en el tema oscuro
    this.$root.$on("toggleTheme", this.updateChartThemes);
    this.updateChartThemes(); // Aplica la configuración correcta del tema al cargar
  },
  beforeDestroy() {
    // Elimina el oyente del evento para evitar fugas de memoria
    this.$root.$off("toggleTheme", this.updateChartThemes);
  },
  methods: {
    ...mapActions("auditorStore", ["contarTipoID"]),
    
    setChartData(data) {
      const coleccionCounts = { 27: 0, 28: 0, 29: 0, 30: 0, 31: 0, 32: 0 };
      const clasificacionCounts = { 1: 0, 2: 0, 3: 0 };

      data.forEach(item => {
        if (item.coleccionid in coleccionCounts) {
          coleccionCounts[item.coleccionid]++;
        }
        if (item.clasificacionid in clasificacionCounts) {
          clasificacionCounts[item.clasificacionid]++;
        }
      });

      this.coleccionChartSeries = Object.values(coleccionCounts);
      this.clasificacionChartSeries = Object.values(clasificacionCounts);
    },

    // Función para actualizar los colores de los gráficos según el tema
    updateChartThemes() {
      const textColor = !this.isDarkTheme ? '#999999' : '#999999';
      
      // Actualizar opciones de los gráficos para el tema oscuro
      this.coleccionChartOptions.title.style = { color: textColor };
      this.clasificacionChartOptions.title.style = { color: textColor };

      this.coleccionChartOptions.legend.labels = { colors: textColor };
      this.clasificacionChartOptions.legend.labels = { colors: textColor };

      this.coleccionChartOptions.dataLabels.style = { color: textColor };
      this.clasificacionChartOptions.dataLabels.style = { color: textColor };
    },
  },
};
</script>

<style>

.v-card{

  color: black;
  margin: 0;
}

</style>