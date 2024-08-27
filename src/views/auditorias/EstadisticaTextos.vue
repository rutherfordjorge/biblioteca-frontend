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
            <b>En esta sección, se puede visualizar la cantidad de textos doctrinarios que se encuentran en la BV actualmente, visualizado por categorias y estado.
              Recuerde que a la derecha de cada gráfico, puede descargar una imagen de dicha estadística, en el formato que sea conveniente.</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsVig" :series="chartSeriesVig"></apexchart>
      </v-col>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsAct" :series="chartSeriesAct"></apexchart>
      </v-col>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsElab" :series="chartSeriesElab"></apexchart>
      </v-col>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsPub" :series="chartSeriesPub"></apexchart>
      </v-col>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsRes" :series="chartSeriesRes"></apexchart>
      </v-col>
      <v-col cols="12">
        <apexchart v-if="!isLoading" type="bar" height="350"  :options="chartOptionsSec" :series="chartSeriesSec"></apexchart>
      </v-col>
      <v-col cols="12" v-if="isLoading" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Textos",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      isLoading: true,  // Mantenemos isLoading al principio
      bredItems: [
        { text: "Inicio", disabled: false, href: `/inicio` },
        { text: "Estadística", disabled: false, href: `/estadistica` },
        { text: "Estadística de Textos", disabled: true, href: `/estadistica/textos` },
      ],
      chartSeriesVig: [{ name: "Vigente", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesAct: [{ name: "En Actualización", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesElab: [{ name: "En Elaboración", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesPub: [{ name: "Públicos", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesRes: [{ name: "Reservados", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesSec: [{ name: "Secretos", data: [0, 0, 0, 0, 0, 0] }],
      chartOptionsVig: {
        chart: {
          id: "chart-vig",
        },
        title: {
          text: "Reglamentos vigentes por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#4CAF50']
      },
      chartOptionsAct: {
        chart: {
          id: "chart-act",
        },
        title: {
          text: "Reglamentos en actualización por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#FFC107']
      },
      chartOptionsElab: {
        chart: {
          id: "chart-elab",
        },
        title: {
          text: "Reglamentos en elaboración por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#FF4336']
      },
      chartOptionsPub: {
        chart: {
          id: "chart-pub",
        },
        title: {
          text: "Reglamentos públicos por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#4682B4']
      },
      chartOptionsRes: {
        chart: {
          id: "chart-res",
        },
        title: {
          text: "Reglamentos reservados por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#FFC107']
      },
      chartOptionsSec: {
        chart: {
          id: "chart-sec",
        },
        title: {
          text: "Reglamentos secretos por tipo",
          align: "center",
        },
        xaxis: {
          categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"],
        },
        colors: ['#FF4336']
      },
    };
  },
  async mounted() {
    await this.contarTipoyClasificacion().then((resp) => {
      if (resp.status === 200) {
        this.setChartData("vig", resp.data.resultVig);
        this.setChartData("act", resp.data.resultAct);
        this.setChartData("elab", resp.data.resultElab);
        this.setChartData("pub", resp.data.resultPublico);
        this.setChartData("res", resp.data.resultReservado);
        this.setChartData("sec", resp.data.resultSecreto);
      }
      this.isLoading = false;
    });
  },
  methods: {
    ...mapActions("auditorStore", ["contarTipoyClasificacion"]),
    setChartData(type, data) {
      const seriesData = Object.values(data);

      if (type === "vig") {
        this.chartSeriesVig = [{ name: "Vigente", data: seriesData }];
      } else if (type === "act") {
        this.chartSeriesAct = [{ name: "En Actualización", data: seriesData }];
      } else if (type === "elab") {
        this.chartSeriesElab = [{ name: "En Elaboración", data: seriesData }];
      } else if (type === "pub") {
        this.chartSeriesPub = [{ name: "Públicos", data: seriesData }];
      } else if (type === "res") {
        this.chartSeriesRes = [{ name: "Reservados", data: seriesData }];
      } else if (type === "sec") {
        this.chartSeriesSec = [{ name: "Secretos", data: seriesData }];
      }
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
