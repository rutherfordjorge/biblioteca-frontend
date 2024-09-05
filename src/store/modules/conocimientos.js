import axios from 'axios';

export default {
    namespaced: true,
    state:{
        conocimiento: null,
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
    },
    actions:{

        async getConocimiento(context) {
            context.commit('GETTING_DATA')
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/getConocimiento`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                context.commit('END_GETTING_DATA')
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA')
                return error.response;
            })
        },

        async getConocimientoById(context, conocimientoId) {
            context.commit('GETTING_DATA')
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/getConocimiento/${conocimientoId}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                context.commit('END_GETTING_DATA')
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA')
                return error.response;
            })
        },

        async postConocimiento(context, model){
            return axios.post(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/postConocimiento`, model, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                if (res.status == 200) {
                    return res;
                }
            })
            .catch(error => {
                return error.response;
            });
        },

        // NEW
        async putConocimiento(context, model) {
                return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/putConocimiento/`, model, {
                    headers: {
                        "Authorization": `bearer ${context.rootState.token}`
                    }
                })
                .then(res => {
                    if (res.status == 200) {
                        return res;
                    }
                })
                .catch(error => {
                    return error.response;
                });
        },

        async putOrdenConocimiento(context, model){
            return axios.put(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/putOrdenConocimiento`, model, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                if (res.status == 200) {
                    return res;
                }
            })
            .catch(error => {
                return error.response;
            });
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        conocimiento(state) {
            return state.conocimiento;
        },
    }
}