<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <breadcrumb :items="breadcrumItems" />
            </v-col>
        </v-row>
        <listado-archivos :conocimientoId="parseInt($route.params.id)" />
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Breadcrumb from "@/components/base/breadcrumb";
import ListadoArchivos from "@/components/listadoArchivos";

export default {
    name: "Archivos",
    components:{
        Breadcrumb,
        ListadoArchivos,
    },
    data() {
        return {
            breadcrumItems: [
                {
                    text: 'Inicio', 
                    disabled: false, 
                    to: { name: `inicio` }
                },
            ],
            archivos: [],
        }
    },
	computed: {    
		...mapGetters("conocimientosStore", ["conocimiento"]),
	},
	async mounted() {
        this.addBreadcrumb();
        await this.getData()
	},
    methods: {
        async getData() {
			// const resp = await this.getConocimiento()

			// if (resp.status == 200) {
			// 	this.archivos = resp.data;
			// }
		},

        async addBreadcrumb() {
            const resp = await this.getConocimientoById(this.$route.params.id)
            if (resp.status == 200) {
                this.breadcrumItems.push({
                    text: resp.data.titulo.toUpperCase(),
                    disabled: true,
                    to: {
                        name: 'archivos',
                        params: {
                            id: this.$route.params.id
                        }
                    }
                });
            }
		},
        ...mapActions("conocimientosStore", ["getConocimientoById"]),
    }
}
</script>