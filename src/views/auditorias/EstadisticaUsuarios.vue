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
            <b>En esta sección, se pueden visualizar las visitas que se registran diariamente, como también, el consolidado por mes, actualizandose diariamente.
              Recuerde que a la derecha de cada gráfico, puede descargar una imagen de dicha estadística, en el formato que sea conveniente.
            </b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
      <v-row>
        <v-col cols="12">
          <!-- Mostrar un mensaje de carga mientras se obtienen los datos -->
          <div v-if="isLoading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Cargando datos...</p>
          </div>
          <div v-else>
            <apexchart type="bar" height="350" :options="chartOptionsDays" :series="chartSeriesDays"></apexchart>
            <apexchart type="bar" height="350" :options="chartOptionsMeses" :series="chartSeriesMeses"></apexchart>
          </div>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Usuarios",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      bredItems: [
        { text: "Inicio", disabled: false, href: `/inicio` },
        { text: "Estadística", disabled: false, href: `/estadistica` },
        { text: "Estadística de Usuarios", disabled: true, href: `/estadistica/usuarios` },
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
      console.log("RESPUESTA COMPLETA DEL ENDPOINT:", resp.data);

      if (resp.status === 200) {
        this.setChartData(resp.data.resultados); // Pasamos los resultados al método setChartData
        this.isLoading = false; // Datos cargados, dejar de mostrar el "loading"
      }
    } catch (error) {
      console.error("Error en mounted:", error);
      this.isLoading = false; // Dejar de mostrar el "loading" incluso si hay un error
    }
  },
  methods: {
    ...mapActions("auditorStore", ["contarVisitas"]),

    // Función para formatear la fecha según el requerimiento
    formatFecha(fecha) {
      const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      const [year, month, day] = fecha.split("-");
      return `${day}-${meses[parseInt(month) - 1]}-${year}`;
    },

    setChartData(resultados) {
      // Ordenar los resultados por fecha en caso de que no vengan ordenados
      resultados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // Filtrar para incluir solo los días con visitas mayores a cero
      const diasConVisitas = resultados.filter(item => Number(item.visitas) > 0);

      // Obtener los últimos 7 días con visitas
      const ultimos7DiasConVisitas = diasConVisitas.slice(-7);

      // Extraer y formatear las fechas y visitas de los últimos 7 días
      const fechas = ultimos7DiasConVisitas.map(item => this.formatFecha(item.fecha));
      const visitas = ultimos7DiasConVisitas.map(item => Math.round(Number(item.visitas)));  // Redondear las visitas a enteros

      // Configurar los datos y categorías para el gráfico de días
      this.chartOptionsDays = {
        ...this.chartOptionsDays,
        xaxis: {
          ...this.chartOptionsDays.xaxis,
          categories: fechas,  // Asignar las fechas formateadas al eje X
        }
      };

      this.chartSeriesDays = [{ name: "Usuarios al dia", data: visitas }]; // Asignar las visitas a las series

      // Configurar los datos para el gráfico de meses
      this.setChartDataMensual(resultados);
    },

    setChartDataMensual(resultados) {
      // Ordenar los resultados por fecha
      resultados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // Filtrar para incluir solo los días con visitas mayores a cero
      const diasConVisitas = resultados.filter(item => Number(item.visitas) > 0);

      // Crear un objeto para acumular visitas por mes
      const visitasMensuales = {};
      const meses = ['AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'ENE'];

      const yearActual = new Date().getFullYear();
      
      // Inicializar visitas mensuales con 0
      meses.forEach((mes, index) => {
          let nombreMes = `${mes}-${yearActual}`;

          if(mes === 'ENE'){
            nombreMes = `${mes}-${yearActual + 1}`;
          }

          visitasMensuales[nombreMes] = 0;
          meses[index] = nombreMes;
      });

      // Acumular visitas por mes
      diasConVisitas.forEach(item => {
        const fecha = new Date(item.fecha);
        const mes = fecha.getMonth();
        let nombreMes = meses[mes - 7]; // Ajustar para agosto (mes 7) -> índice 0
        if (nombreMes.includes('ENE') && fecha.getMonth() === 0) {
          nombreMes = `ENE-${yearActual +1}`;
        }

        if (nombreMes){
          visitasMensuales[nombreMes] += Number(item.visitas);
        }

        if(meses.length > 6){
          meses.shift();
        }
      });

      // Convertir el objeto a arrays para el gráfico
      const visitasPorMes = meses.map(mes => visitasMensuales[mes] || 0);

      // Configurar los datos y categorías para el gráfico mensual
      this.chartOptionsMeses = {
        ...this.chartOptionsMeses,
        xaxis: {
          ...this.chartOptionsMeses.xaxis,
          categories: meses,
        }
      };

      this.chartSeriesMeses = [{ name: "Visitas al Mes", data: visitasPorMes }];
    }
  },
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
