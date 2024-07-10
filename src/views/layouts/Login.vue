<template>
    <v-app>
        <v-main>
            <router-view/>
        </v-main>  
		<!-- <Footer />       -->
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
        background: #f0f0f0;
    }
    .v-main {
        height: 90vh !important;
    }
</style>