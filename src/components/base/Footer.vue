<template>
	<v-footer color="grey darken-4 pa-5" dark paddless>
		<v-container fluid>
			<scroll-down />
			<v-row class="justify-center">
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
						src="logoR2B.png"
						height="130px"
						contain
					/>
				</v-col>
				
				<v-col cols="12" class="text-center">
					<strong>Administracion Técnica</strong> | Departamento de Desarrollo de Sistemas - RINTE Nº 2
					<br /><v-icon small>mdi-phone</v-icon> &nbsp; (+562) 269 34000
					<br /><v-icon small>mdi-email</v-icon> soporte.bibliotecavirtual@ejercito.cl
				</v-col>
				
			</v-row>
		</v-container>
		
	</v-footer>
</template>

<script>
import FooterCard from '@/components/base/footerCard.vue';
import ScrollDown from '@/components/base/scrollDown.vue';

export default {
	name: 'Footer',
	components:{
		FooterCard,
		ScrollDown,
	},
	data() {
		return {
			operadores: [
				{
					key: 1,
					escudo: '/divdoc.png',
					nombre: 'DIVDOC DEPTO I',
					modulo: 'TEXTO DOCTRINARIOS',
					texto: 'Si tiene dudas o requerimiento de acceso a textos doctrinarios reservados o secretos, comunicarse a División Doctrina.',
					telefono: "83200 - 83201 - 83203",
					correo: "divdoc@ejercito.cl",
				},
				{
					key: 2,
					escudo: '/dimacoe.png',
					nombre: 'DIMACOE DEPTO I',
					modulo: 'PROCEDIMIENTOS INSTITUCIONALES',
					texto: 'Si tiene dudas o requerimiento de acceso a procedimientos institucionales reservados o secretos, comunicarse a DIMACOE Depto I.',
					telefono: "+562 269 32961",
					correo: "dimacoe@ejercito.cl",
				},
                {
					key: 3,
					escudo: '/dimacoe.png',
					nombre: 'DIMACOE DEPTO IV',
					modulo: 'COORDINADOR DE TICs',
					texto: 'Consultas en cuanto a la priorización de los desarrollos de sistemas de información y/o tecnologías de la información comunicarse a DIMACOE Depto IV.',
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
				case 'lg' : return 4
				case 'xl' : return 3
				default : return 12
			}
		},
	},
};
</script>