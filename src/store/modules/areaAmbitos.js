import axios from 'axios'

export default{
    namespaced: true,
    state: {
        tiposAreasAmbitos:[],
        loading:[],
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_TIPO_AREA_AMBITOS(state, tiposAreasAmbitos){
            state.tiposAreasAmbitos = tiposAreasAmbitos;
        },
    },
    actions:{
        async fetchtiposAreasAmbitos(context){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/AreaAmbitos/GetTipoAreaAmbitos/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    context.commit('ADD_TIPO_AREA_AMBITOS', res.data);
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
        tiposAreasAmbitos(state){
            return state.tiposAreasAmbitos;
        },
    }
}