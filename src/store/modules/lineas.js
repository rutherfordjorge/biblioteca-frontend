import axios from 'axios';

export default{
    namespaced: true,
    state: {
        tiposLineas:[],
        loading:[],
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_TIPO_LINEAS(state, tiposLineas){
            state.tiposLineas = tiposLineas;
        },
    },
    actions:{
        async fetchtiposLineas(context){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Lineas/GetTiposLineas/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    context.commit('ADD_TIPO_LINEAS', res.data);
                }
                context.commit('END_GETTING_DATA');
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
        tiposLineas(state) {
            return state.tiposLineas;
        },
    }
}
