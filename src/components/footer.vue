<template>
	<v-footer color="grey darken-4 pa-5" dark paddless>
		<v-container fluid>
			
			<v-row>
				<v-col cols="12" class="text-center">
					OPERACIÓN DEL SISTEMA
				</v-col>

				<v-col :cols="size" v-for="operador in operadores" :key="operador.key">
					<footer-card :item="operador" :key="operador.key" />
				</v-col>
			</v-row>

			<v-row>
				<v-col cols="12">
					<v-divider class="mb-6" />
					<v-img
						src="@/assets/escudos/rinte2.png"
						height="130px"
						contain
					/>
				</v-col>
				
				<v-col cols="12" class="text-center">
					<strong>Administracion Técnica</strong> | Departamento de Desarrollo de Sistemas - RINTE 2
					<br /><v-icon small>mdi-phone</v-icon> &nbsp; (+56 2) 2693 4000
					<br /><v-icon small>mdi-email</v-icon> soporte.bibliotecavirtual@ejercito.cl
				</v-col>
				
			</v-row>
		</v-container>
		
	</v-footer>
</template>

<script>
import FooterCard from '@/components/footerCard.vue';

export default {
	name: 'Footer',
	components:{
		FooterCard,
	},
	data() {
		return {
			operadores: [
				{
					key: 1,
					escudo: '/escudos/divdoc.png',
					nombre: 'DIVDOC',
					modulo: 'TEXTOS DOCTRINARIOS',
					texto: 'Si tiene dudas o requerimiento de acceso a textos doctrinarios reservados o secretos, comunicarse a División Doctrina.',
					telefono: "+569 8888888",
					correo: "divdoc@ejercito.cl",
				},
				{
					key: 2,
					escudo: '/dimacoe.png',
					nombre: 'DIMACOE DEPTO I',
					modulo: 'PROCEDIMIENTOS INSTITUCIONALES',
					texto: 'Si tiene dudas o requerimiento de acceso a procedimientos institucionales reservados o secretos, comunicarse a DIMACOE DEPTO I.',
					telefono: "+562 269 32xxx",
					correo: "dimacoe@ejercito.cl",
				},
				{
					key: 3,
					escudo: '/dimacoe.png',
					nombre: 'DIMACOE DEPTO IV',
					modulo: 'COORDINADOR DE TICs',
					texto: 'Consultas en cuanto a priorización de los desarrollos de sistemas de información y/o tecnologías de la información.',
					telefono: "+562 269 32xxx",
					correo: "dimacoe@ejercito.cl",
				},
			],
		};
	},
	computed: {
		size () {
			switch (this.$vuetify.breakpoint.name) {
				case 'xs' : return 12
				case 'sm' : return 6
				case 'md' : return 4
				case 'lg' : return 3
				case 'xl' : return 3
				default : return 12
			}
		},
	},
};
</script>