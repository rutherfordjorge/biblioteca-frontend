import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
import { jwtDecode } from 'jwt-decode';

Vue.use(Vuex)

// Rutas de módulos del store

import usuariosStore from "@/store/modules/Diccionario/usuarios"
import personasStore from "@/store/modules/Diccionario/personas"
import archivosStore from "@/store/modules/Diccionario/archivos"

import conocimientosStore from "@/store/modules/conocimientos";
import coleccionesStore from "@/store/modules/colecciones";
import bibliotecaStore from "@/store/modules/archivos";
import logArchivosStore from "@/store/modules/logArchivos";

// auditorias
import auditorStore from "@/store/modules/auditorias/auditor";


// Constantes y Funciones globales del Index Store

// const jwtDecode = require('jwt-decode');
const sistemaId = 7
const adminRoles = [161] // Roles con privilegios de administración
const ruta = `${process.env.VUE_APP_APIGATEWAY_URL}/Autenticacion`
const prefijo = 'biblioteca'

function getLocalUser() {
	const user = localStorage.getItem(prefijo + "Token");
	if (!user) {
		return null;
	}
	
	return jwtDecode(user);
}

function getToken() {
	const usuario = localStorage.getItem(prefijo + "Token");
	if (!usuario) {
		return false;
	}
	
	return usuario;
}

function getDrawer() {
	const token = localStorage.getItem(prefijo + "Token");
	if (!token) {
		return false;
	}
	const usuario = jwtDecode(token);
	
	return adminRoles.includes(parseInt(usuario.Rol))
}

function setCookies(token) {
	// Los nombres de las cookies son diferentes para cada proyecto (cambia solo el prefijo)
	localStorage.setItem(prefijo + "Token", token);
	localStorage.setItem(prefijo + "Nombre", jwtDecode(token).Nombres);
	localStorage.setItem(prefijo + "Run", jwtDecode(token).Run);
	localStorage.setItem(prefijo + "Avatar", jwtDecode(token).Foto);
	localStorage.setItem(prefijo + "Expira", formatNumericDate(jwtDecode(token).exp));
}

function formatNumericDate(numericDate) {
	//Hora de expiración token
	var myObj = JSON.parse('{"date_created":"' + numericDate + '"}'),
	myDate = new Date(1000 * myObj.date_created);
	
	return myDate.toLocaleString();
}

// STORE de la aplicación
export default new Vuex.Store({
	state: {
        token: getToken(),
        currentUser: getLocalUser(),
		isLoggedIn: !!getLocalUser(),
        loading: false,
        auth_error: null,
        layout: 'principal-layout',
        drawerLeft: getDrawer(),
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
        drawerLeft(state) {
            return state.drawerLeft;
        },
        authError(state) {
            return state.auth_error;
        },
        getToken(state) {
            return state.token;
        },
        getRolId(state) {
            if (state.currentUser && state.currentUser.Rol) {
                return state.currentUser.Rol;
            }
            return null;
        },
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
            state.currentUser = jwtDecode(token);
            state.token = token;

            setCookies(token);//guarda cookies
            state.drawerLeft = adminRoles.includes(parseInt(jwtDecode(token).Rol))//determina si se muestra el menú lateral
        },

        LOGIN_FAILED(state, mensaje) {
            state.loading = false;
            state.auth_error = mensaje;
        },

        LOGOUT(state, mensaje) {
            localStorage.removeItem(prefijo + "Token");
            localStorage.removeItem(prefijo + "Expira");
            state.isLoggedIn = false;
            state.currentUser = null;
            state.token = null;
            state.auth_error = mensaje;
        },

        SET_LAYOUT(state, newLayout) {
            state.layout = newLayout
        },
	},
	actions: {
		async login(context, credentials) {
            context.commit('LOGIN');
            return axios.post(`${ruta}/PostLogin`, {
                sistemaId,
                run: credentials.usuario,
                pass: btoa(credentials.password)
            }, {
                headers: {
                    "Access-Control-Allow-Control": "*"
                }
            }).then(response => {
                context.commit('LOGIN_SUCCESS', response.data);
                const usuarioConectado = jwtDecode(response.data);
                
                if ([0, 161, 221, 222, 223, 501, 502].includes(parseInt(usuarioConectado.Rol))) {
                    router.push({ name: "inicio" });
                }
                // Configurar para cada rol
                // else if (usuarioConectado.Rol == 421 || usuarioConectado.Rol == 441) {
                //     router.push({ name: "doc-usuario" });
                else {
                    context.commit('LOGIN_FAILED', 'Ha sucedido un error, perfil no creado');
                }
            // }
            }).catch(error => {
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

        logout(context, mensaje) {
            context.commit('LOGOUT', mensaje);
            router.replace({ name: "login" });
        },

        async restablecerCuenta(context, model) {
            return axios.post(`${ruta}/PostReestablecerCuenta`, {
                sistemaId,
                run: model.run,
                pass: btoa(model.pass),
                nroDocumento: model.documento,
            }, {
                headers: {
                    "Access-Control-Allow-Control": "*"
                }
            }).then(response => {
                return response;
            }).catch((error) => {
                if (error.response.status == 409) {
                    // console.log(error.response)
                }
                else if (error.response.status == 404) {
                    // console.log(error.response)
                }
                else {
                    // console.log(error.response)
                }

                return error.response;
            })
        },

        async refreshToken({ state, commit }) {
            if (state.token) {
                return axios.post(`${ruta}/PostRefreshToken`, {
                    sistemaId,
                    token: state.token,
                }).then((response) => {
                    console.log('refresh-token');
                    commit('LOGIN_SUCCESS', response.data)
                }).catch((error) => {
                    commit('LOGOUT');
                    return error;
                })
            }
        },
	},
	modules: {
        // Aquí se registran los módulos del store
        usuariosStore,
        personasStore,
        archivosStore,
        // Biblioteca
        conocimientosStore,
        coleccionesStore,
        bibliotecaStore,
        logArchivosStore,
        // Auditorias
        auditorStore,
	}
})
