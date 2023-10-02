<template>
  <v-container>
    <v-row align="center" dense>
      <v-breadcrumbs
        class="font-weight-medium"
        :items="bredItems"
        large
      ></v-breadcrumbs>
      <v-spacer></v-spacer>
      <!-- boton sugerencias -->
      <!--
        <v-col cols="auto">
        <sugerencias />
        </v-col>
      -->
      <template v-if="currentUser.Rol == 161">
        <!------------ boton para nuevo ducumento ------------>
        <!--
        <v-col cols="auto">
          <nuevo-documento :tipoArchivoId="41" :origenId="1" />
        </v-col>
        -->
        <!------------ boton para nuevo formulario ----------->
        <v-col cols="auto">
          <nuevo-formulario :tipoArchivoId="41" :origenId="3" />
        </v-col>
        <!---------------------------------------------------->
        <v-col cols="auto">
            <v-btn depressed color="secondary" @click="dialog = !dialog">
                <v-icon>mdi-magnify</v-icon> Ver Sugerencias
            </v-btn>
          <v-dialog scrollable v-model="dialog" width="90vw" heigt="100vh">
            <v-card>
              <v-card-title class="primaryBanner lighten-1">
                <span class="headline white--text">Listado de Sugerencias</span>
                <v-spacer />
                <v-btn icon @click="dialog = false">
                  <v-icon color="white">mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <ver-sugerencias v-if="dialog" />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = !dialog">
                    Cerrar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </template>
    </v-row>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <h3>Parrafo expicativo </h3>
            <br>
            <b>
                Lorem Ipsum es simplemente el texto de relleno de las 
                imprentas y archivos de texto. Lorem Ipsum ha sido el 
                texto de relleno estándar de las industrias desde el año 1500, 
                cuando un impresor (N. del T. persona que se dedica a la imprenta) 
                desconocido usó una galería de textos y los mezcló de tal manera que 
                logró hacer un libro de textos especimen. .
            </b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="12" md="4" lg="3">
        <card-docuemnto
          v-if="card.rol.includes(parseInt(currentUser.Rol))"
          :key="card.id"
          :title="card.title"
          :src="card.src"
          :count="card.count"
          :to="card.to"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CardDocuemnto from "@/components/cardDocumento.vue";
//import NuevoDocumento from "@/components/nuevoDocumento.vue";
//import Sugerencias from "@/components/sugerencias.vue";
import VerSugerencias from "@/components/verSugerencias.vue";
import NuevoFormulario from "@/components/nuevoFormulario";

export default {
  components: {
    CardDocuemnto,
    //NuevoDocumento,
    //Sugerencias,
    VerSugerencias,
    NuevoFormulario,
  },
  name: "Conocimientos",
  data() {
    return {
      dialog: false,
      Item: [],
      Dcmt: [],
      bredItems: [
        {
          text: "Inicio",
          disabled: false,
          href: `/inicio`,
        },
        {
          text: "Gestión del Conocimiento",
          disabled: true,
          href: `/inicio/conocimientos`,
        },
      ],
      cards: [
        {
          title: "Seguridad y Defensa",
          src: "/iconos/Procedimientos/contraloria.svg",
          count: 0,
          id: 1,
          to: {
            name: "lista-conocimientos",
            params: {
              id: 1,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Recursos Humanos y Estudios Sociales",
          src: "/iconos/Procedimientos/contraloria.svg",
          count: 0,
          id: 2,
          to: {
            name: "lista-conocimientos",
            params: {
              id: 2,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Ciencias Miltares, Combate, Generacion de Doctrina y Docencia",
          src: "/iconos/Procedimientos/contraloria.svg",
          count: 0,
          id: 3,
          to: {
            name: "lista-conocimientos",
            params: {
              id: 3,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Ciencia y Tecnologia",
          src: "/iconos/Procedimientos/contraloria.svg",
          count: 0,
          id: 4,
          to: {
            name: "lista-conocimientos",
            params: {
              id: 4,
            },
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
      if (resp.status == 200) {
        resp.data.forEach((element) => {
          this.cards.map((Element) => {
            var result = element.filter((a1) => a1.tipoid == Element.id);
            if (result.length > 0) {
              Element.count = result[0].numero;
            }
            return Element;
          });
        });
      }
    });
  },
  methods: {
    ...mapActions("procedimientosStore", ["fetchCountDocumentos"]),
  },
};
</script>

<style scoped>
</style>
