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
      <v-col cols="12" class="px-4">
        <v-card elevation="1">
          <v-card-text>
            <b>En esta sección, podrá visualizar la cantidad de usuarios, y sus atributos dentro del módulo de textos doctrinarios.
              Se encuentran segmentados los perfiles como Operador DIVDOC, personal con acceso a reglamentos reservados y personal con acceso a textos reservados y secretos.</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div v-if="isLoading" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p>Cargando datos...</p>
        </div>
        <div v-else>
            <apexchart type="pie" height="600" :options="chartOptions" :series="chartSeries"></apexchart>
          </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";
import Breadcrumb from "@/components/base/breadcrumb.vue";

export default {
  name: "Accesos",
  components: {
    apexchart: VueApexCharts,
    Breadcrumb

  },
  data() {
    return {
      bredItems: [
          { text: "INICIO", disabled: false, to: { name: `inicio` } },
          { text: "TEXTOS DOCTRINARIOS", disabled: false, to: { name: `archivos`, props: { id: 1 } }},
          { text: "MODULO DE ESTADISTICAS", disabled: false, to: { name: `estadistica`}},
          { text: "ESTADISTICA DE ACCESOS", disabled: true, to: `` },
      ],
      chartSeries: [],
      chartOptions: {
        title: { text: "Estadísticas de grados de acceso usuarios", align: "center"},
        chart: {
          type: 'pie',
          align: 'center'
        },
        labels: ['Usuarios Acceso Reservados', 'Usuarios Acceso Secretos', "Operadores DIVDOC"],
        colors: [
          '#FFC107', // Reservado
          '#D32F2F', // Secreto
          '#388E3C' // Operadores DIVDOC
        ],
        legend: {
          position: 'bottom',
          align: 'center'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.globals.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
          }
        },
      },
      isLoading : true,
    };
  },
  async mounted() {
    try {
      const resp = await this.contarUsuarios();

      if (resp.status === 200) {
        this.setChartData(resp.data);
        this.isLoading = false;
      }
    } catch (error) {
      console.error("Error en mounted:", error);
      this.isLoading = false;
    }
    this.$root.$on("toggleTheme", this.updateChartThemes);
    this.updateChartThemes(); // Aplica la configuración correcta del tema al cargar
  },
  beforeDestroy() {
    // Elimina el oyente del evento para evitar fugas de memoria
    this.$root.$off("toggleTheme", this.updateChartThemes);
  },
  methods: {
    ...mapActions("auditorStore", ["contarUsuarios"]),
    setChartData(data) {
      const totalSeries = [
        data.tipoAccesoIdReservado.usuarioCount,
        data.tipoAccesoIdSecreto.usuarioCount,
        data.tipoAccesoDivdoc.usuarioCount, 
      ];

      this.chartSeries = totalSeries.map(item => {
        return Number(item) || 0;
      });

    },
    updateChartThemes() {
      const textColor = !this.isDarkTheme ? '#999999' : '#999999';
      
      // Actualizar opciones de los gráficos para el tema oscuro
      this.chartOptions.title.style = { color: textColor };
      this.chartOptions.legend.labels = { colors: [textColor, textColor, textColor] };

      this.$set(this, 'chartOptions', {...this.chartOptions});
    },
    
  },
};
</script>

<style scoped>

</style>