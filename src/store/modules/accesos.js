import axios from 'axios';
const url = `${process.env.VUE_APP_BASE_URL_API}/accesos`

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
        async getAccesos(context, conocimientoId){
            context.commit('GETTING_DATA');
            return axios.get(`${url}/getAccesos/${conocimientoId}`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA');
                console.log('Se produjo un error al traer los datos');
                return error.response;
            })
        },
        
        async getTipoAccesos(context){
            context.commit('GETTING_DATA');
            return axios.get(`${url}/GetTipoAccesos`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA');
                console.log('Se produjo un error al traer los datos');
                return error.response;
            })
        },

        async postAcceso(context, payload){
            
            return axios.post(`${url}/postAcceso`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => res)
            .catch(error => {
                console.log('Se produjo un error al crear el acceso.');
                return error.response;
            })
        },

        async deleteAcceso(context, id){
            
            return axios.delete(`${url}/DeleteAcceso/${id}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => res)
            .catch(error => {
                console.log('Se produjo un error al eliminar el acceso.');
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