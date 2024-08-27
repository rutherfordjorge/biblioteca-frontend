<template>
    <v-container fluid>
    <v-row dense>
      <v-breadcrumbs class="font-weight-medium" :items="bredItems" large />
      <v-spacer></v-spacer>
    </v-row>
        <v-col cols="12" class="text-center">
            <h2>Módulo de Auditoria de la Biblioteca Virtual</h2>
        </v-col>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <!-- <b>El objetivo de la “Biblioteca Virtual” es difundir la Doctrina Operacional, la Doctrina de Funcionamiento, la Doctrina Valórica del Ejército y la Doctrina Conjunta, como también, los procedimientos internos establecidos por la institución, permitiendo a todo el personal de planta de la institución el acceso a los textos doctrinarios, base fundamental para el correcto desarrollo de las actividades propias de la función militar.</b> -->
            <b
              >El objetivo de éste módulo es efectuar el control de los
              distintos usuarios que hacen uso de la biblioteca, con el fin
              de mantener el control de acceso en cuanto a los perfiles asignados
              a cada integrante de la institución .</b
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="12" md="6" lg="6">
        <card-auditoria
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
import CardAuditoria from "@/components/auditorias/cardAuditoria.vue";



export default {
  components: {
    CardAuditoria,

  },
    name: "Auditoria",
      data() {
    return {
      dialogModal: true,
      dialog: false,
      Item: [],
      bredItems: [
        {
          text: "Inicio",
          disabled: false,
          href: `/inicio`,
        },
        {
          //text: "Inicio",
          text: "Auditoria",
          disabled: true,
          href: `/inicio/auditoria`,
        },
      ],
      cards: [
          // {
          // title: "BUSQUEDA MASIVA",
          // src: "/iconos/Procedimientos/todos.svg",
          // count: 0,
          // id: 0,
          // to: {
          // name: "lista-doctrina",
          //   params: {
          //     id: 27,
          //   },
          // },
          // rol: [0, 161, 221, 222, 223],
          //  },
        {
          title: "CONTROL DE USUARIOS",
          src: "/iconos/auditoria.svg",
          count: 0,
          id: 0,
          to: {
            name: "auditoria-usuarios",
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "CONTROL DE VISUALIZACIONES",
          src: "/iconos/visualizacion.svg",
          count: 0,
          id: 29,
          to: {
            name: "auditoria-visualizaciones",
            params: {
              id: 29,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
/*         {
          title: "CONTROL DE DESCARGAS",
          src: "/iconos/descargas.svg",
          count: 0,
          id: 30,
          to: {
            name: "auditoria-descargas",
            params: {
              id: 30,
            },
          },
          rol: [0, 161, 221, 222, 223],
        }, */


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
