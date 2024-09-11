<template>
    <v-container fluid class="mx-auto">
        <v-row dense>
            <v-col :key="title">
                <v-card :hover="to ? true : false" :to="to ? to : null">
                    <v-card-subtitle class="flex-nowrap overflow-hidden title" :title="title">{{title}}</v-card-subtitle>
                    <v-card-text>
                        <v-img contain :src="src" height="200px"></v-img>
                    </v-card-text>
                    <v-card-subtitle>
                        <span class="float-right">{{ responsable }}</span>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "cardAuditoria",
    props: {
        title: String, 
        src: String, 
        count: Number, 
        to: {
            type: Object,
            default: null,
            required: false,
        },
        responsable: {
            type: String,
            default: null,
            required: false,
        },
    },
    components: {},
    data() {
    return{}
    },
    created() {},
    async mounted() {
    },
    computed: {
        //...mapGetters(["isLoading"])
    },
    methods: {
        //...mapActions(),
    }

}
</script>

<style>
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

</style>