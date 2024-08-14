import axios from 'axios';
const url = `${process.env.VUE_APP_BASE_URL_API}/logArchivos`

export default {
    namespaced: true,
    state:{
        loading: false,
    },
    mutations:{
        GETTING_DATA(state) {
            state.loading = true;
        },
        END_GETTING_DATA(state) {
            state.loading = false;
        },
    },
    actions:{
        async postLogArchivo(context, payload){
            
            return axios.post(`${url}/postLogArchivo`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => res)
            .catch(error => {
                console.log('Se produjo un error al registrar el log.');
                return error.response;
            })
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
    }
}