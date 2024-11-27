<template>
	<v-row>
		<v-col cols="12">
			<v-btn text @click="dialog = true">versión 2.0.4</v-btn>
		</v-col>
		<v-dialog v-model="dialog" max-width="650px" top>
			<v-card>
				<v-expansion-panels>
					<v-expansion-panel>
						<v-expansion-panel-header class="headline" color="grey lighten-3">Versión 2.0.4</v-expansion-panel-header>
							<v-expansion-panel-content>
									+ Cambios en las visualizaciones. <br>
									+ Cambios en la interfaz de usuario.
									+ Cambios en Posición de "Nombre" con "Colecciones" <br>
							</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header>Versión 2.0.3</v-expansion-panel-header>
							<v-expansion-panel-content>
								+ Se corrige el problema de los estados (Vigente y En elaboración).  <br>
								+ Solamente la DIVDOC tiene acceso a auditoria y estadistica. <br>
								+ Se agrega la función Eliminar para los operadores del sistema.  <br>
								+ Habilitación del botón "Acceso" para la documentación Reservada y Secreta.  <br>
								+ Se agrega el campo "Estado" para las publicaciones Vigentes o En elaboración.
							</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header>Versión 2.0.2</v-expansion-panel-header>
							<v-expansion-panel-content>
								+ Se agrego un nuevo modulo.  <br>
								+ Se modificó Tesis militares por Investigaciones militares.  
							</v-expansion-panel-content>
					</v-expansion-panel>

					<v-expansion-panel>
						<v-expansion-panel-header>Versión 2.0.1</v-expansion-panel-header>
							<v-expansion-panel-content>
								+ Cambios en las visualizaciones y entorno.  <br>
								+ Mejoras en la seguridad de la aplicación.  <br>
								+ Se agregaron mas Componentes iniciales.  <br>
								+ Se pueden editar las Fuentes de Conocimiento.  
							</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>

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