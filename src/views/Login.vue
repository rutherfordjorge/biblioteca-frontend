<template>
	<v-app id="inspire">
		<v-main color="primary">
			<v-container class="contentHeight hero" fluid>
				<v-row class="justify-center text-center" dense>
					<v-col sm="12" md="6" lg="4">
						<v-avatar
							:size="existLastUser ? 150 : 380"
							:class="existLastUser ? '' : 'pa-6 mb-10'"
						>
							<v-img contain src="/bibliotecaEscudo.svg"></v-img>
						</v-avatar>
					</v-col>
				</v-row>

				<v-row class="justify-center text-center" dense>
					
					<v-col sm="12" md="6" lg="4">
						<!-- <v-img
						src="/soeEscudo.png"
						:class="existLastUser ? 'logoSmall' : 'logoBig'"
						></v-img> -->
						
						<v-avatar
							v-if="existLastUser"
							size="270"
							class="Avatar mb-10"
						>
							<v-img contain :src="avatar" lazy-src="/avatar.svg" />
						</v-avatar>
						
						<p v-if="existLastUser" class="text-center title">{{nombreUsuario}}</p>
					</v-col>
				</v-row>
		
				<v-row class="justify-center text-center">
					
					<v-col xs="12" sm="7" md="6" lg="4">
						<v-form @submit.prevent="authenticate" ref="loginform" v-model="formValid">
							
							<v-text-field
								v-show="!existLastUser"
								label="RUN sin puntos ni dígito verificador"
								v-model="credentials.usuario"
								:rules="userRule"
								type="text"
								outlined
								background-color="white"
							/>
							
							<v-text-field
								id="password"
								label="Contraseña Ejército"
								v-model="credentials.password"
								:append-icon="mostrar ? 'mdi-eye-off' : 'mdi-eye'"
								:type="mostrar ? 'text' : 'password'"
								:rules="passRule"
								@click:append="mostrar = !mostrar"
								outlined
								background-color="white"
							/>
							<v-row>
								<v-col>
									<p class="text-left">
										<span @click="restablecerModal=!restablecerModal" style="cursor:pointer">
											Restablecer contraseña
											<v-icon small>mdi-lock</v-icon>
										</span>
									</p>
								</v-col>
								<v-col>
									<!-- Se muestra en tamaños grandes -->
									<p v-if="existLastUser" class="text-right hidden-sm-and-down">
										<span @click="changeUserLogin" style="cursor:pointer">
											Cambiar de usuario
										</span>
									</p>
									<!-- Se muestra en tamaños pequeños -->
									<p v-if="existLastUser" class="text-left hidden-md-and-up">
										<span @click="changeUserLogin" style="cursor:pointer">
											Cambiar de usuario
										</span>
									</p>
								</v-col>
							</v-row>
							<p class="text-right red--text text--lighten-1">{{authError}}</p>
							
							<v-btn
								type="submit"
								class="ma-2"
								style="float: right;"
								title="Ingresar a la plataforma"
								:loading="isLoading"
								:disabled="isLoading"
								color="primary"
								@click="authenticate"
							>
								INGRESAR
								<v-icon right x-large>mdi-chevron-right</v-icon>
							</v-btn>
							
						</v-form>
					</v-col>
					
				</v-row>
	
			</v-container>
			<Footer />

			<v-dialog 
				v-model="infoModal"
				persistent
				:max-width="$vuetify.breakpoint.mdAndUp ? '50vw' : '90vw'"
			>
				<v-card>
					<v-card-title class="primary">
						<span class="white--text">Marcha Blanca SGDI 2024</span>
						<v-spacer />
						<v-btn dark icon @click="infoModal = false">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text>
						<!-- Mensaje de seguridad para todos los usuarios -->
						<v-row dense class="text-justify">
							<v-col cols="12" class="px-4 mt-4">
								<v-alert
									border="left"
									colored-border
									type="warning"
									prominent
									elevation="2"
								>
									<span class="alerta">
										El sistema se encuentra en MARCHA BLANCA hasta el día <b>viernes 28 de JUNIO</b>, 
										el propósito de este proceso es el de encontrar novedades de funcionamiento 
										o rendimiento de esta nueva versión del sistema, 
										revise cuidadosamente toda documentación 
										que tramite mediante este período, si tiene una novedad con 
										respecto al procedimiento de uso, contacte al <b>JEMGE AGE</b>, de 
										presentar un problema técnico al DDS de <b>RINTE Nº2 "Llaitún"</b> 
										o al correo <b>soporte.sgdi@ejercito.cl</b>
									</span>
								</v-alert>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-dialog 
				v-model="restablecerModal"
				persistent
				:max-width="$vuetify.breakpoint.mdAndUp ? '60vw' : '90vw'"
			>
				<v-card>
					<v-card-title class="primary">
						<span class="white--text">Restablecer Clave Ejército</span>
						<v-spacer />
						<v-btn dark icon @click="restablecerModal = false">
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
							
							<v-form @submit.prevent="resetPassword" ref="resetForm" v-model="restablecer.formValid">
								<v-row dense class="text-justify">
									
									<v-col cols="12" md="6" class="px-4 mt-4">
										<v-text-field
										label="RUN sin puntos ni dígito verificador"
										v-model="restablecer.run"
										:rules="userRule"
										type="text"
										/>
									</v-col>
									
									<v-col cols="12" md="6" class="px-4 mt-4">
										<v-text-field
										label="Número de documento sin puntos"
										v-model="restablecer.documento"
										:rules="documentRule"
										type="text"
										/>
									</v-col>
									
									<v-col cols="12" md="6" class="px-4 mt-4">
										<v-text-field
										label="Nueva Clave Ejército"
										v-model="restablecer.pass"
										:append-icon="restablecer.passMostrar ? 'mdi-eye-off' : 'mdi-eye'"
										:type="restablecer.passMostrar ? 'text' : 'password'"
										:rules="passRule"
										@click:append="restablecer.passMostrar = !restablecer.passMostrar"
										/>
									</v-col>
									<v-col cols="12" md="6" class="px-4 mt-4">
										<v-text-field
										label="Confirmar Clave Ejército"
										v-model="restablecer.passConfirm"
										type="password"
										:rules="confirmRule"
										/>
									</v-col>
									<v-col cols="12" class="px-4 mt-4">
										<v-btn
										type="submit"
										class="ma-2"
										style="float: right;"
										title="Ingresar al Sistema de Organización"
										:loading="restablecer.isLoading"
										:disabled="restablecer.isLoading"
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

		</v-main>
	</v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    data() {
        return {
			// habilitar solo en caso de difundir una información en el inicio
            infoModal: false,
            existLastUser: false,
            avatar: null,
            hayCredencialesAnteriores: false,
            mostrar: false,
            formValid: false,
            nombreUsuario: '',
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
                v => v == this.restablecer.pass || "Las claves no concuerdan",
            ],
            credentials: {
                usuario: "",
                password: ""
            },
            restablecerModal: false,
            restablecer: {
                run: null,
                pass: null,
                passConfirm: null,
                documento: null,
                passMostrar: false,
                formValid: false,
                isLoading: false,
            },
        };
    },
    methods: {
        validate(){
        this.$refs.loginform.validate();
        },
        authenticate() {
			this.validate()
			if(this.formValid){
				this.login(this.credentials)
			}
        },

		resetValidation(){
			//limpia los mensajes de validación de formulario abiertos previamente
            if(this.$refs.loginform) 
                this.$refs.loginform.resetValidation();
        },

        resetValidate() {
			this.$refs.resetForm.validate();
        },

        async resetPassword() {
			this.resetValidate()
			this.restablecer.isLoading = true
			const resp = await this.restablecerCuenta(this.restablecer)
			
			if (resp.status === 200) {
				this.$toastr("success", `Se restableció la clave Ejército con éxito`, "Éxito!");
				this.restablecerModal = false
			}
			else if (resp.status != 400) {
				this.$toastr("error", resp.data, "Error!");
			}
			else {
				this.$toastr("error", `Por favor revise nuevamente la información ingresada`, "Error!");
			}
			
			this.restablecer.isLoading = false
        },

        changeUserLogin(){
			this.deleteLocalUser();
			this.credentials.usuario = '';
			this.resetValidation()
        },
        deleteLocalUser(){
			localStorage.removeItem("bibliotecaAvatar");
			localStorage.removeItem("bibliotecaRun");
			localStorage.removeItem("bibliotecaNombre");
			localStorage.removeItem("bibliotecaExpira");
			
			this.credentials.usuario = null;
			this.nombreUsuario = null;
			this.avatar = null;
			this.existLastUser = false;
        },
        
        ...mapActions(["login", "restablecerCuenta"]),
    },
    computed: {

        ...mapGetters(["isLoading", "authError"])
    },
    created() {
        this.$store.commit("SET_LAYOUT", "login-layout");

        this.credentials.usuario = localStorage.getItem("bibliotecaRun");
        this.nombreUsuario = localStorage.getItem("bibliotecaNombre");
        this.avatar = localStorage.getItem("bibliotecaAvatar");

        if(this.nombreUsuario) {
        this.existLastUser = true;
        }
    },
};
</script>

<style scoped>

.Avatar {
	border: 3px solid rgb(230, 230, 230);
}

.contentHeight {
	height: 95vh;    
	display: table;
}

body {
	background-image: '/fondo.svg';
}

.hero {
	background: url('/fondo.svg');
	background-size: cover;
}

.alerta {
	font-size: 1.3em;
	line-height: 1.4;
}

</style>
