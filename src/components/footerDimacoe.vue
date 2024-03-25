<template>
    <v-footer
    padless
    color="black"
    >
    <!-- <v-row
        justify="center"
    >  -->
    <!--<v-col cols="2">
        <v-img 
            src="/divdoc.ico"
            height="90"
            contain
        ></v-img>
    </v-col> -->
    <!-- <v-col
        cols="4"
        class="black py-4 text-justify white--text"
    >
        TEXTOS DOCTRINARIOS:<br>
        División Doctrina<br>
        Depto "Depto IV" - <strong><v-icon dark small>mdi-phone</v-icon> 34111</strong><br>
        Campo Militar La Reina
    </v-col> -->
    <!-- <v-col cols="2">
        <v-img 
            src="/dimacoe.png"
            height="90"
            contain
        ></v-img>
    </v-col>
    <v-col 
        cols="4"
        class="black py-4 text-justify white--text"
    >
        OPERACIÓN DEL SISTEMA:<br>
        Dirección de Mando y Control del Ejército<br>
        Depto I "Políticas y Planes" - <strong><v-icon dark small>mdi-phone</v-icon> 32961</strong><br>
        Av Tupper 1725 - Santiago
    </v-col> -->
    <!-- <v-col 
        cols="2"
    >
        <v-img 
            src="/dimacoe.png"
            height="90"
            contain
        ></v-img>
    </v-col> -->
    <!-- <v-col 
        cols="4"
        class="black py-4 text-justify white--text"
    >
        PROCEDIMIENTOS INSTITUCIONALES:<br>
        Dirección de Mando y Control del Ejército<br>
        Depto I "Políticas y Planes" - <strong><v-icon dark small>mdi-phone</v-icon> 32961</strong><br>
        Av Tupper 1725 - Santiago
    </v-col> 
    </v-row> -->
    
    <v-row justify="center">
        
        <v-col cols="12" class="black py-4 text-center white--text">
           <p>
             <v-avatar size="40">
               <v-img 
                src="/logoR2.png"></v-img>
             </v-avatar>
             <strong> REGIMIENTO DE INTELIGENCIA Nº2 "Llaitún" &reg;</strong> - {{new Date().getFullYear()}}
             <!-- <strong>  REGIMIENTO DE INTELIGENCIA Nº2 "Llaitún" &reg;</strong> - {{new Date().getFullYear()}} -->
           </p> 
        </v-col>
        
    </v-row>
    </v-footer>
</template>

<script>

export default {
    name: "footerDimacoe",    
}
</script>