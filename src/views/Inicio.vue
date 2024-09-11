<template>
    <v-container fluid>
        <v-row class="justify-center">
            <v-col cols="12">
                <breadcrumb :items="breadcrumItems" />
            </v-col>
            <v-col 
                v-for="card in fuentesConocimiento" 
                :key="card.id" 
                sm="12" 
                md="4" 
                lg="3"
            >
                <card-documento
                    :key="card.id"
                    :item="card"
                    @clickCard="click"
                />
            </v-col>
        </v-row>

        <v-overlay v-if="isLoading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Breadcrumb from "@/components/base/breadcrumb";
import CardDocumento from "@/components/cardDocumento.vue";

export default {
    name: "Inicio",
    components:{
        Breadcrumb,
        CardDocumento,
    },
    data() {
        return {
            breadcrumItems: [
                {
                    text: 'INICIO', 
                    disabled: true, 
                    to: { name: `inicio` }
                },
            ],
            fuentesConocimiento: [],
        }
    },
	computed: {    
		...mapGetters("conocimientosStore", ["isLoading"]),
	},
	async mounted() {
        await this.getData()
	},
    methods: {
        async getData() {
			const resp = await this.getConocimiento()

			if (resp.status == 200) {
				this.fuentesConocimiento = resp.data;
			}
		},

        click(item) {
            this.sesionTime = setTimeout(() => {
                this.$router.push({ 
                    name: "archivos", 
                    params: {
                        id: item.id
                    }
                })
            }, 500);
        },

        ...mapActions("conocimientosStore", ["getConocimiento"]),
    }
}
</script>