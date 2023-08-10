import axios from 'axios';

export default {
    namespaced: true,
    state:{
        documentos: [],
        tiposDocumentos:[],
        sugerencias: [],
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_SUGERENCIAS(state, sugerencias){
            state.sugerencias = sugerencias;
        },
        ADD_DOCUMENTOS(state, documentos){
            state.documentos = documentos;
        },
        ADD_TIPO_DOCUMENTOS(state, tiposDocumentos){
            state.tiposDocumentos = tiposDocumentos;
        },
        DELETE_DOCUMENTOS(state){
            state.documentos = [];
        },
    },
    actions:{

        async fetchSugerencia(context, param) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Sugerencias/getSugerencia/${param}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_SUGERENCIAS', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },

        async fetchSugerencias(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Sugerencias/getSugerencias/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_SUGERENCIAS', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },

        async postSugerencia(context, sugerencia){
            return axios.post(`${process.env.VUE_APP_BASE_URL_API}/Sugerencias/postIngresoSugerencia`, sugerencia, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    return res;
            }
            }).catch((error) => {
                return error;
            });
        },

        async putSugerencia(context, sugerencia){
            return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Sugerencias/putEditarSugerencias`, sugerencia, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    return res.data;
                }
            }).catch((error) => {
                return error;
            });
        },
        async fetchCountDocumentos(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getCountDocumentos`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error.response;
            })
        },
        async fetchDocumentosTipo(context, params) {
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getDocumentosTipo/${params.tipoId}/${params.page}/${params.busqueda}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                return res;
            })
            .catch((error) => {
                return error.response;
            })
        },
        async fetchDocumentos(context, params) {
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getDocumentos/${params.page}/${params.busqueda}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                return res;
            })
            .catch((error) => {
                return error.response;
            })
        },
        async fetchDocumentosBorrados(context, params) {
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getDocumentosBorrados/${params.page}/${params.busqueda}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                return res;
            })
            .catch((error) => {
                return error.response;
            })
        },
        async fetchTipoDocumento(context, param) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getTipoDocumento/${param}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    return res;
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },
        async fetchTiposDocumentos(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getTiposDocumentos/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    context.commit('ADD_TIPO_DOCUMENTOS', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },
        async postDocumento(context, documento){
            return axios.post(`${process.env.VUE_APP_BASE_URL_API}/Documentos/postIngresoDocumento`, documento, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    return res;
            }
            }).catch((error) => {
                return error;
            });
        },
        async putDocumento(context, documento){
            // console.log(documento);
            return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Documentos/putEditarDocumento`, documento, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                return res;
            }).catch((error) => {
                return error.response;
            });
        },
        async putActivaDocumento(context, param) {
            return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Documentos/putActivaDocumento/`, {id:param}, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    return res;
                }
                return res;
            })
            .catch((error) => {
                return error;
            })
        },
        async putBloquearDocumento(context, param) {
            return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Documentos/putBloquearDocumento/`, {id:param}, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    return res;
                }
                return res;
            })
            .catch((error) => {
                return error;
            })
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        documentos(state) {
            return state.documentos;
        },
        tiposDocumentos(state) {
            return state.tiposDocumentos;
        },
    }
}