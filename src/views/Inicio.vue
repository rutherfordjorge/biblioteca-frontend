<template>
  <v-container>
    <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
    <v-row dense class="justify-center">
      <v-col v-for="card in cards" :key="card.id" sm="12" md="6" lg="4">
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
          // to: { name: "biblioteca" },
          // responsable: 'DIVDOC - Depto IV - Anexo: 34111'
          responsable: 'Disponible Próximamente...',
        },
        {
          title: "Procedimientos Institucionales",
          src: "dimacoe.png",
          count: null,
          id: 1,
          to: { name: "procedimientos" },
          responsable: 'DIMACOE - Depto I - Anexo: 32961',
        },
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
    ...mapActions("procedimientosStore", ["fetchCountDocumentos"]),
    reset() {
      this.dialogModal = false;
    },
  },
};
</script>

<style scoped>

</style>
