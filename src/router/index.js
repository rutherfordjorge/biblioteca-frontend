import Vue from 'vue'
import VueRouter from 'vue-router'
//STORE
import store from "@/store/index";

import LoginLayout from '@/layouts/Login';
import MainLayout from '@/layouts/Main.vue'

import Login from '@/views/Login.vue'
import Inicio from '@/views/Inicio.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "login",
		component: Login,
		meta: {
			requiresAuth: false,
			whoCan: [0],
			layout: LoginLayout
		}
	},
	{
		path: "/inicio",
		name: "inicio",
		component: Inicio,
		meta: {
			requiresAuth: true,
			whoCan: [0, 161, 221, 222, 223, 501, 502],
			layout: MainLayout
		}
	},
    {
        path: "/inicio/:id",
        name: "archivos",
        component: () => import( /*webpackChunkName:"archivos"*/ "@/views/Archivos.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0, 161, 221, 222, 223, 501, 502],
            layout: MainLayout
        }
    },
	{
		path: "/usuarios",
		name: "usuarios",
		component: () => import( /*webpackChunkName:"usuarios"*/ "@/views/base/Usuarios.vue"),
		meta: {
			requiresAuth: true,
			whoCan: [161],
			layout: MainLayout
		}
	},
    {
        path: "/conocimiento",
        name: "conocimiento",
        component: () => import(/* webpackChunckName: "fuentes conocimiento" */ "@/views/Mantenedores/FuentesConocimiento.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161],
            layout: MainLayout
        }
    },
    // AUDITRÍA Y ESTADÍSTICAS
    
    {
        path: "/inicio/:id/auditoria",
        name: "auditoria",
        component: () => import( /*webpackChunkName:"auditoria"*/ "@/views/auditorias/Auditoria.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/auditoria/usuarios",
        name: "auditoria-usuarios",
        component: () => import( /*webpackChunkName:"auditoria-usuarios"*/ "@/views/auditorias/AuditoriaUsuarios.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/auditoria/visualizaciones",
        name: "auditoria-visualizaciones",
        component: () => import( /*webpackChunkName:"auditoria-visualizaciones"*/ "@/views/auditorias/AuditoriaVisualizaciones.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/estadistica",
        name: "estadistica",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/auditorias/Estadistica.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/estadistica/visualizaciones",
        name: "estadistica-visualizaciones",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/auditorias/EstadisticaVisualizaciones.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/estadistica/usuarios",
        name: "estadistica-usuarios",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/auditorias/EstadisticaUsuarios.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/estadistica/textos",
        name: "estadistica-textos",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/auditorias/EstadisticaTextos.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/:id/estadistica/accesos",
        name: "estadistica-accesos",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/auditorias/EstadisticaAccesos.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    // CONTROL DE NAVEGACIÓN
    {
        // cualquier ruta que no esté registrada te devuelve al login.
        path: '/:pathMatch(.*)*',
        redirect: () => ({ name: 'login' }) 
    },
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
    const whoCan = to.meta.whoCan;
    const currentUser = store.state.currentUser;
    
    if(to.meta.requiresAuth){
        if(currentUser) {
            if(whoCan.includes(parseInt(currentUser.Rol))) {
                //Tiene acceso a la vista
                return next()
            }
            else {
                //No tiene acceso
                return next({ name: 'login' })
            }
        }
        else {
            //Si no está logeado, expulsa al login.
            return next({ name: 'login' })
        }
    }
    else {
        //Si no requiere autenticación, continúa.
        return next()
    }
})

export default router