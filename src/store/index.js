import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import unidadesStore from "@/store/modules/unidades";
import usuariosStore from "@/store/modules/usuarios";
import personasStore from "@/store/modules/personas";
import rolesStore from "@/store/modules/roles";
import archivosStore from "@/store/modules/archivos";
import procedimientosStore from "@/store/modules/procedimientos";

var jwtDecode = require('jwt-decode');

import router from '@/router'

Vue.use(Vuex);

function getLocalUser() {
  const user = localStorage.getItem("bibliotecaToken");
  if (!user) {
    return null;
  }

  return decodeJwt(user);
}

function getToken() {
  const usuario = localStorage.getItem("bibliotecaToken");
  if (!usuario) {
    return false;
  }
  return usuario;
}

function decodeJwt(jwt) {
  const token = jwtDecode(jwt);
  return token;
}

function setCookies(token) {
  localStorage.setItem("bibliotecaToken", token);
  localStorage.setItem("bibliotecaNombre", decodeJwt(token).Nombres);
  localStorage.setItem("bibliotecaRun", decodeJwt(token).Run);
  localStorage.setItem("bibliotecaAvatar", decodeJwt(token).Foto);
  localStorage.setItem("bibliotecaExpira", formatNumericDate(decodeJwt(token).exp));
}

function setInitPage(token) {
  let usuarioConectado = decodeJwt(token);
  if ([0, 161, 221, 222, 223].includes(parseInt(usuarioConectado.Rol))) {
    router.push({ name: "inicio" });
  }
  else {
    router.push({ name: "404" });
  }
}

function getDrawer() {
  const token = localStorage.getItem("bibliotecaToken");
  if (!token) {
      return false;
  }
  const usuario =jwtDecode(token);
  
  return (usuario.Rol == 161 || usuario.Rol == 221) ? true: false;
}

function formatNumericDate(numericDate) {
  //Hora de expiración token
  var myObj = JSON.parse('{"date_created":"' + numericDate + '"}'),
    myDate = new Date(1000 * myObj.date_created);

  return myDate.toLocaleString();
}

export default new Vuex.Store({
  state: {
    token: getToken(),
    currentUser: getLocalUser(),
    isLoggedIn: false,//!!user,
    loading: false,
    auth_error: null,
    layout: 'principal-layout',
    drawerLeft: getDrawer(),
  },
  mutations: {

    LOGIN(state) {
      state.loading = true;
      state.auth_error = null;
    },

    LOGIN_SUCCESS(state, token) {
      state.auth_error = null;
      state.isLoggedIn = true;
      state.loading = false;
      state.currentUser = decodeJwt(token);
      //(decodeJwt(token))
      state.token = token;
      setCookies(token);//guarda cookies
      state.drawerLeft = (jwtDecode(token).Rol == 161 || jwtDecode(token).Rol == 221) ? true : false;//determina si se muestra el menú lateral

    },

    LOGIN_FAILED(state, mensaje) {
      state.loading = false;
      state.auth_error = mensaje;
    },

    LOGOUT(state, mensaje) {
      localStorage.removeItem("bibliotecaExpira");
      localStorage.removeItem("bibliotecaToken");
      state.isLoggedIn = false;
      state.currentUser = null;
      state.token = null;
      state.auth_error = mensaje;
    },

    SET_LAYOUT(state, newLayout) {
      state.layout = newLayout
    },

    toogleDrawer(state) {
      state.drawerLeft = !state.drawerLeft;
    },
  },
  getters: {
    layout(state) {
      return state.layout;
    },
    isLoading(state) {
      return state.loading;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    currentUser(state) {
      return state.currentUser;
    },
    authError(state) {
      return state.auth_error;
    },
    getToken(state) {
      return state.token;
    },
    drawerLeft(state){
      return state.drawerLeft;
    },
  },
  actions: {

    async login(context, credentials) {
      context.commit('LOGIN');
      return axios.post(`${process.env.VUE_APP_APIGATEWAY_URL}/Autenticacion/PostToken`, {
        'sistemaId': 7,
        "run": credentials.usuario,
        "pass": credentials.password
      }, {
        headers: {
          "Access-Control-Allow-Control": "*"
        }
      }).then((response) => {
        context.commit('LOGIN_SUCCESS', response.data);
        setInitPage(response.data);
      }).catch((error) => {
        // console.log(error.response);
        if (error.response.status == 409) {
            context.commit('LOGIN_FAILED', error.response.data)
        }
        else if (error.response.status == 404) {
            context.commit('LOGIN_FAILED', error.response.data)
        }
        else {
            context.commit('LOGIN_FAILED', `Error al tratar de conectar, ${error.response.data}`)
        }
        return error;
      })
    },

    async refreshToken({ state, commit }) {
      if (state.token) {
        return axios.post(`${process.env.VUE_APP_APIGATEWAY_URL}/Autenticacion/PostRefreshToken`, {
          'sistemaId': 7,
          'token': state.token,
        }).then((response) => {
          commit('LOGIN_SUCCESS', response.data)
        }).catch((error) => {
          commit('LOGOUT');
          return error;
        })
      }
    },

    logout(context, mensaje) {
      context.commit('LOGOUT', mensaje);
      router.replace({ name: "login" });
    },

    async restablecerCuenta(context, model) {
        return axios.post(`${process.env.VUE_APP_APIGATEWAY_URL}/Autenticacion/PostReestablecerCuenta`, {
            sistemaId: 3,
            run: model.run,
            pass: model.pass,
            nroDocumento: model.documento,
        }, {
            headers: {
                "Access-Control-Allow-Control": "*"
            }
        }).then(response => {
            return response;
        }).catch((error) => {
            if (error.response.status == 409) {
                console.log(error.response)
            }
            else if (error.response.status == 404) {
                console.log(error.response)
            }
            else {
                console.log(error.response)
            }

            return error.response;
        })
    },
    
  },
  modules: {
    unidadesStore,
    usuariosStore,
    personasStore,
    rolesStore,
    archivosStore,
    procedimientosStore,
  }
});
