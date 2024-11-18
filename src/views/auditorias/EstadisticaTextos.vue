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
            <b>En este modulo, se encuentran las estadisticas de los textos, ordenados y estandarizados por tipo, vigencia</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="2" md="6" lg="12">
          <v-card elevation="4">
            <div v-if="isLoading" class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p>Cargando datos...</p>
            </div>
            <div v-else>
              <v-card-text v-if="card.title === 'VIGENTES'" elevation="4">
                <apexchart type="bar" height="250" key="1"  :options="chartOptionsVig" :series="chartSeriesVig"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'ACTUALIZACION'">
                <apexchart type="bar" height="350" key="2"  :options="chartOptionsAct" :series="chartSeriesAct"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'ELABORACION'">
                <apexchart type="bar" height="350" key="3"  :options="chartOptionsElab" :series="chartSeriesElab"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'PUBLICOS'" elevation="4">
                <apexchart type="bar" height="350" key="4" :options="chartOptionsPub" :series="chartSeriesPub"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'RESERVADOS'" elevation="4">
                <apexchart type="bar" height="350" key="5" :options="chartOptionsRes" :series="chartSeriesRes"></apexchart>
              </v-card-text>
              <v-card-text v-else-if="card.title === 'SECRETOS'" elevation="4">
                <apexchart type="bar" height="350" key="6" :options="chartOptionsSec" :series="chartSeriesSec"></apexchart>
              </v-card-text>
            </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueApexCharts from "vue-apexcharts";
import Breadcrumb from "@/components/base/breadcrumb.vue";
import cardEstadistica from "@/components/base/breadcrumb.vue";

