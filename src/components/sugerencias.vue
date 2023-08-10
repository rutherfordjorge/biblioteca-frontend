<template>
  <v-container>
    <v-btn color="warning black--text" @click="verModal">
      <v-icon>mdi-square-edit-outline</v-icon>
      Sugerencias
    </v-btn>
    <v-dialog v-model="dialogModal" width="50vw" heigt="80vh">
      <v-form @submit.prevent="save" ref="sugerenciaform" v-model="formValid">
        <v-card>
          <v-card-title class="primaryBanner lighten-1">
          <span class="headline white--text">SUGERENCIAS Y/O CONSULTAS</span>
        </v-card-title>
        <v-spacer />
          <v-card-text> Ingrese sugerencia y/o consulta* </v-card-text>
          <v-card-text>
            <v-text-field
              label="Sugerencias (Tiene un máximo de 1000 caracteres)"
              :counter="1000"
              id="SUGERENCIA"
              v-model="sugerencia.SUGERENCIA"
              rows="5"
              :rules="Rule"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="success" @click="save">Guardar</v-btn>
            <v-btn depressed color="secondary" @click="reset">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "sugerencias",
  components: {},
  data() {
    return {
      dialogModal: false,
      sugerencia: {
        ID: 0,
        SUGERENCIA: "",
        ESTADO: 1,
      },
      formValid: false,
      Rule: [(v) => !!v || "Requiere el ingreso de una Sugerencia"],
    };
  },
  created() {},
  computed: {
    // ...mapGetters(["getToken"]),
  },
  watch: {
    Progreso(val) {
      if (val < 100) return;

      this.Progreso = 0;
    },
  },
  async mounted() {},
  beforeDestroy() {
    this.Progreso = 0;
  },
  methods: {
    ...mapActions("procedimientosStore", ["postSugerencia"]),
    verModal() {
      this.dialogModal = !this.dialogModal;
    },
    reset() {
      this.sugerencia.SUGERENCIA = "";
      this.dialogModal = false;
    },
    validate() {
      this.$refs.sugerenciaform.validate();
    },
    async save() {
      this.validate();
      if (this.formValid) {
        const res = await this.postSugerencia(this.sugerencia);
        if (res.status == 200) {
          this.$toastr(
            "success",
            "Sugerencia enviada correctamente",
            "Éxito!"
          );
        } else {
          this.$toastr("error", "Ah ocurrido un error", "Error!");
        }
        this.sugerencia.SUGERENCIA = "";
        this.dialogModal = false;
      }
    },
  },
};
</script>

<style>
</style>