<template>
  <div>
    <v-overlay v-if="isDelete">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card>
      <v-card-title class="headline">Confirmación</v-card-title>
      <v-card-text>¿Realmente desea eliminar el documento?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="eliminar">Eliminar</v-btn>
        <!-- <v-btn color="primary darken-1" text @click="closeDelete">Salir</v-btn> -->
        <v-btn color="primary darken-1" text @click="close4">Salir</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "eliminarDocumento",
  props: ["tipoArchivoId", "origenId", "item"],
  components: {},
  data: () => ({
    isDelete: false,
  }),
  methods: {
    ...mapActions("procedimientosStore", ["putBloquearDocumento"]),
    ...mapActions("archivosStore", ["putBloquearArchivo"]),
    async eliminar() {
      if (this.item != null) {
        await this.putBloquearDocumento(this.item.id).then(
          async (respuesta) => {
            if (respuesta.status == 200) {
              await this.putBloquearArchivo(this.item.documentoId).then(
                (respu) => {
                  if (respu.status == 200) {
                    this.$toastr("success", "Documento Borrado", "Éxito!");
                  } else {
                    this.$toastr("error", respu.message, "Error!");
                    return;
                  }
                }
              );
              this.isDelete = !this.isDelete;
            } else {
              this.$toastr("error", respuesta.message, "Error!");
              this.isDelete = !this.isDelete;
              return;
            }
          }
        );
      }
      this.isDelete = !this.isDelete;
      this.close();
      this.close4();
      this.closeDelete();
      
    },
    closeDelete() {
      this.$emit("closeDelete");
    
    },
    close() {
      this.$emit("close");
    },
    close4() {
      this.$emit("close4");
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