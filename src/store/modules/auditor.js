import axios from 'axios';

export default {
    namespaced: true,
    state:{
        listaAuditoria: [],
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_LISTA_AUDITORIA(state, listaAuditoria){
            state.listaAuditoria = listaAuditoria;
        },
    },
    actions:{
        async getAuditoria(context){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Auditores/getIPUsuario`,{
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
            })
        },

    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        listaAuditoria(state) {
            return state.listaAuditoria;
        },
    }
}