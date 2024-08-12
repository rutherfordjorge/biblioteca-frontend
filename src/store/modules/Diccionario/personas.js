import axios from 'axios';

export default {
    namespaced: true,
    state:{
        personas: [],
        pages: 0,
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_PERSONAS(state, personas){
            state.personas = personas;
        },
        ADD_PAGES(state, pages){
            state.pages = pages;
        },
    },
    actions:{
        async getPersonas(context, { page = '', items = '', run = '', unidadCodigo = '', search = '' } = {}){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_APIGATEWAY_URL}/diccionario/getPersonas?page=${page}&items=${items}&run=${run}&unidadCodigo=${unidadCodigo}&search=${search}`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('ADD_PERSONAS', res.data.respuesta);
                context.commit('ADD_PAGES', res.data.pageCount);
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al cargar el listado de personas');
                context.commit('END_GETTING_DATA');
                return error.response;
            })
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        personas(state) {
            return state.personas;
        },
        
        pages(state) {
            return state.pages;
        },
    }
}