<template>
	<v-dialog 
		v-model="show"
		persistent
		:max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
	>
		<v-card>
			<v-card-title class="primary">
				<span class="white--text">Restablecer Clave Ejército</span>
				<v-spacer />
				<v-btn dark icon @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<!-- Mensaje de seguridad para todos los usuarios -->
				<v-row dense class="text-justify">
					<v-col cols="12" class="px-4 mt-4">
						<v-card elevation="1" color="#e9f3ff">
							<v-card-text>
								<b>Con el propósito de cumplir con las orientaciones difundidas por el Gobierno, en cuanto a lineamientos para el 
									desarrollo de software en organismos del Estado y aumentar el nivel de seguridad y protección de la información de 
									los sistemas de información del Sistema de Mando y Control Permanente del Ejército, se incorporó una capa de seguridad en protocolo ARGON2 
									para la implementación de <span style="color: black">CLAVE EJÉRCITO</span>, la que será utilizada y difundida a través de la plataforma de integración 
									definida por RINTE Nº2 "Llaitún", para ser utilizada por el sistema que lo solicite en la intranet institucional.</b>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
					
					<v-form @submit.prevent="resetPassword" ref="resetForm" v-model="formValid">
						<v-row dense class="text-justify">
							
							<v-col cols="12" md="6" class="px-4 mt-4">
								<v-text-field
								label="RUN sin puntos ni dígito verificador"
								v-model="run"
								:rules="userRule"
								type="text"
								/>
							</v-col>
							
							<v-col cols="12" md="6" class="px-4 mt-4">
								<v-text-field
								label="Número de documento sin puntos"
								v-model="documento"
								:rules="documentRule"
								type="text"
								/>
							</v-col>
							
							<v-col cols="12" md="6" class="px-4 mt-4">
								<v-text-field
								label="Nueva Clave Ejército"
								v-model="pass"
								:append-icon="passMostrar ? 'mdi-eye-off' : 'mdi-eye'"
								:type="passMostrar ? 'text' : 'password'"
								:rules="passRule"
								@click:append="passMostrar = !passMostrar"
								/>
							</v-col>
							<v-col cols="12" md="6" class="px-4 mt-4">
								<v-text-field
								label="Confirmar Clave Ejército"
								v-model="passConfirm"
								type="password"
								:rules="confirmRule"
								/>
							</v-col>
							<v-col cols="12" class="px-4 mt-4">
								<v-btn
								type="submit"
								class="ma-2"
								style="float: right;"
								title="Reestablecer contraseña"
								:loading="isLoading"
								:disabled="isLoading"
								color="primary"
								@click="resetPassword"
								>
								RESTABLECER CLAVE EJÉRCITO
								<v-icon right small>mdi-lock-open</v-icon>
							</v-btn>
						</v-col>
						
						<v-col cols="12" class="px-4 mt-4">
							<p>* Contraseña válida para todos los sistemas de información del Sistema de Mando y Control Permanente del Ejército a los que usted tenga acceso.</p>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default {
	name: 'cambioPass',
	props: {
        show: {
            type: Boolean,
            required: true,
        },
    },
	components:{},
	data() {
		return {
			hayCredencialesAnteriores: false,
			run: null,
			pass: null,
			passConfirm: null,
			documento: null,
			passMostrar: false,
			formValid: false,
			isLoading: false,
			userRule:[
				v => !!v || "El run es requerido",
				v => v? v.length <= 8 || "El run debe ser menor a 8 digitos": "El run es requerido",
			],
			documentRule:[
				v => !!v || "El número de documento es requerido",
				v => v? v.length <= 9 || "El número de documento tiene 9 digitos": "El número de documento es requerido",
				v => v? v.length > 8 || "El número de documento tiene 9 digitos": "El número de documento es requerido",
			],
			passRule:[
				v => !!v || "Clave requerida",
				v => v? v.length > 5 || "La clave es muy corta": "Clave requerida",
			],
			confirmRule: [
				v => !!v || "Confirmación de clave requerida",
				v => v == this.pass || "Las claves no concuerdan",
			],
		};
	},
	computed: {},
	methods: {
		
		close() {
			this.$emit("close");
		},
		
		formValidate() {
			this.$refs.resetForm.validate();
		},

		async resetPassword() {
			this.formValidate()
			this.isLoading = true
			
			if(this.formValid){
				const resp = await this.restablecerCuenta({
					run: this.run,
					pass: this.pass,
					documento: this.documento
				})
				
				if (resp.status === 200) {
					toastr.success(`Se restableció la clave Ejército con éxito`, "Éxito!");
					this.close()
				}
				else {
					toastr.error(`Por favor revise nuevamente la información ingresada`, "Error!");
				}
			}
			
			this.isLoading = false
		},
		
		...mapActions(["restablecerCuenta"]),
	}
};
</script>