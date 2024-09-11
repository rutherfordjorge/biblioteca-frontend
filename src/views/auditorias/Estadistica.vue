<template>
    <v-container fluid>
    <v-row dense>
      <breadcrumb :items="bredItems" />
      <v-spacer></v-spacer>
    </v-row>
        <v-col cols="12" class="text-center">
            <h2>Módulo de estadística de la Biblioteca Virtual</h2>
        </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="2">
          <v-card-text>
            <b>Aca va el modulo de estadistica de la biblioteca.</b>
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
    </v-container>
</template>



<script>
import {mapGetters } from "vuex";
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
      Item: [],
      bredItems: [
        { text: "Inicio", disabled: false, to: { name: `inicio` }},
        { text: "TEXTOS DOCTRINARIOS", disabled: false, to: { name: `archivos`, props: { id: 1 } }},
        { text: "MODULO DE ESTADISTICAS", disabled: true, to: ``},
      ],
      cards: [
        { title: "VISUALIZACIONES", src: "/iconos/descarga.svg", count: 0, id: 0, to: { name: "estadistica-visualizaciones"}, rol: [221]},
        { title: "USUARIOS CONECTADOS", src: "/iconos/usuario_conectado.svg", count: 0, id: 0, to: {name: "estadistica-usuarios"},rol: [221]},
        { title: "TEXTOS DOCTRINARIOS", src: "/iconos/texto.svg", count: 0, id: 0, to: {name: "estadistica-textos"}, rol: [221]},
        { title: "GRADOS DE ACCESO", src: "/iconos/grado_de_acceso.svg", count: 0, id: 0, to: {name: "estadistica-accesos"}, rol: [221]},
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>

<style scoped>
</style>
