import axios from 'axios';

export default {
    namespaced: true,
    state:{
        usuarios: [],
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_USUARIOS(state, usuarios){
            state.usuarios = usuarios;
        },
    },
    actions:{
        async getUsuarios(context){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/getUsuarios`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_USUARIOS', res.data);
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },

        async postUsuario(context, u){
            let usuario = {
                run: parseInt(u.run),
                rolid: u.rol.id,
                unidadcodigo: u.unidad.codigo,
                estado: parseInt(u.estado),
            }
            return axios.post(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/postUsuario`, usuario, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                return res;
            }).catch((error) => {
                return error.response;
            });
        },

        async putUsuario(context, u){
            let usuario = {
                run: parseInt(u.run),
                rolid: u.rol.id,
                unidadcodigo: u.unidad.codigo,
                estado: parseInt(u.estado),
            }
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/putUsuario`, usuario, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                return res;
            }).catch((error) => {
                return error;
            });
        },

        async getRoles(context) {
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/getRoles`, {
                headers: {
                Authorization: `bearer ${context.rootState.token}`,
                },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
        },

        async getUnidades(context) {
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/getUnidades`, {
                headers: {
                    Authorization: `bearer ${context.rootState.token}`,
                },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
        },

        async getPersona(context, run){
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios/getPersona/${run}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        usuarios(state) {
            return state.usuarios;
        },
    }
}