<template>
  <v-container>
    <v-row align="center" dense>
      <v-breadcrumbs
        class="font-weight-medium"
        :items="bredItems"
        large
      ></v-breadcrumbs>
      <v-spacer></v-spacer>
      <template v-if="currentUser.Rol == 221">
        <v-col cols="auto">
          <nuevo-documento :tipoArchivoId="81" :origenId="2" />
        </v-col>
      </template>
    </v-row>
    <v-row dense class="text-justify">
      <v-col cols="12" class="px-4">
        <v-card elevation="1" color="#e9f3ff">
          <v-card-text>
            <!-- <b>El objetivo de la “Biblioteca Virtual” es difundir la Doctrina Operacional, la Doctrina de Funcionamiento, la Doctrina Valórica del Ejército y la Doctrina Conjunta, como también, los procedimientos internos establecidos por la institución, permitiendo a todo el personal de planta de la institución el acceso a los textos doctrinarios, base fundamental para el correcto desarrollo de las actividades propias de la función militar.</b> -->
            <b>En este módulo usted encontrará los textos doctrinarios de la institución
              que han sido publicados por la División Doctrina. Para tener acceso a textos
              de carácter reservado y/o secreto, se deberá solicitar por oficio a la
              DIVDOC, indicando nombre y RUN de la persona a la cual se le solicita
              otorgar acceso.
              Para mejorar las capacidades de esta plataforma, la DIVDOC pone a disposición
              del personal una breve encuesta, disponible a través del siguiente codigo QR:</b>
              <v-col align="center">
              <div class="imagen-container">
                  <img class="imagen" src="/QR_encuesta.jpeg" alt="QR encuesta">
              </div>
              </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="card in cards" :key="card.title" sm="12" md="4" lg="4">
        <card-docuemnto
          v-if="card.rol.includes(parseInt(currentUser.Rol))"
          :key="card.id"
          :title="card.title"
          :src="card.src"
          :count="card.count"
          :to="card.to"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CardDocuemnto from "@/components/cardDocumento.vue";
import NuevoDocumento from "@/components/nuevoDocumento.vue";

export default {
  components: {
    CardDocuemnto,
    NuevoDocumento,
  },
  name: "Biblioteca",
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
          text: "Textos Doctrinarios",
          disabled: true,
          href: `/inicio/biblioteca`,
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
          title: "DOCTRINA CONJUNTA",
          src: "/iconos/BiblioVirtual/DOCTRINA_CONJUNTA.svg",
          count: 0,
          id: 27,
          to: {
            name: "lista-doctrina",
            params: {
              id: 27,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "DOCTRINA DE FUNCIONAMIENTO",
          src: "/iconos/BiblioVirtual/DOCTRINA_DE_FUNCIONAMIENTO.svg",
          count: 0,
          id: 28,
          to: {
            name: "lista-doctrina",
            params: {
              id: 28,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "DOCTRINA OPERACIONAL",
          src: "/iconos/BiblioVirtual/DOCTRINA_OPERACIONAL.svg",
          count: 0,
          id: 29,
          to: {
            name: "lista-doctrina",
            params: {
              id: 29,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "DOCTRINA VALORICA",
          src: "/iconos/BiblioVirtual/DOCTRINA_VALORICA.svg",
          count: 0,
          id: 30,
          to: {
            name: "lista-doctrina",
            params: {
              id: 30,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "TEXTOS MATRICES",
          src: "/iconos/BiblioVirtual/TEXTOS_MATRICES.svg",
          count: 0,
          id: 31,
          to: {
            name: "lista-doctrina",
            params: {
              id: 31,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "OTRAS PUBLICACIONES",
          src: "/iconos/BiblioVirtual/OTRAS_PUBLICACIONES.svg",
          count: 0,
          id: 32,
          to: {
            name: "lista-doctrina",
            params: {
              id: 32,
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
.imagen-container {
  max-width: 50%;
  max-height: 150px;
  overflow: hidden;
}
.imagen {
  width: 30%;
  height: auto;
}
</style>
