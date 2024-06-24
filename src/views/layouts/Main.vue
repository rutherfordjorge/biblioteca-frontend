<template>
    <div>
        <v-app id="inspire">
            <v-navigation-drawer permanent expand-on-hover v-if="drawerLeft" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <v-list dense>
                    <template v-for="item in items">
                        <v-row v-if="item.heading" :key="item.id">
                            <v-col cols="6">
                                <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
                            </v-col>
                            <v-col cols="6" class="text-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-col>            
                        </v-row>
                        <!-- Link con sub menú -->
                        <v-list-group
                            v-else-if="item.children.length > 0 && item.rol.includes(parseInt(currentUser.Rol))"
                            :key="item.text"
                            :prepend-icon="item.icon"
                            :value="false">
                            
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item v-for="child in item.children" :key="child.id" :to="child.route" class="paddingCustom">
                                <v-list-item-action v-if="child.icon">
                                    <v-icon small class="ml-3">{{ child.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>{{ child.text }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                        <!-- Link Normal -->
                        <v-list-item v-else-if="item.rol.includes(parseInt(currentUser.Rol))" :key="item.text" :to="item.route">
                            <v-list-item-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list>
            </v-navigation-drawer>
            <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" short flat app color="primaryBanner" dark>
                <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
                <v-img
                    src="/bibliotecaLogo.svg"
                    max-height="50"
                    max-width="50"
                    contain
                ></v-img>
                <v-toolbar-title class="ml-0 pl-4">
                    <span class="hidden-md-and-up">Biblioteca Virtual</span>
                    <span class="hidden-sm-and-down">Biblioteca Virtual del Ejército</span>
                </v-toolbar-title>
                <v-spacer />
                <v-btn 
                    class="hidden-sm-and-down" 
                    icon 
                    @click="dialogInstructivo=!dialogInstructivo"
                    title="Instructivo"
                >
                    <v-icon>
                        mdi-help-circle
                    </v-icon>
                </v-btn>
                <v-chip 
                    class="hidden-sm-and-down"
                    @click="logout(null)"
                    title="Cerrar Sesión"
                >
                    {{ currentUser.Nombres }}
                    <v-icon small class="ml-2">
                        mdi-logout
                    </v-icon>
                </v-chip>

                <v-menu bottom origin="center center" transition="scale-transition" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn class="hidden-md-and-up" icon v-on="on">
                            <v-icon>
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title><b>{{currentUser.Nombres}}</b></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item @click="dialogInstructivo=!dialogInstructivo">
                            Instructivo
                            <v-spacer />
                            <v-icon class="mr-2">
                                mdi-help-circle
                            </v-icon>
                        </v-list-item>
                        <v-list-item @click="logout(null)">
                            Cerrar Sesión
                            <v-spacer />
                            <v-icon class="mr-2">
                                mdi-logout
                            </v-icon>
                        </v-list-item>
                    </v-list>
                </v-menu>      
            </v-app-bar>
            <v-main :class="drawerLeft ? 'v-main' : 'v-main-no-menu'">
                <router-view></router-view>
            </v-main>
        </v-app>

        <v-layout row justify-center>
            
            <v-dialog v-model="dialogExtendSesion" persistent max-width="500px">
            <v-card>
                <v-card-title>
                <countdown v-if="dialogExtendSesion" ref="countdown2" :end-time="new Date().getTime() + (1000 * 60 * 1)" @finish="enviarALogin('Sesión expirada por inactividad.')">
                    <template v-slot:process="{ timeObj }">
                    <span>{{ `${timeObj.m}:${timeObj.s}` }}</span>
                    </template>
                </countdown>
                </v-card-title>
                <v-card-text>
                <h3>Su sesión está a punto de expirar, desea continuar?</h3>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="danger" @click.native="enviarALogin('Sesión cerrada por el Usuario.')">Cerrar sesión</v-btn>
                <v-btn depressed color="success" @click.native="extenderSesion">Continuar</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

            <v-dialog v-model="dialogInstructivo" width="90vw" heigt="80vh">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text>
                <embed src="/biblioteca_virtual.pdf" type="" frameborder="0" width="100%" height="600px">
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="secondary" @click="dialogInstructivo=!dialogInstructivo">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        source: String,
    },
    data: () => ({
        dialog: false,
        dialogCarpro: false,
        dialogInstructivo: false,
        drawer: null,
        items: [
            {
                icon:"mdi-home",
                iconAlt: null,
                id: 1,
                model: "false",
                padre: 4,
                route: { name: 'inicio' },
                text: "Inicio",
                rol: [0, 161, 221, 222, 223],
                children: []
            },
            {
                icon:"mdi-settings",
                iconAlt: "mdi-settings",
                id: 2,
                model: "false",
                padre: 4,
                route: "",
                text: "Configuración",
                rol: [161, 221],
                children: [
                    {
                        id: 1,
                        route: '/usuarios',
                        icon: 'mdi-account-multiple',
                        text: 'Usuarios',
                    },
                    {
                        id: 2,
                        route: '/auditoria',
                        icon: 'mdi-comment-eye',
                        text: 'Auditoria',
                    },
                    {
                        id: 3,
                        route: '/estadistica',
                        icon: 'mdi-chart-bar',
                        text: 'Estadisticas',
                    },
                    {
                        id: 4,
                        route: '/conocimiento',
                        icon: 'mdi-chart-bar',
                        text: 'Fuentes Conocimiento',
                    },
                ]
            },
        ],
        dialogExtendSesion: false,
        countdown: null,
        sesionTime: null,
        sesionRefresh: null,
    }),
    
    computed: {
        ...mapGetters(['currentUser','drawerLeft']),
    },

    mounted() {
        document.addEventListener('mousemove', this.keepLogged);//"escucha" cuando se mueve el puntero del mouse para mantener la sesión activa
        document.addEventListener('keypress', this.keepLogged);//"escucha" cuando se presiona una tecla del teclado para mantener la sesión activa
        
        this.Refresh();//inicializando refresh del token
        this.keepLogged();//inicializando la evaluación de actividad del usuario
    },

    unmounted() {
        document.removeEventListener('mousemove', this.keepLogged);
        document.removeEventListener('keypress', this.keepLogged);
    },

    methods:{
        ...mapActions(["logout", "refreshToken"]),
        
        enviarALogin(mensaje){
            clearTimeout(this.sesionRefresh);
            clearTimeout(this.sesionTime);

            this.dialogExtendSesion = false;
            this.logout(mensaje);
        },
        
        extenderSesion(){
            this.refreshToken().then(() => {
                this.Refresh();
                this.keepLogged();

                this.dialogExtendSesion = false;
            });
        },
        
        Refresh() {
            if(this.currentUser) {
                clearTimeout(this.sesionRefresh);
                this.sesionRefresh = setTimeout(() => {
                    this.refreshToken();
                    this.Refresh();
                }, 1000 * 60 * 5);//en 5 minutos refresca la sesión
            }
        },

        keepLogged() {
            if(this.currentUser) {
                clearTimeout(this.sesionTime);
                this.sesionTime = setTimeout(() => {
                    this.dialogExtendSesion = true;
                }, 1000 * 60 * 9);//en 15 minutos levanta modal para controlar la actividad
            }
        },
    }
};
</script>
<style scoped>
    .v-list-group__items .v-list-group__items, .v-list-group__items .v-list-item {
        overflow: hidden;
        padding-left: 40px;
    }

    .paddingCustom {
        padding: 0 16px !important;
    }

    .v-main {
        padding: 56px 0px 0px 70px !important;
    }

    .v-main-no-menu {
        padding: 56px 0px 0px 0px !important;
    }
</style>
