<template>
	<v-container fluid>
		<v-row dense>
			<v-col cols="12" class="text-center"><h1>Fuentes de Conocimiento</h1>
			</v-col>
			<v-col class="text-left" cols="12">
				<v-btn color="primary" dark class="mb-2" @click="openDialog">
					agregar fuente
					<v-icon right>mdi-plus</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<v-simple-table fixed-header max-height="80vh">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-center" width="5%">Imágen</th>
						<th class="text-left" width="5%">ID</th>
						<th class="text-left" width="15%">Título</th>
						<th class="text-left" width="30%">Descripción</th>
						<th class="text-left" width="13%">Contacto</th>
						<th class="text-left" width="13%">Teléfono</th>
						<th class="text-left" width="13%">Correo</th>
						<th class="text-center" width="6%">Acciones</th>
					</tr>
				</thead>
				
				<draggable
					v-model="fuentesConocimiento"
					tag="tbody"
					@change="orderConocimiento"
				>
				<tr v-for="item in fuentesConocimiento" :key="item.name">
					<td class="text-center">
						<v-avatar
							size="50"
							class="ma-5"
						>
						<v-img contain :src="item.imagen" lazy-src="/avatar.svg" />
						</v-avatar>
					</td>
					<td> {{ item.id }} </td>
					<td> {{ item.titulo }} </td>
					<td> {{ item.descripcion }} </td>
					<td> {{ item.contacto }} </td>
					<td> {{ item.telefono }} </td>
					<td> {{ item.correo }} </td>
					<td class="text-center">
						<v-tooltip top>
							<template v-slot:activator="{ on }">
								<v-icon
								class="mr-2"
								v-on="on"
								@click="openColeccion(item)"
								>mdi-archive-outline</v-icon
								>
							</template>
							<span>Colecciones</span>
						</v-tooltip>
						<!-- <v-tooltip top>
							<template v-slot:activator="{ on }">
								<v-icon
								class="mr-2"
								v-on="on"
								@click="editDialogo(item)" 
								>mdi-pencil
								</v-icon>
							</template>
							<span>Editar</span>
						</v-tooltip> -->


						<!-- <v-tooltip top>
							<template v-slot:activator="{ on }">
								<v-icon
								class="mr-2"
								v-on="on"
								@click="cargoDetail(item)"
								>mdi-magnify
								</v-icon>
							</template>
							<span>Ver</span>
						</v-tooltip> -->

						<!-- <v-tooltip top v-if="edit">
							<template v-slot:activator="{ on }">
								<v-icon
								small
								class="mr-2"
								v-on="on"
								@click="dialogDeleteCargo(item)"
								>mdi-delete</v-icon
								>
							</template>
							<span>Eliminar</span>
						</v-tooltip> -->
						
					</td>
				</tr>
			</draggable>
			
		</template>
	</v-simple-table>

	<!-- NUEVA FUENTE CONOCIMIENTO DIALOG -->
	<v-dialog
		v-model="dialogNew"
		persistent
		:max-width="$vuetify.breakpoint.mdAndUp ? '50vw' : '90vw'"
	>
		<v-card>
			<v-card-title class="grey darken-4">
				<span class="text-h5 white--text">Crear nueva fuente de conocimiento</span>
				<v-spacer />
				<v-btn 
					icon
					dark
					size="x-small"
					class="float-end ma-2"
					@click="dialogNew=false"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-form v-model="validForm" ref="form">
					<v-container>
						<v-row>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
								<v-text-field
									label="Título"
									outlined
									v-model="newItem.titulo"
									counter="50"
									:rules="rules.textRequired"
								></v-text-field>
							</v-col>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
                                <v-file-input
                                    type="file"
                                    id="docpicker"
                                    accept=".svg"
                                    label="Icono"
                                    chips
                                    outlined
                                    counter
                                    show-size
                                    hint="Seleccione archivos de menos de 100kb."
                                    persistent-hint
                                    v-model="newItem.imagen"
									:rules="rules.image"
                                />
                            </v-col>

							<v-col cols="12">
								<v-textarea
									label="Descripción"
									outlined
									v-model="newItem.descripcion"
									counter="500"
									:rules="rules.textRequired"
								></v-textarea>
							</v-col>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
								<v-autocomplete
									v-model="newItem.rolid"
									outlined
									:items="roles"
									item-text="nombre"
									item-value="id"
									label="Operador"
								/>
							</v-col>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
								<v-text-field
									label="Contacto"
									outlined
									v-model="newItem.contacto"
									counter="50"
									:rules="rules.textRequired"
								></v-text-field>
							</v-col>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
								<v-text-field
									label="Teléfono(s)"
									outlined
									v-model="newItem.fono"
									counter="50"
									:rules="rules.textRequired"
								></v-text-field>
							</v-col>

							<v-col :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'">
								<v-text-field
									label="Correo(s)"
									outlined
									v-model="newItem.correo"
									counter="50"
									:rules="rules.textRequired"
								></v-text-field>
							</v-col>

						</v-row>
					</v-container>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="secondary"
					text
					outlined
					@click="dialogNew=false"
				>
					Cancelar
				</v-btn>
				<v-btn
					color="primary"
					@click="save"
				>
					Guardar
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<!-- COLECCIONES DIALOG -->
	<v-dialog 
		v-model="coleccionDialog"
		persistent
		:max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
	>
		<v-card>
			<v-card-title class="grey darken-4">
				<span class="text-h5 white--text">Colecciones {{ tituloDialog != null ? 'de ' + tituloDialog : '' }}</span>
				<v-spacer />
				<v-btn 
					icon
					dark
					size="x-small"
					class="float-end ma-2"
					@click="coleccionDialog = false"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			
			<v-card-text>
				<!-- <anexos :key="documentoId" :documentoId="documentoId" :editable="documentoEditable" /> -->
				<colecciones v-if="coleccionDialog" :conocimientoId="conocimientoId"/>
			</v-card-text>
		</v-card>
	</v-dialog>

	<v-overlay v-if="isLoading">
		<v-progress-circular indeterminate size="64"></v-progress-circular>
	</v-overlay>
