<template>

  <v-footer class="letra-f" color="grey darken-4" dark >
    <v-row justify="center pa-0" no-gutters>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="4" class="d-flex align-center">
            &nbsp; &nbsp;
            <div class="image-container mr-2">
              <v-img src="@/assets/escudos/divdoc.png" height="40px"></v-img>
            </div>

            &nbsp; <strong> {{ unidad }} </strong>
          </v-col>

          <v-col cols="12" sm="4" class="d-flex align-center">
            <v-icon size="18" aria-hidden="false"> mdi-phone-in-talk </v-icon>
            &nbsp; Telefono: {{ telefono }}
          </v-col>

          <v-col cols="12" sm="4" class="d-flex align-center">
            <v-icon size="18" aria-hidden="false"> mdi-email </v-icon>
            &nbsp; Correo: {{ correo }}
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-center">
            <strong>Administracion Técnica</strong>&nbsp;|&nbsp; DDS - RINTE 2
            &nbsp;<v-icon size="18">mdi-phone</v-icon> &nbsp; (+56 2) 2693 4000
            &nbsp;|&nbsp;
            <v-icon size="18">mdi-email</v-icon> division@ejercito.cl
          </v-col>
        </v-row>
      </v-container>
      <v-col class="text-center mt-1" cols="12">
        <div style="display: inline-block; position: relative">
          <span
            >{{ new Date().getFullYear() }} —
            <strong
              >Todos los derechos reservados para el Regimiento de Inteligencia
              N°2 "LLAITÚN"</strong
            >
          </span>
          <img
            src="@/assets/imagenes/escudo.png"
            width="30"
            style="position: absolute; left: -40px; top: -3px"
          />
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  props: ['imagen', "unidad", "telefono", "correo"],
  data() {
    return {
      links: ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"],
    };
  },
};
</script>
<style>
/* Ajuste de margen para la imagen */
.image-container {
  width: 80px; /* Ancho personalizado para la imagen */
  margin-right: 10px; /* Espacio entre la imagen y el texto */
}
.letra-f {
  font-size: 0.99rem;
}
</style>