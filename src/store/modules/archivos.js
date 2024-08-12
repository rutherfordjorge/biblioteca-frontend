import axios from 'axios';
const url = `${process.env.VUE_APP_BASE_URL_API}/archivos`

export default {
    namespaced: true,
    state:{
        archivos: [],
        pages: 1,
        loading: false,
    },
    mutations:{
        GETTING_DATA(state) {
            state.loading = true;
        },
        END_GETTING_DATA(state) {
            state.loading = false;
        },
        ADD_ARCHIVOS(state, archivos) {
            state.archivos = archivos;
        },
        ADD_PAGINAS(state, pages) {
            state.pages = pages;
        },
        DELETE_ARCHIVOS(state) {
            state.archivos = [];
        },
    },
    actions:{
        async getArchivos(context, { page = '', items = '', search = '', conocimientoId = '', store = true} = {}){
            console.log('getArchivos')
            if (store) {
                context.commit('DELETE_ARCHIVOS');
                context.commit('GETTING_DATA');
            }
            return axios.get(`${url}/getArchivos?page=${ page }&items=${ items }&search=${ search }&conocimientoId=${ conocimientoId }`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                console.log('get archivos:', res.data.respuesta);
                if (store) {
                    context.commit('ADD_ARCHIVOS', res.data.respuesta);
                    context.commit('ADD_PAGINAS', Math.ceil(res.data.totalRegistros/parseInt(items == '' ? res.data.totalRegistros : items)));
                    context.commit('END_GETTING_DATA');
                }
                return res;
            })
            .catch(error => {
                if (store) {
                    context.commit('END_GETTING_DATA');
                }
                console.log('Se produjo un error al cargar el listado');
                return error.response;
            })
        },

        async getClasificacion(context){
            
            return axios.get(`${url}/getClasificacion`,{
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al cargar el listado');
                return error.response;
            })
        },

        async putArchivosArchivoId(context, payload){
            
            return axios.put(`${url}/PutArchivosArchivoId`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al cargar el listado de archivos.');
                return error.response;
            })
        },

        async postArchivo(context, payload){
            context.commit('GETTING_DATA');
            return axios.post(`${url}/PostArchivo`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                context.commit('END_GETTING_DATA');
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al crear el documento.');
                context.commit('END_GETTING_DATA');
                return error.response;
            })
        },

        async putArchivo(context, payload){
            
            // console.log(payload, payload.id)

            return axios.put(`${url}/PutArchivo/${payload.id}`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al editar el documento.');
                return error.response;
            })
        },
        
        async putArchivar(context, payload){

            console.log('archivar', payload)
            
            return axios.put(`${url}/putArchivar`, payload, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al archivar el documento.');
                return error.response;
            })
        },

        async deleteArchivo(context, id){
            
            return axios.delete(`${url}/DeleteArchivo/${id}`, {
                headers: {
                    "Authorization": `bearer ${context.rootState.token}`
                }
            }).then(res => {
                return res;
            })
            .catch(error => {
                console.log('Se produjo un error al editar el documento.');
                return error.response;
            })
        },
    },
    getters:{
        isLoading(state) {
            return state.loading;
        },
        archivos(state) {
            return state.archivos;
        },
        pages(state) {
            return state.pages;
        },
    }
}