export default {
  name: "Textos",
  components: {
    apexchart: VueApexCharts,
    Breadcrumb, cardEstadistica
  },
  data() {
    return {
      bredItems: [
          { text: "INICIO", disabled: false, to: { name: `inicio` } },
          { text: "TEXTOS DOCTRINARIOS", disabled: false, to: { name: `archivos`, props: { id: 1 } }},
          { text: "MODULO DE ESTADISTICAS", disabled: false, to: { name: `estadistica`}},
          { text: "ESTADISTICA DE TEXTOS", disabled: true, to: `` },
      ],
      cards: [{ title: "VIGENTES", to: { name: "estadistica-vigentes"}, rol: [221]},
              { title: "ACTUALIZACION", to: { name: "estadistica-actualizacion"}, rol: [221]},
              { title: "ELABORACION", to: { name: "estadistica-elaboracion"}, rol: [221]},
              { title: "PUBLICOS", to: { name: "estadistica-publicos"}, rol: [221]},
              { title: "RESERVADOS", to: { name: "estadistica-reservados"}, rol: [221]},
              { title: "SECRETOS", to: { name: "estadistica-secretos"}, rol: [221]}
      ],
      chartSeriesVig: [{ name: "Vigente", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesAct: [{ name: "En Actualización", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesElab: [{ name: "En Elaboración", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesPub: [{ name: "Públicos", data: [0, 0, 0, 0, 0, 0] },],
      chartSeriesRes: [{ name: "Reservados", data: [0, 0, 0, 0, 0, 0] }],
      chartSeriesSec: [{ name: "Secretos", data: [0, 0, 0, 0, 0, 0] }],
      chartOptionsVig: {
        chart: { id: "chart-vig"},
        title: { text: "Reglamentos vigentes por tipo", align: "center"},
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#4CAF50']
      },
      chartOptionsAct: {
        chart: { id: "chart-act"},
        title: { text: "Reglamentos en actualización por tipo", align: "center"},
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#FFC107']
      },
      chartOptionsElab: {
        chart: { id: "chart-elab"},
        title: { text: "Reglamentos en elaboración por tipo", align: "center"},
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#FF4336']
      },
      chartOptionsPub: {
        chart: { id: "chart-pub" },
        title: { text: "Reglamentos públicos por tipo", align: "center" },
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#4682B4']
      },
      chartOptionsRes: {
        chart: { id: "chart-res"},
        title: { text: "Reglamentos reservados por tipo", align: "center"},
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#FFC107']
      },
      chartOptionsSec: {
        chart: { id: "chart-sec"},
        title: { text: "Reglamentos secretos por tipo", align: "center"},
        xaxis: { categories: ["Doctrina Conjunta", "Doctrina Funcionamiento", "Doctrina Operacional", "Doctrina Valorica", "Textos Matrices", "Otras publicaciones"], labels:{style: {colors: '#999999', fontSize: '12px'}}},
        yaxis: { labels: {style: {colors: '#999999', fontSize : '12px'}}},
        colors: ['#FF4336']
      },
      isLoading: true,
      isDarkTheme: false, // Inicializa el tema como claro
    };

  },
  async mounted() {
    try {
        const resp = await this.contarTipoyClasificacion();
        if (resp.status === 200) {
          // console.log('data:', resp.data)
          this.chartSeriesVig = [{ name: "Vigente", data: Object.values(resp.data.resultVig)}];
          this.chartSeriesSec = [{ name: "Secretos", data: Object.values(resp.data.resultSecreto)}];
          this.chartSeriesRes = [{ name: "Reservados", data:  Object.values(resp.data.resultReservado)}];
          this.chartSeriesPub = [{ name: "Públicos", data:  Object.values(resp.data.resultPublico)}];
          this.chartSeriesAct = [{ name: "En Actualización", data:  Object.values(resp.data.resultAct)}];
          this.chartSeriesElab = [{ name: "Reservados", data:  Object.values(resp.data.resultElab)}];
          
        }
        this.isLoading = false;
        } 
        
    catch (error) {
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
        ...mapActions("auditorStore", ["contarTipoyClasificacion"]),

      updateChartThemes(){
      const textColor = !this.isDarkTheme ? '#999999' : '#FFFFFF';
      
      // Actualizar opciones de los gráficos para el tema oscuro

      this.chartOptionsVig.title.style = { color: textColor };
      this.chartOptionsVig.xaxis.labels.style = { colors: textColor };
      this.chartOptionsVig.yaxis.labels.style = { colors: textColor };
      this.chartOptionsAct.title.style = { color: textColor };
      this.chartOptionsAct.xaxis.labels.style = { colors: textColor };
      this.chartOptionsAct.yaxis.labels.style = { colors: textColor };
      this.chartOptionsElab.title.style = { color: textColor };
      this.chartOptionsElab.xaxis.labels.style = { colors: textColor };
      this.chartOptionsElab.yaxis.labels.style = { colors: textColor };
      this.chartOptionsPub.title.style = { color: textColor };
      this.chartOptionsPub.xaxis.labels.style = { colors: textColor };
      this.chartOptionsPub.yaxis.labels.style = { colors: textColor };
      this.chartOptionsRes.title.style = { color: textColor };
      this.chartOptionsRes.xaxis.labels.style = { colors: textColor };
      this.chartOptionsRes.yaxis.labels.style = { colors: textColor };
      this.chartOptionsSec.title.style = { color: textColor };
      this.chartOptionsSec.xaxis.labels.style = { colors: textColor };
      this.chartOptionsSec.yaxis.labels.style = { colors: textColor };      

      this.$set(this, 'chartOptionsVig', {...this.chartOptionsVig})
      this.$set(this, 'chartOptionsAct', {...this.chartOptionsAct})
      this.$set(this, 'chartOptionsElab', {...this.chartOptionsElab})
      this.$set(this, 'chartOptionsPub', {...this.chartOptionsPub})
      this.$set(this, 'chartOptionsRes', {...this.chartOptionsRes})
      this.$set(this, 'chartOptionsSec', {...this.chartOptionsSec})
    },
      },
    };
    </script>

    <style scoped>

    .v-card{
      color: black;
    }
</style>