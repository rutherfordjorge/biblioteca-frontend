import axios from 'axios';

export default {
    namespaced: true,
    state:{
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
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Conocimientos/getConocimiento`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then(res => {
                context.commit('END_GETTING_DATA');
                console.log(res);
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA');
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
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
    }
}