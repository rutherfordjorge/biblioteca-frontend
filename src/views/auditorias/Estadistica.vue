<template>
    <v-container fluid>
    <v-row dense>
      <!-- <v-breadcrumbs class="font-weight-medium" :items="bredItems" large /> -->
      <breadcrumb :items="bredItems" />
      <v-spacer></v-spacer>
    </v-row>
        <v-col cols="12" class="text-center">
            <h2>Módulo de estadística de la Biblioteca Virtual</h2>
        </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <!-- <b>El objetivo de la “Biblioteca Virtual” es difundir la Doctrina Operacional, la Doctrina de Funcionamiento, la Doctrina Valórica del Ejército y la Doctrina Conjunta, como también, los procedimientos internos establecidos por la institución, permitiendo a todo el personal de planta de la institución el acceso a los textos doctrinarios, base fundamental para el correcto desarrollo de las actividades propias de la función militar.</b> -->
            <b
              >Aca va el modulo de estadistica de la biblioteca.</b
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="2" md="3" lg="6">
        <card-estadistica
          v-if="card.rol.includes(parseInt(currentUser.Rol))"
          :key="card.id"
          :title="card.title"
          :src="card.src"
          :to="card.to"
        />
      </v-col>
    </v-row>
        <v-card class="elevation-0">
       

            <v-container fluid>
  
            </v-container>
        </v-card>
    </v-container>
</template>



<script>
import { mapActions, mapGetters } from "vuex";
import Breadcrumb from "@/components/base/breadcrumb";
import cardEstadistica from "@/components/auditorias/cardEstadistica.vue";

export default {
  components: {
    cardEstadistica,
    Breadcrumb,
  },
    name: "Estadistica",
      data() {
    return {
      dialogModal: true,
      dialog: false,
      Item: [],
      bredItems: [
        {
          text: "Inicio",
          disabled: false,
          to: { name: `inicio` },
        },
        {
          text: "TEXTOS DOCTRINARIOS",
          disabled: false,
          to: { name: `archivos`, props: { id: 1 } },
        },
        {
          text: "ESTADÍSTICAS",
          disabled: true,
          href: ``,
        },
      ],
      cards: [

        {
          title: "VISUALIZACIONES",
          src: "/iconos/descarga.svg",
          count: 0,
          id: 27,
          to: {
            name: "estadistica-visualizaciones",
            
          },
          rol: [0, 161, 221, 222, 223],
        },
                {
          title: "USUARIOS CONECTADOS",
          src: "/iconos/usuario_conectado.svg",
          count: 0,
          id: 27,
          to: {
            name: "estadistica-usuarios",
            
          },
          rol: [0, 161, 221, 222, 223],
        },
                {
          title: "TEXTOS DOCTRINARIOS",
          src: "/iconos/texto.svg",
          count: 0,
          id: 27,
          to: {
            name: "estadistica-textos",
            
          },
          rol: [0, 161, 221, 222, 223],
        },
                {
          title: "GRADOS DE ACCESO",
          src: "/iconos/grado_de_acceso.svg",
          count: 0,
          id: 27,
          to: {
            name: "estadistica-accesos",
            
          },
          rol: [0, 161, 221, 222, 223],
        },

      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  async mounted() {
    await this.fetchCountDocumentos().then((resp) => {
      let proce = 0;
      if (resp.status == 200) {
        resp.data.forEach((element) => {
          element.map((item) => {
            if (item.tipoid >= 1 && item.tipoid <= 26) {
              proce = proce + item.numero;
            }
          });
          this.cards.map((Element) => {
            var result = element.filter((a1) => a1.tipoid == Element.id);
            if (result.length > 0) {
              Element.count = result[0].numero;
            }
            if (Element.id == null) {
              Element.count = proce;
            }
            return Element;
          });
        });
      }
    });
  },
  beforeMount() {},
  methods: {
    ...mapActions("procedimientosStore", ["fetchCountDocumentos"]),
  },
};
</script>

<style scoped>
title {
  background: black;
}
</style>
