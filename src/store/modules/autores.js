import axios from 'axios';

export default {
    namespaced: true,
    state:{
        autores: [],
        loading: false,
    },
    mutations:{
        GETTING_DATA(state){
            state.loading = true;
        },
        END_GETTING_DATA(state){
            state.loading = false;
        },
        ADD_AUTORES(state, autor){
            state.autores.push(autor)
        },
        CLEAN_AUTORES(state){
            state.autores = [];
        }
    },
    actions: {

        addAutor(context,autor){
            context.commit('ADD_AUTORES',autor);
        },
        cleanAutor(context){
            context.commit('CLEAN_AUTORES');
        },

        async fetchAutores(context) {
            context.commit('GETTING_DATA');
            return axios.get(`${process.env.VUE_APP_BASE_URL_API}/Documentos/getTiposDocumentos/`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then((res) => {
                // console.log(res);
                if (res.data != null) {
                    context.commit('ADD_AUTORES',res.data);
                }
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch((error) => {
                context.commit('END_GETTING_DATA');
                return error;
            })
        },


        async postAutor(context, autor){
            return axios.post(`${process.env.VUE_APP_BASE_URL_API}/Autores/postIngresoAutor`, autor, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    return res;
            }
            }).catch((error) => {
                return error;
            });
        },
    },
    getters: {
        isLoading(state) {
            return state.loading;
          },
          autores(state){
            return state.autores;
          }
    }
}