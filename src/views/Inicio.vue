<template>
  <v-container>
    <img
    :src="imagenActual"
    @mouseover="cambiarImagen(imagenHover)"
    @mouseout="cambiarImagen(imagenNormal)
    alt=Imagen"
    />
    <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
    <v-row dense class="justify-center">
      <v-col v-for="card in cards" :key="card.id" sm="12" md="6" lg="6">
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
          to: { name: "biblioteca" },
          responsable: 'DIVDOC - Depto I - Anexos: 83200-83201-83203',
          // responsable: 'Disponible Próximamente...',
        },
      
        {
          // disabled: true,
          title: "Procedimientos Ciberdefensa",
          // src: "logo_csirt.png",
          // imagenNormal: "logo_csirt.png",
          // imagenHover: "enconstruccion.png",
          // imagenActual: "logo_csirt.png",
          src: "csirt_construccion.png",
          count: null,
          id: 4,
          // to: { name: "ciberdefensa" },
          to: "",
          responsable: 'CSIRT - Anexo: ',
        },

         
        {
          title: "Procedimientos Institucionales",
          src: "dimacoe.png",
          count: null,
          id: 1,
          to: { name: "procedimientos" },
          responsable: 'DIMACOE - Depto I - Anexo: 32961',
        },
        
        {
          title: "Conocimiento",
          src: "imagenNoDisponible.png",
          count: null,
          id: 3,
          to: { name: "conocimientos" },
          responsable: '',
        },

        // {
        //   disabled: true,
        //   title: "Finanzas DIFE",
        //   // src: "logo_dife.png",
        //   src: "dife_construccion.png",
        //   count: null,
        //   id: 5,
        //   to: { name: "finanzas" },
        //   responsable: 'DIFE - Depto ? - Anexo: ?',
        // },


      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
  async mounted() {
    await this.fetchCountDocumentos().then(resp => {
      // console.log('resp: ', resp.data)
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
