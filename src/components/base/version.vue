<template>
	<v-row>
		<v-col cols="12">
			<v-btn text @click="dialog = true">versión 2.0.2</v-btn>
		</v-col>
		<v-dialog v-model="dialog" max-width="500px" top>
			<v-card>
				<v-card-title class="headline">Versión 2.0.2</v-card-title>
				<v-card-text>
					+ Se agrego un nuevo modulo.  <br>
					+ Se cambio Tesis militares por Investigaciones militares.  <br>
					<v-card-title>Versión 2.0.1</v-card-title>
					    <v-card-text>
						+ Cambios en las visualizaciones y entorno.  <br>
						+ Mejoras en la seguridad de la aplicación.  <br>
						+ Se agregaron mas Componentes iniciales.	 <br>
						+ Se pueden editar las Fuentes de Conocimiento.  <br>
						</v-card-text>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="dialog = false">Cerrar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>

export default {
	name: 'version',
	data() {
		return {
			dialog: false,
		};
	},
};
</script>

<style scoped>
	.v-dialog__content--active,
	.v-dialog__content {
  align-items: flex-start !important; /* Alinea el diálogo en la parte superior */
}
</style>