import axios from 'axios';

export default {
    namespaced: true,
    state: {
        archivos: [],
        loading: false,
    },
    mutations: {
        GETTING_DATA(state) {
            state.loading = true;
        },
        END_GETTING_DATA(state) {
            state.loading = false;
        },
        ADD_ARCHIVO(state, archivos) {
            state.archivos = archivos;
        },
        DELETE_ARCHIVO(state) {
            state.archivos = [];
        },
    },
    actions: {
        async fetchCountArchivo(context, id) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/getCountArchivo/${id}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_ARCHIVO', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
                .catch((error) => {
                    context.commit('END_GETTING_DATA');
                    return error;
                })
        },
        async fetchArchivoBloque(context, param) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/getArchivo/${param.id}/${param.bloque}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_ARCHIVO', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
                .catch((error) => {
                    context.commit('END_GETTING_DATA');
                    return error;
                })
        },

        async fetchArchivo(context, param) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/getArchivoSinBase64/${param.id}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_ARCHIVO', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
                .catch((error) => {
                    context.commit('END_GETTING_DATA');
                    return error;
                })
        },

        async fetchArchivosOrigen(context, param) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/getArchivosOrigen/${param.id}/${param.tipo}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_ARCHIVO', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
                .catch((error) => {
                    context.commit('END_GETTING_DATA');
                    return error;
                })
        },

        async postArchivo(context, archivo) {

            return axios.post(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/postIngresoArchivo`, archivo, {
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

        async putBase64Archivo(context, archivo) {
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/putBase64Archivo`, archivo, {
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

        async putArchivo(context, archivo) {
            // console.log(archivo);
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/putEditarArchivo`, archivo, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
                .then((res) => {
                    if (res.status == 200) {
                        return res;
                    }
                }).catch((error) => {
                    // console.log(error);
                    return error;
                });
        },
        async putActivaArchivo(context, param) {
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/putActivaArchivo/`, {id:param}, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    //context.commit('ADD_TIPO_DOCUMENTOS', res.data);
                }
                return res;
            })
            .catch((error) => {
                return error;
            })
        },
        async putBloquearArchivo(context, param) {
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/putBloquearArchivo/`, {id:param}, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    //context.commit('ADD_TIPO_DOCUMENTOS', res.data);
                }
                return res;
            })
            .catch((error) => {
                return error;
            })
        },
        async putCleanBase64Archivo(context, param) {
            return axios.put(`${process.env.VUE_APP_APIGATEWAY_URL}/Archivos/putCleanBase64Archivo/`, {id:param}, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    //context.commit('ADD_TIPO_DOCUMENTOS', res.data);
                }
                return res;
            })
            .catch((error) => {
                return error;
            })
        },
    },
    getters: {
        isLoading(state) {
            return state.loading;
        },
        archivos(state) {
            return state.archivos;
        },
    }
}