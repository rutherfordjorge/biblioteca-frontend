<template>
  <v-container fluid>
    <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
    <v-col cols="12" class="text-center">
      <h2>Estadísticas de la biblioteca virtual</h2>
    </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <b>En esta sección, podrá visualizar la cantidad de usuarios, y sus atributos dentro de la Biblioteca Virtual.
              Recuerde que a la derecha de cada gráfico, puede descargar una imagen de dicha estadística, en el formato que sea conveniente.</b>
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

export default {
  name: "Accesos",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      bredItems: [
        { text: "Inicio", disabled: false, href: `/inicio` },
        { text: "Estadística", disabled: false, href: `/estadistica` },
        { text: "Estadística de Accesos", disabled: true, href: `/estadistica/accesos` },
      ],
      chartSeries: [],
      chartOptions: {
        chart: {
          type: 'pie',
          align: 'center'
        },
        labels: ['Usuarios Estandar', 'Usuarios DIVDOC', 'Usuarios Acceso Reservados', 'Usuarios Acceso Secretos'],
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
      // console.log("RESPUESTA COMPLETA DEL ENDPOINT:", resp.data);

      if (resp.status === 200) {
        this.setChartData(resp.data);
        this.isLoading = false;
      }
    } catch (error) {
      console.error("Error en mounted:", error);
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions("auditorStore", ["contarUsuarios"]),
    setChartData(data) {
      const totalSeries = [
        data.conteoEstandar,
        data.conteoDivDoc,
        data.conteoReservados,
        data.conteoSecretos
      ];

      this.chartSeries = totalSeries.map(item => {

        return Number(item) || 0;
      });

    }
  },
};
</script>

<style scoped>

</style>