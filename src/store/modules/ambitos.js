import axios from 'axios';

export default {
    namespaced: true,
    state: {
        tiposAmbitos: [],
        loading: false,
    },
    mutations: {
        GETTING_DATA(state) {
            state.loading = true;
        },
        END_GETTING_DATA(state) {
            state.loading = false;
        },
        ADD_TIPO_AMBITOS(state, tiposAmbitos) {
            state.tiposAmbitos = tiposAmbitos;
        },
    },
    actions: {
        async fetchtiposAmbitos(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Ambitos/GetTiposAmbitos/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    context.commit('ADD_TIPO_AMBITOS', res.data);
                }
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
        tiposAmbitos(state) {
            return state.tiposAmbitos;
        },
    }
};
