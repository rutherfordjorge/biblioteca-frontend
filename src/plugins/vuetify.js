import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import es from "vuetify/es5/locale/es";

Vue.use(Vuetify);

const light = {
  primary: "#B71C1C",
  secondary: "#424242",
  info: "#2196F3",
  success: "#008000",
  error: "#FF5252",
  background: "#429191"
}

const dark = {
  background: "#000000",
  primary: "#fb2424",
  secondary: "#808080",
  info: "#2196F3",
  success: "#4CAF50",
  error: "#FF5252",
}

export default new Vuetify({
theme: {
themes: {
    light,
    dark,
},
},
lang: {
locales: { es },
current: "es"
}
});