<template>
  <v-container>
    <img
    :src="imagenActual"
    @mouseover="cambiarImagen(imagenHover)"
    @mouseout="cambiarImagen(imagenNormal)
    alt=Imagen"
    />

    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="2" color="#e9f3ff">
          <v-card-text class="display-2 text-center">
            <b>BIBLIOTECA VIRTUAL DEL EJÉRCITO</b>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
    <v-row dense class="justify-center">
      <v-col v-for="card in cards" :key="card.id" sm="12" md="4" lg="3">
        <card-documento
          :key="card.id"
          :title="card.title"
          :src="card.src"
          :count="card.count"
          :to="card.to"
          :responsable="card.responsable"
        />
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapActions, mapGetters } from "vuex";
import CardDocumento from "@/components/cardDocumento.vue";

export default {
  components: {
    CardDocumento,
  },
  name: "Inicio",
  data() {
    return {
      // imagenNormal: "dimacoe.png",
      // imagenHover: "enconstruccion.png",
      // imagenActual: "dimacoe.png",

      dialogModal: false,
      dialog: false,
      Item: [],
      bredItems:[{
        text: "Inicio",
        disabled: true,
        href: `/inicio`,
      }],
      cards: [
        {
          title: "Textos Doctrinarios",
          src: "divdoc.ico",
          count: null,
          id: 2,
          to: {
          name: "lista-doctrina",
            params: {
              id: 0,
            },
          },
          // to: { name: "biblioteca" },
          // responsable: 'DIVDOC - Depto I - Anexos:83200',
          // responsable: 'Disponible Próximamente...',
        },
        
        // {
        //   title: "Procedimientos Institucionales",
        //   src: "dimacoe.png",
        //   count: null,
        //   id: 1,
        //   to: { name: "procedimientos" },
        //   responsable: 'DIMACOE - Depto I - Anexo: 32961',
        // },
      
        {
          title: "Disposiciones Institucionales",
          src: "dimacoe.png",
          count: null,
          id: 1,
          to: { name: "procedimientos" },
          // responsable: 'DIMACOE - Depto I - Anexo: 32961',
        },

        {
          // disabled: true,
          title: "Ciberdefensa",
          // src: "logo_csirt.png",
          // imagenNormal: "logo_csirt.png",
          // imagenHover: "enconstruccion.png",
          // imagenActual: "logo_csirt.png",
          src: "csirt_construccion.png",
          count: null,
          id: 4,
          // to: { name: "ciberdefensa" },
          to: "",
          // responsable: 'CSIRT - Anexo: ',
        },

                        
        {
          title: "Boletín Oficial",
          src: "boletin_construccion.png",
          count: null,
          id: 3,
          to: "",
          // responsable: '-.-',
        },

        {
          title: "Procesos",
          src: "enconstruccion.png",
          count: null,
          id: 6,
          to: "",
          responsable: '-.-',
        },

        {
          disabled: false,
          title: "Tesis",
          // src: "logo_dife.png",
          src: "enconstruccion.png",
          count: null,
          id: 5,
          // to: { name: "biblioteca" },
          // responsable: 'Test',
        },

        {
          disabled: false,
          title: "SILAE",
          // src: "logo_dife.png",
          src: "enconstruccion.png",
          count: null,
          id: 7,
          // to: { name: "biblioteca" },
          // responsable: 'Test',
        },

        {
          disabled: false,
          title: "Otras Publicaciones",
          // src: "logo_dife.png",
          src: "otraspublicaciones.png",
          count: null,
          id: 8,
          // to: { name: "biblioteca" },
          // responsable: 'Test',
        },

      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  async mounted() {
    await this.fetchCountDocumentos().then(resp => {
      console.log('resp: ', resp.data)
      if (resp.status == 200) {
        resp.data.forEach(element => {
          // console.log('element: ', element)
          this.items = element;
          this.cards.map(Element => {
            // console.log('Element: ', Element)
            var result = this.items.filter(a1 => a1.origenid == Element.id);
            // console.log('Result: ', result)
            if (result.length > 0) {
              Element.count = result[0].numero;
            }
            return Element;
          });
        });
      }
    });
  },
  beforeMount() {},
  methods: {
    cambiarImagen(nuevaImagen){
      this.imagenActual = nuevaImagen;
    },

    ...mapActions("procedimientosStore", ["fetchCountDocumentos"]),
    reset() {
      this.dialogModal = false;
    },
  },
};
</script>

<style scoped>
img {
  width: 200px;
  height: auto;
}
</style>
