<template>
  <v-card>
    <v-card-title class="primaryBanner lighten-1">
      <span class="headline white--text">Editar Documento</span>
    </v-card-title>
    <v-card-text>
      <v-form v-model="validForm" ref="form">
        <v-row>
          <v-col cols="12" :sm="origenId == 2 ? 4 : 6"
            :md="origenId == 2 ? 4 : 6">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="fechaFormateada"
                  label="Fecha Documento"
                  persistent-hint
                  readonly
                  v-on="on"
                  :rules="rules.fechA_DOC"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="es-CL"
                :first-day-of-week="1"
                v-model="item.fechA_DOC"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" :sm="origenId == 2 ? 4 : 6"
            :md="origenId == 2 ? 4 : 6">
            <v-autocomplete
              persistent-hint
              return-object
              :items="unidades"
              v-model="item.unidad"
              item-text="descripcion"
              item-value="codigo"
              autocomplete
              label="Unidad"
              :rules="rules.unidad"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-text-field
              :rules="rules.numero"
              v-model="item.numero"
              label="Numero"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-autocomplete
              persistent-hint
              return-object
              :items="tiposDocumentos"
              v-model="item.tipo"
              item-text="nombre"
              item-value="id"
              autocomplete
              label="Tipo"
              :rules="rules.tipo"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-autocomplete
              persistent-hint
              return-object
              :items="clasi"
              v-model="item.clasificacion"
              item-text="nombre"
              item-value="id"
              autocomplete
              label="Clasificación"
              :rules="rules.clasificacion"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="origenId == 2" cols="12" sm="4" md="4">
            <v-autocomplete
              persistent-hint
              return-object
              :items="edicion"
              v-model="item.edicion"
              item-text="text"
              item-value="value"
              autocomplete
              label="Edición"
              :rules="rules.edicion"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="origenId == 2" cols="12" sm="4" md="4">
            <v-autocomplete
              persistent-hint
              return-object
              :items="estado"
              v-model="item.estado"
              item-text="nombre"
              item-value="id"
              autocomplete
              label="Estado"
              :rules="rules.estado"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            :sm="origenId == 2 ? 8 : 12"
            :md="origenId == 2 ? 8 : 12"
          >
            <v-text-field
              :rules="rules.descripcion"
              v-model="item.descripcion"
              label="Descripción"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
      <v-btn color="blue darken-1" text @click="edit">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "editarDocumento",
  props: ["tipoArchivoId", "origenId", "item"],
  components: {},
  data: () => ({
    menu1: false,
    tipoDocumento: [],
    ItemDetailModal: false,
    dialog: false,
    edicion: [],
    clasi: [
      { id: 0, nombre: "PUBLICO" },
      { id: 1, nombre: "RESERVADO" },
      { id: 2, nombre: "SECRETO" },
    ],
    estado: [
      { id: 1, nombre: "VIGENTE" },
      { id: 2, nombre: "EN ACTUALIZACION" },
      { id: 3, nombre: "EN ELABORACION" },
    ],
    editedIndex: -1,
    defaultItem: {
      id: 0,
      fechA_DOC: null,
      numero: "",
      ruta: 0,
      descripcion: null,
      tipo: null,
      unidad: null,
      documento: null,
      clasificacion: null,
    },
    validForm: false,
    rules: {
      fechA_DOC: [(v) => !!v || "Debe seleccionar una fecha"],
      unidad: [(v) => !!v || "La unidad es requerido"],
      numero: [(v) => !!v || "El numero es requerido"],
      descripcion: [(v) => !!v || "La descripción es requerida"],
      tipo: [(v) => !!v || "El tipo es requerido"],
      clasificacion: [(v) => !!v || "La clasificación es requerida"],
      edicion: [(v) => !!v || "La edición del texto es requerida"],
      estado: [(v) => !!v || "El estado del texto es requerido"],
      documento: [(v) => !!v || "El documento es requerido"],
      pass: [true],
    },
  }),
  activated() {this.item.clasificacion = this.Clasificacion(this.item.clasificacion)},
  async mounted() {
    for (let i = 2015; i <= new Date().getUTCFullYear(); i++) {
      this.edicion.push(i)
    }
    if (this.unidades == 0) {
      await this.fetchUnidades();
    }
    if (this.tiposDocumentos == 0) {
      await this.fetchTiposDocumentos();
    }
    this.item.clasificacion = this.Clasificacion(this.item.clasificacion);
    const res = await this.fetchTipoDocumento(this.$route.params.id);
    this.tipoDocumento = res.data;
  },
  computed: {
    ...mapGetters(["currentUser"]),
    ...mapGetters("unidadesStore", ["unidades"]),
    ...mapGetters("procedimientosStore", ["tiposDocumentos"]),
    fechaFormateada: {
      get: function () {
        if (this.item.fechA_DOC != null) {
          return this.formatearFecha(this.item.fechA_DOC);
        }
        return "";
      },
      set: function () {
        this.item.fechA_DOC = this.formatearFecha(this.item.fechA_DOC);
      },
    },
  },
  
  methods: {
    ...mapActions("unidadesStore", ["fetchUnidades"]),
    ...mapActions("procedimientosStore", [
      "fetchTipoDocumento",
      "fetchTiposDocumentos",
      "putDocumento",
    ]),
    Clasificacion(ClasificacionID) {
      return ClasificacionID == 0
        ? { id: 0, nombre: "PUBLICO" }
        : ClasificacionID == 1
        ? { id: 1, nombre: "RESERVADO" }
        : ClasificacionID == 2
        ? { id: 2, nombre: "SECRETO" }
        : { id: 4, nombre: "SIN CLASIFICACION" };
    },
    validate() {
      return this.$refs.form.validate();
    },
    async edit() {
      if (this.validate()) {
        let documento = {
          id: this.item.id,
          fechA_DOC: this.item.fechA_DOC,
          numero: this.item.numero,
          descripcion: this.item.descripcion,
          unidadid: this.item.unidad.codigo,
          tipoid: this.item.tipo.id,
          edicion: this.item.edicion,
          clasificacion: this.item.clasificacion.id,
          estado: this.item.estado,
          origenid: this.origenId,
        };
        await this.putDocumento(documento).then(async (resp) => {
          // console.log(resp);
          if (resp.status == 200) {
            this.$toastr("success", "Documento modificado con exito", "Éxito!");
          } else {
            if (resp.status === 404)
              this.$toastr(
                "error",
                "No se ha encontrado el registro",
                "Error!"
              );
            else if (resp.status === 401)
              this.$toastr(
                "error",
                "No tiene acceso para realizar esta operación",
                "Error!"
              );
            else this.$toastr("error", resp.statusText, "Error!");
            return;
          }
        });
        this.close();
      } else {
        this.$toastr("error", "Formulario Incompleto", "Error!");
      }
    },
    close() {
      this.$emit("close");
    },
    formatearFecha(date) {
      if (date == null) return null;
      return this.moment(date).format("YYYY-MM-DD");
    },
  },
};
</script>

<style>
.theme--dark.v-progress-linear {
  color: #000000 !important;
}

.breadcrumbs {
  font-weight: 100;
}
</style>