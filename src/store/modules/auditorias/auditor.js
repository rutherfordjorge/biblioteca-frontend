import axios from 'axios';

export default {
    namespaced: true,
    state: {
        listaAuditoria: [],
        loading: false,
        contarTipoyClasificacion: {},
        contarUsuarios: {},
        contarTipoID: {},
        contarVisitas: {},
    },
    mutations: {
        GETTING_DATA(state) {
            state.loading = true;
        },
        END_GETTING_DATA(state) {
            state.loading = false;
        },
        ADD_LISTA_AUDITORIA(state, listaAuditoria) {
            state.listaAuditoria = listaAuditoria;
        },
        ADD_COUNT_BY_TIPOID_AND_CLASIFICACION(state, data){
            state.contarTipoyClasificacion = data;
        },
        ADD_USUARIO_COUNT(state, data) { 
            state.contarUsuarios = data;
        },
        ADD_USUARIO_TIPOID(state, data) {
            state.contarTipoID = data;
        },
        ADD_VISITAS_COUNT(state, data) {
            state.contarVisitas = data;
        }
    },
    actions: {
        async getAuditor(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/AuditorDocumentos/getAuditor`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_LISTA_AUDITORIA', res.data);
                context.commit('END_GETTING_DATA');
                console.log(res);
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            });
        },
        async contarTipoyClasificacion(context) { //ESTADISTICAS DE TEXTOS
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/EstadisticaDocumentos/getCountByTipoIdAndClasificacion`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_COUNT_BY_TIPOID_AND_CLASIFICACION', res.data);
                context.commit('END_GETTING_DATA');
                console.log(res)
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            });
        },
        async contarUsuarios(context) { //ESTADISTICAS DE ACCESOS
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/EstadisticaDocumentos/getCountUsuarios`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_USUARIO_COUNT', res.data);
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            });
        },
        async contarTipoID(context) { //ESTADISTICAS DE VISUALIZACIONES
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/EstadisticaDocumentos/getUsuarioTipoID`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_USUARIO_TIPOID', res.data);
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            });
        },
        async contarVisitas(context) { //ESTADISTICAS DE USUARIOS CHECK !!
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/EstadisticaDocumentos/getFechaVisitas`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                context.commit('ADD_VISITAS_COUNT', res.data);
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            });
        },
        
    },
    getters: {
        isLoading(state) {
            return state.loading;
        },
        listaAuditoria(state) { //ANDANDO
            return state.listaAuditoria;
        },
        contarTipoyClasificacion(state){ // ANDANDO
            return state.contarTipoyClasificacion;
        },
        contarUsuarios(state) { // ANDANDO
            return state.contarUsuarios;
        },
        contarTipoID(state) { // ANDANDO
            return state.contarTipoID;
        },
        contarVisitas(state) { // TRABAJANDO
            return state.contarVisitas;
        },
    }
}