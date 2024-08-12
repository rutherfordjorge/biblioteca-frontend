import axios from 'axios';
const url = `${process.env.VUE_APP_BASE_URL_API}/colecciones`

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
        async getColecciones(context, conocimientoId){
            context.commit('GETTING_DATA');
            return axios.get(`${url}/getColecciones/${conocimientoId}`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch(error => {
                context.commit('END_GETTING_DATA');
                console.log('Se produjo un error al cargar las colecciones');
                return error.response;
            })
        },

        async postColeccion(context, payload){
            
            return axios.post(`${url}/PostColeccion`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => res)
            .catch(error => {
                console.log('Se produjo un error al crear la colección.');
                return error.response;
            })
        },

        async putColeccion(context, payload) {
            return axios.put(`${url}/PutColeccion`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {                
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al actualizar la colección.');
                return error.response;
            })
        },

        async deleteColeccion(context, id){
            
            return axios.delete(`${url}/deleteColeccion/${id}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => res)
            .catch(error => {
                console.log('Se produjo un error al eliminar la colección.');
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