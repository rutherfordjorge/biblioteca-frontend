<template>
    <v-app>
        <v-main>
            <router-view/>
        </v-main>  
		<Footer />      
    </v-app>
</template>

<script>
import Footer from '@/components/footer.vue';

export default {
	components:{
		Footer,
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