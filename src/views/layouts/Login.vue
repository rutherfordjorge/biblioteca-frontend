<template>
    <v-app>
        <v-main>
            <router-view/>
        </v-main>        
    </v-app>
</template>


<script>

    export default {
        components:{},
        methods: {
            removeListenerCheck() {
                //console.log('Listener Revisado');
            },
        },
        mounted() {
            //document.removeEventListener('mousemove', this.removeListenerCheck());
            //document.removeEventListener('keypress', this.removeListenerCheck());
        },
    }
</script>

<style scoped>
    .theme--light.v-application {
        background: url('/fondo1.svg');
        background-size: cover;
        
    }
</style>