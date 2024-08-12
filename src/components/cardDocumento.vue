<template>
    <v-container fluid class="mx-auto">

        <v-card hover @click="click">
            <v-card-subtitle class="flex-nowrap overflow-hidden title" :title="item.titulo">{{ item.titulo }}</v-card-subtitle>
            <v-card-text>
                <v-col cols="12">
                    <v-img :src="item.imagen" height="150px" contain />
                </v-col>
                
                <v-col cols="12">
                    <v-icon small> mdi-head-cog </v-icon> Responsable: {{ item.contacto }}
                    <br />
                    <v-icon small> mdi-phone-in-talk </v-icon> Telefono: {{ item.telefono }}
                    <br />
                    <v-icon small> mdi-email </v-icon> Correo: {{ item.correo }}
                </v-col>

                <v-col cols="12" class="text-justify texto-height">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <span
                                v-on="on"
                            >
                                {{ item.descripcion.length > 90 ? item.descripcion.substring(0,90) + '...' : item.descripcion }}
                            </span>
                        </template>
                        <span>{{ item.descripcion }}</span>
                    </v-tooltip>
                </v-col>
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
export default {
    name: "cardDocumento",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    methods: {
        click() {
            this.$emit('clickCard', this.item)
        }
    }
}
</script>

<style scoped>
.v-card__title {
    color: black;
}
.v-responsive__sizer {
    transition: padding-bottom 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
    flex: 0 0 0px;
}

.title{
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.texto-height {
    height: 80px !important;
}

</style>