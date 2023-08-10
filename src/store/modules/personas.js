import axios from 'axios';
//import router from '@/router'

export default {
    namespaced: true,
    state:{
        personas: [],
        persona: [],
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
        ADD_PERSONA(state, persona){
            state.persona = persona;
        },
    },
    actions:{

        async fetchPersonasUnidad(context,codigo){
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/personas/getPersonasUnidad?codigo=${codigo}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_PERSONAS', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },
        
        async fetchPersonaRun(context, run){
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Personas/getPersonasRun?run=${run}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                if (res.data != null) {
                    context.commit('ADD_PERSONA', res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                return error;
            })
        },

    },
    getters:{
        isLoading(state){
            return state.loading;
        },
        personas(state){
            return state.personas;
        },
        persona(state){
            return state.persona;
        },
    }
}