<template>
  <v-container>
    <v-row align="center" dense>
      <v-breadcrumbs
        class="font-weight-medium"
        :items="bredItems"
        large
      ></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <sugerencias />
      </v-col>
      <template v-if="currentUser.Rol == 161">
        <v-col cols="auto">
          <nuevo-documento :tipoArchivoId="41" :origenId="1" />
        </v-col>
        <v-col cols="auto">
          <v-btn depressed color="secondary" @click="dialog = !dialog"
            ><v-icon>mdi-magnify</v-icon> Ver Sugerencias</v-btn
          >
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
                <v-btn color="blue darken-1" text @click="dialog = !dialog"
                  >Cerrar</v-btn
                >
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
            <b>
              Con el propósito de contar con una herramienta que ayude a la gestión de los
              Comandantes de diferentes niveles, la Dirección de Mando y Control del Ejército (DIMACOE),
              conforme a las orientaciones del CJE, desarrolló esta plataforma de consulta, denominada
              “BIBLIOTECA DE PROCEDIMIENTOS”, la cual permite centralizar y dar facilidades de acceso
              a la información contenida en una serie de documentos normativos que contemplan diferentes
              disposiciones de: Personal, Inteligencia, Operaciones, Logística, Salud, Finanzas, Protocolo,
              Visitas, Proyectos, Capacitaciones, Contraloría, Leyes, Seguros y Telecomunicaciones, con el
              objeto que sean utilizadas como fuente de consulta.</b>
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
import Sugerencias from "@/components/sugerencias.vue";
import VerSugerencias from "@/components/verSugerencias.vue";

export default {
  components: {
    CardDocuemnto,
    NuevoDocumento,
    Sugerencias,
    VerSugerencias,
  },
  name: "Procedimientos",
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
          text: "Procedimientos Institucionales",
          disabled: true,
          href: `/inicio/procedimientos`,
        },
      ],
      cards: [
        {
          title: "Personal",
          src: "/iconos/Procedimientos/personal.svg",
          count: 0,
          id: 1,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 1,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Inteligencia",
          src: "/iconos/Procedimientos/inteligencia.svg",
          count: 0,
          id: 3,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 3,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Operaciones",
          src: "/iconos/Procedimientos/operaciones.svg",
          count: 0,
          id: 5,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 5,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Logística",
          src: "/iconos/Procedimientos/logistica.svg",
          count: 0,
          id: 6,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 6,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Mando y Control",
          src: "/iconos/Procedimientos/tele.svg",
          count: 0,
          id: 19,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 19,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Salud",
          src: "/iconos/Procedimientos/salud.svg",
          count: 0,
          id: 7,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 7,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Finanzas",
          src: "/iconos/Procedimientos/finanzas.svg",
          count: 0,
          id: 8,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 8,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Ceremonias y Protocolo",
          src: "/iconos/Procedimientos/protocolo.svg",
          count: 0,
          id: 9,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 9,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        // {
        //   title: "Visitas",
        //   src: "/iconos/Procedimientos/visitas.svg",
        //   count: 0,
        //   id: 10,
        //   to: {
        //     name: 'lista-procedimientos',
        //     params: {
        //       id: 10
        //     },
        //   },
        //   rol: [0, 161, 221, 222, 223],
        // },
        {
          title: "Proyectos",
          src: "/iconos/Procedimientos/proyectos.svg",
          count: 0,
          id: 11,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 11,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Instrucción y Entrenamiento",
          src: "/iconos/Procedimientos/capacitaciones.svg",
          count: 0,
          id: 13,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 13,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Docencia y Capacitación",
          src: "/iconos/Procedimientos/capacitaciones.svg",
          count: 0,
          id: 13,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 13,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Contraloria",
          src: "/iconos/Procedimientos/contraloria.svg",
          count: 0,
          id: 14,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 14,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Leyes",
          src: "/iconos/Procedimientos/leyes.svg",
          count: 0,
          id: 15,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 15,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Seguros",
          src: "/iconos/Procedimientos/seguros.svg",
          count: 0,
          id: 16,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 16,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Adquisiciones",
          src: "/iconos/Procedimientos/adquisiciones.svg",
          count: 0,
          id: 21,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 21,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Asuntos Antárticos",
          src: "/iconos/Procedimientos/antarticos.svg",
          count: 0,
          id: 23,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 23,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        {
          title: "Comunicaciones Estratégicas",
          src: "/iconos/Procedimientos/tele.svg",
          count: 0,
          id: 19,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 19,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
        // {
        //   title: "Mercado Público",
        //   src: "/iconos/Procedimientos/mercadopublico.svg",
        //   count: 0,
        //   id: 25,
        //   to: {
        //     name: 'lista-procedimientos',
        //     params: {
        //       id: 25
        //     },
        //   },
        //   rol: [0, 161, 221, 222, 223],
        // },
       
        {
          title: "Ciberdefensa",
          src: "/iconos/Procedimientos/antarticos.svg",
          count: 0,
          id: 24,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 24,
            },
          },
          rol: [0, 161, 221, 222, 223],
        },
       
       
       {
          title: "Borrados",
          src: "/iconos/Procedimientos/borrados.svg",
          count: 0,
          id: 20,
          to: {
            name: "lista-procedimientos",
            params: {
              id: 20,
            },
          },
          rol: [161],
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
