<template>
    <v-container fluid>
        <v-col cols="12" class="text-center">
            <h2>
                <v-icon>mdi-account-circle</v-icon>
                Gestión de Usuarios
            </h2>
        </v-col>
        <usuarios editable />
    </v-container>
</template>

<script>
import usuarios from "@/components/base/usuarios"

export default {
    name: "Usuarios",
    components: {
        usuarios
    },
};
</script>
