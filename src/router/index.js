import Vue from "vue";
import VueRouter from "vue-router";
//LAYOUTS
import LoginLayout from '@/views/layouts/Login';
import MainLayout from '@/views/layouts/Main';
//STORE
import store from "@/store/index";


Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import( /*webpackChunkName:"login"*/ "@/views/Login.vue"),
        meta: {
            requiresAuth: false,
            whoCan: [0],
            layout: LoginLayout
        }
    },
    {
        path: "/usuarios",
        name: "usuarios",
        component: () => import( /*webpackChunkName:"usuarios"*/ "@/views/Usuarios.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/auditoria",
        name: "auditoria",
        component: () => import( /*webpackChunkName:"auditoria"*/ "@/views/Auditoria.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/estadistica",
        name: "estadistica",
        component: () => import( /*webpackChunkName:"estadistica"*/ "@/views/Estadistica.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [161,221],
            layout: MainLayout
        }
    },
    {
        path: "/inicio",
        name: "inicio",
        component: () => import(/* webpackChunckName: "Inicio" */ "@/views/Inicio.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0, 161, 221, 222, 223],
            layout: MainLayout
        }
    },
    {
        path: "/conocimiento",
        name: "conocimiento",
        component: () => import(/* webpackChunckName: "fuentes conocimiento" */ "@/views/Mantenedores/FuentesConocimiento.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0, 161, 221, 222, 223],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/doctrina",
        name: "biblioteca",
        component: () => import(/* webpackChunckName: "biblioteca" */ "@/views/Biblioteca.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0, 161, 221, 222, 223],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/doctrina/:id/Lista",
        name: "lista-doctrina",
        component: () => import(/* webpackChunckName: "lista-doctrina" */ "@/views/ListaBiblioteca.vue"),
        props: true,
        meta: {
            requiresAuth: true,
            whoCan: [0,161,221,222,223],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/procedimientos",
        name: "procedimientos",
        component: () => import(/* webpackChunckName: "procedimientos" */ "@/views/Procedimientos.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0,161,221,222,223],
            layout: MainLayout
        },
    },
    {
        path: "/inicio/procedimientos/:id/Lista",
        name: "lista-procedimientos",
        component: () => import(/* webpackChunckName: "lista-procedimientos" */ "@/views/ListaProcedimientos.vue"),
        props: true,
        meta: {
            requiresAuth: true,
            whoCan: [0,161,221,222,223],
            layout: MainLayout
        }
    },
    {
        path: "/inicio/conocimientos",
        name: "conocimientos",
        component: () => import(/* webpackChunckName: "conocimientos" */ "@/views/Conocimientos.vue"),
        meta: {
            requiresAuth: true,
            whoCan: [0,161,221,222,223],
            layout: MainLayout
        },
    },
    {
        path: "/inicio/conocimiento/:id/Lista",
        name: "lista-conocimientos",
        component: () => import(/* webpackChunckName: "lista-conocimientos" */ "@/views/ListaConocimiento.vue"),
        props: true,
        meta: {
            requiresAuth: true,
            whoCan: [0,161,221,222,223],
            layout: MainLayout
        }
    },
    {
        path: "/404",
        name: "404",
        component: () => import(/* webpackChunckName: "NotFound" */ "@/views/NotFound.vue"),
        meta: {
            requiresAuth: false,
            whoCan: [],
            layout: MainLayout,
        },
    },
    { path: '/:pathMatch(.*)*', redirect: () => ({ name: '404' }) }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    //console.log(to);
    const whoCan = to.meta.whoCan;
    const currentUser = store.state.currentUser;

    if(to.meta.requiresAuth){
        if(currentUser) {
            if(whoCan.includes(parseInt(currentUser.Rol))) {
                //Tiene acceso a la vista
                return next();
            }
            else {
                //No tiene acceso
                return next({path: '/404'});
            }
        }
        else {
            //Si no está logeado, expulsa al login.
            return next({path: '/'});
        }
    }
    else {
        //Si no requiere autenticación, continúa.
        return next();
    }

});

export default router;
