import axios from 'axios'
const url = `${process.env.VUE_APP_APIGATEWAY_URL}/Usuarios`

export default {
    namespaced: true,
    state:{
        usuarios: [],
        pages: 1,
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
        ADD_PAGINAS(state, pages) {
            state.pages = pages;
        },
    },
    actions:{
        async getUsuarios(context, { page = '', items = '', search = '', unidadCodigo = '', adminLess = '', deletedLess = '' } = {}){
            context.commit('GETTING_DATA');
            return axios.get(`${url}/getUsuariosPaginado?page=${ page }&items=${ items }&search=${ search }&unidadCodigo=${ unidadCodigo }&adminLess=${ adminLess }&deletedLess=${ deletedLess }`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('ADD_USUARIOS', res.data.respuesta);
                    context.commit('ADD_PAGINAS', Math.ceil(res.data.totalRegistros/parseInt(items == '' ? res.data.totalRegistros : items)));
                    context.commit('END_GETTING_DATA');
                return res.data.respuesta;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA');
                return error.response;
            })
        },

        async postUsuario(context, u){
            let usuario = {
                run: parseInt(u.run),
                rolid: u.rol.id,
                unidadcodigo: u.unidad.codigo,
                estado: parseInt(u.estado),
            }
            return axios.post(`${url}/postUsuario`, usuario, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                return res;
            }).catch(error => {
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
            return axios.put(`${url}/putUsuario`, usuario, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                return res;
            }).catch(error => {
                return error.response;
            });
        },

        async getRoles(context) {
            return axios.get(`${url}/getRoles`, {
                headers: {
                Authorization: `bearer ${context.rootState.token}`,
                },
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error.response;
            });
        },

        async getUnidades(context) {
            return axios.get(`${url}/getUnidades`, {
                headers: {
                    Authorization: `bearer ${context.rootState.token}`,
                },
            })
            .then(response => {
                return response;
            })
            .catch(error => {
                return error.response;
            });
        },

        async getPersona(context, run){
            return axios.get(`${url}/getPersona/${run}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error.response;
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
        pages(state) {
            return state.pages;
        },
    }
}