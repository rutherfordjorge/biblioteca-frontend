<template>
	<v-container fluid>
		<v-row dense>
			<v-col cols="12" class="text-center"><h2>Fuentes de Conocimiento</h2></v-col>

			<v-col class="text-left" cols="12">
				<v-btn color="primary" dark class="mb-2" @click="openDialog">
					fuente de conocimiento
					<v-icon right>mdi-plus</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		
		<v-simple-table fixed-header max-height="80vh">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left" width="5%">Imágen</th>
						<th class="text-left" width="40%">Título</th>
						<th class="text-left" width="15%">Contacto</th>
						<th class="text-left" width="15%">teléfono</th>
						<th class="text-left" width="15%">Correo</th>
						<th class="text-center" width="10%">Acciones</th>
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
					<td>
						{{ item.id + item.titulo }}
					</td>
					<td>{{ item.contacto }}</td>
					<td>{{ item.telefono }}</td>
					<td class="text-center">{{ item.correo }}</td>
					<td class="text-center">
						<v-tooltip top>
							<template v-slot:activator="{ on }">
								<v-icon
								small
								class="mr-2"
								v-on="on"
								@click="cargoDetail(item)"
								>mdi-magnify</v-icon
								>
							</template>
							<span>Detalle</span>
						</v-tooltip>
						
						<v-tooltip top v-if="edit">
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
						</v-tooltip>
					</td>
				</tr>
			</draggable>
		</template>
	</v-simple-table>

	<v-dialog
		v-model="dialogNew"
		persistent
		:max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
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

							<v-col cols="12">
                                <v-file-input
                                    type="file"
                                    id="docpicker"
                                    accept=".svg"
                                    label="Imágen"
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

	<v-overlay v-if="isLoading">
		<v-progress-circular indeterminate size="64"></v-progress-circular>
	</v-overlay>
</v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
	name: "Cargos",
	components: {
		draggable,
	},
	props: ["item", "edit", "organizacion"],
	data() {
		return {
			imagen: null,
			fuentesConocimiento: [],
			dialogNew: false,
			validForm: false,
			newItem: {
				titulo: null,
				contacto: null,
				fono: null,
				correo: null,
				imagen: null,
			},
			defaultItem: {
				titulo: null,
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
	},
	computed: {
		...mapGetters("conocimientosStore", ["isLoading"]),
	},
	methods: {
		...mapActions("conocimientosStore", [
			"getConocimiento",
			"postConocimiento",
		]),

		async getData() {
			await this.getConocimiento().then( resp => {
				this.fuentesConocimiento = resp.data;
			})
		},

		orderConocimiento() {
			console.log('orden')
			console.log(this.fuentesConocimiento)
		},

		openDialog() {
			this.newItem = Object.assign({}, this.defaultItem);
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
					TITULO: this.newItem.titulo,
					IMAGEN: this.imagen,
					CONTACTO: this.newItem.contacto,
					TELEFONO: this.newItem.fono,
					CORREO: this.newItem.correo,
				}
				const resp = await this.postConocimiento(payload);
				console.log(resp)

				await this.getData()
				this.dialogNew = false
				console.log('Guardar.')
			}
		},
		
        resetValidation(){
            if(this.$refs.form) 
                this.$refs.form.resetValidation();// limpia los mensajes de validación de formulario abiertos previamente
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