</v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";
import Colecciones from "@/components/colecciones"

// Notificación
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
	name: "Cargos",
	components: {
		draggable,
		Colecciones,
	},
	props: ["item", "edit", "organizacion"],
	data() {
		return {
			imagen: null,
			fuentesConocimiento: [],
			dialogNew: false,
			validForm: false,
			roles: [],
			tituloDialog: null,
			conocimientoId: null,
			coleccionDialog: false,
			newItem: {
				rolid: null,
				titulo: null,
				descripcion: null,
				contacto: null,
				fono: null,
				correo: null,
				imagen: null,
			},
			defaultItem: {
				rolid: null,
				titulo: null,
				descripcion: null,
				contacto: null,
				fono: null,
				correo: null,
				imagen: null,
			},
			rules: {
				textRequired:[
					v => !!v || "Este campo es requerido",
					v => v? v.length <= 50 || "Deben ser menos de 50 carácteres.": "Este campo es requerido.",
				],
				image:[
					// (1 * 1024 * 1024) = 1 MB
					v => !!v || "Este campo es requerido",
					v => !v || v.size < (1 * 1024 * 1024)/4 || 'La imágen debe ser de un máximo de 250kb.',
				]
			},
		};
	},
	async beforeMount() {
		await this.getData()

		const respRoles = await this.getRoles()
        this.roles = respRoles.data
	},
	computed: {
		...mapGetters("conocimientosStore", ["isLoading"]),
	},
	methods: {
		...mapActions("conocimientosStore", [
			"getConocimiento",
			"postConocimiento",
			"putOrdenConocimiento",
		]),

		...mapActions("usuariosStore", [
            "getRoles",
        ]),

		async getData() {
			const resp = await this.getConocimiento()

			if (resp.status == 200) {
				this.fuentesConocimiento = resp.data;
			}
		},

		async orderConocimiento() {
			// console.log('orden')
			// console.log(this.fuentesConocimiento)
			const resp = await this.putOrdenConocimiento(this.fuentesConocimiento)
			if (resp.status == 200) {
				toastr.success("Se ha actualizado el orden del listado", "Éxito!")
			}
		},

		openColeccion(item) {
			this.conocimientoId = item.id
			this.tituloDialog = item.titulo
			this.$nextTick(() => {
                this.coleccionDialog = true
            })
		},

		openDialog() {
			this.newItem = Object.assign({}, this.defaultItem);
			this.resetValidation()
			this.$nextTick(() => {
                this.dialogNew = true
            })
		},

		editDialog(item) {
			this.newItem = Object.assign({}, item);
			this.resetValidation()
			this.$nextTick(() => {
                this.dialogNew = true
            })
		},

		async save() {
			this.validate();
            if (this.validForm) {			
				this.imagen = await this.toBase64(this.newItem.imagen);
				const payload = {
					ROLID: this.newItem.rolid,
					TITULO: this.newItem.titulo,
					DESCRIPCION: this.newItem.descripcion,
					IMAGEN: this.imagen,
					CONTACTO: this.newItem.contacto,
					TELEFONO: this.newItem.fono,
					CORREO: this.newItem.correo,
				}
				const resp = await this.postConocimiento(payload);
				if (resp.status == 200) {
					toastr.success("Se ha agregado una nueva fuente de conocimiento correctamente", "Éxito!")
					await this.getData()
					this.dialogNew = false
				}
				else {
					toastr.error("Ha ocurrido un error", "Error!")
				}
			}
		},
		
        resetValidation(){
            if(this.$refs.form) 
                this.$refs.form.resetValidation(); // limpia los mensajes de validación de formulario abiertos previamente
        },
        
        validate() {
            this.$refs.form.validate();
        },

		toBase64: (file) => new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        }),

	},
};
</script>
<style scoped>
	th {
		font-weight: 800;
		font-size: 2em;
	}
</style>