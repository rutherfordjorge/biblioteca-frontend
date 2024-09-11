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
        <v-card elevation="1">
          <v-card-text>
            <b>En este modulo, se encuentran los registros de visitas por dia y por mes al módulo de Textos Doctrinarios</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <!-- Mostrar un mensaje de carga mientras se obtienen los datos -->
        <div v-if="isLoading" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p>Cargando datos...</p>
        </div>
        <div v-else>
          <v-row>
            <v-col cols="6">
              <v-card elevation="4">
              <apexchart type="bar" height="350" :options="chartOptionsDays" :series="chartSeriesDays"></apexchart>
            </v-card>
            </v-col>
            <v-col cols="6">
              <v-card elevation="4">
              <apexchart type="bar" height="350" :options="chartOptionsMeses" :series="chartSeriesMeses"></apexchart>
            </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";
import Breadcrumb from "@/components/base/breadcrumb.vue";

export default {
  name: "Usuarios",
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
          { text: "ESTADISTICA DE USUARIOS", disabled: true, to: `` },
      ],
      chartSeriesDays: [],
      chartOptionsDays: {
        chart: {
          type: 'bar',
          align: 'center',
          stacked: false,
        },
        title: {
          text: "Accesos por fecha",
          align: "center",
        },
        xaxis: {
          categories: [],  // Esto se llenará con las fechas desde el endpoint
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        colors: ['#4CAF50'],
        legend: {
          position: 'bottom',
          align: 'center'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Math.round(val);  // Mostrar solo números enteros
          }
        },
      },
      chartSeriesMeses: [],
      chartOptionsMeses: {
        chart: {
          type: 'bar',
          align: 'center',
          stacked: false,
        },
        title: {
          text: "Accesos por mes",
          align: "center",
        },
        xaxis: {
          categories: [],  // Esto se llenará con los meses desde agosto hasta enero
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        colors: ['#FF5722'],
        legend: {
          position: 'bottom',
          align: 'center'
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return Math.round(val);  // Mostrar solo números enteros
          }
        },
      },
      isLoading: true, // Inicialmente en estado de carga
    };
  },
  async mounted() {
    try {
      const resp = await this.contarVisitas();

      if (resp.status === 200) {
        this.setChartData(resp.data.resultados); // Pasamos los resultados al método setChartData
        this.isLoading = false; // Datos cargados, dejar de mostrar el "loading"
      }
    } catch (error) {
      this.isLoading = false; // Dejar de mostrar el "loading" incluso si hay un error
    }
    this.$root.$on("toggleTheme", this.updateChartThemes);
    this.updateChartThemes(); // Aplica la configuración correcta del tema al cargar
  },
  beforeDestroy() {
    // Elimina el oyente del evento para evitar fugas de memoria
    this.$root.$off("toggleTheme", this.updateChartThemes);
  },
  methods: {
    ...mapActions("auditorStore", ["contarVisitas"]),

    formatFecha(fecha) {
      const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      const [year, month, day] = fecha.split("-");
      return `${day}-${meses[parseInt(month) - 1]}-${year}`;
    },

    setChartData(resultados) {
      resultados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      const diasConVisitas = resultados.filter(item => Number(item.visitas) > 0);
      const ultimos7DiasConVisitas = diasConVisitas.slice(-7);
      const fechas = ultimos7DiasConVisitas.map(item => this.formatFecha(item.fecha));
      const visitas = ultimos7DiasConVisitas.map(item => Math.round(Number(item.visitas)));

      this.chartOptionsDays = {
        ...this.chartOptionsDays,
        xaxis: {
          ...this.chartOptionsDays.xaxis,
          categories: fechas,
        }
      };

      this.chartSeriesDays = [{ name: "Usuarios al día", data: visitas }];
      this.setChartDataMensual(resultados);
    },

    setChartDataMensual(resultados) {
      resultados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      const diasConVisitas = resultados.filter(item => Number(item.visitas) > 0);
      const visitasMensuales = {};
      const meses = ['AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'ENE'];
      const yearActual = new Date().getFullYear();

      meses.forEach((mes, index) => {
        let nombreMes = `${mes}-${yearActual}`;
        if (mes === 'ENE') {
          nombreMes = `${mes}-${yearActual + 1}`;
        }
        visitasMensuales[nombreMes] = 0;
        meses[index] = nombreMes;
      });

      diasConVisitas.forEach(item => {
        const fecha = new Date(item.fecha);
        const mes = fecha.getMonth();
        let nombreMes = meses[mes - 7];
        if (nombreMes.includes('ENE') && fecha.getMonth() === 0) {
          nombreMes = `ENE-${yearActual + 1}`;
        }
        if (nombreMes) {
          visitasMensuales[nombreMes] += Number(item.visitas);
        }
        if (meses.length > 6) {
          meses.shift();
        }
      });

      const visitasPorMes = meses.map(mes => visitasMensuales[mes] || 0);

      this.chartOptionsMeses = {
        ...this.chartOptionsMeses,
        xaxis: {
          ...this.chartOptionsMeses.xaxis,
          categories: meses,
        }
      };

      this.chartSeriesMeses = [{ name: "Visitas al Mes", data: visitasPorMes }];
    },

    updateChartThemes() {
      const textColor = !this.isDarkTheme ? '#999999' : '#FFFFFF'; // Ajuste de color según el tema

      // Actualizar el título
      this.chartOptionsDays.title.style = { color: textColor };
      this.chartOptionsMeses.title.style = { color: textColor };

      // Actualizar las etiquetas del eje X (fechas o meses)
      this.chartOptionsDays.xaxis.labels = {
        style: { colors: textColor, fontSize: '12px' }
      };
      this.chartOptionsMeses.xaxis.labels = {
        style: { colors: textColor, fontSize: '12px' }
      };

      // Actualizar las etiquetas del eje Y (valores)
      this.chartOptionsDays.yaxis = {
        labels: {
          style: { colors: textColor, fontSize: '12px' }
        }
      };
      this.chartOptionsMeses.yaxis = {
        labels: {
          style: { colors: textColor, fontSize: '12px' }
        }
      };

      // Forzar la reactividad en las opciones del gráfico
      this.$set(this, 'chartOptionsDays', { ...this.chartOptionsDays });
      this.$set(this, 'chartOptionsMeses', { ...this.chartOptionsMeses });
    },
  },
};
</script>

<style scoped>

.v-card{
  color: black;
}
/* Estilos personalizados si es necesario */
</style>