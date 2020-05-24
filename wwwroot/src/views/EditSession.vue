<template>
    <div>
        <div>Edit session with code: {{editCode}}</div>
        <v-btn @click="startSession">Start session</v-btn>
    </div>
</template>

<script lang="ts">

    import {Vue, Component, Prop} from "vue-property-decorator";
    import {sessionApi} from "@/api/sessionApi";

    @Component
    export default class EditSession extends Vue {
        @Prop({required: false, default: ''}) editCode!: string;

        startSession() {
            sessionApi.getByEditCode(this.editCode)
                .then(session => {
                    this.$store.dispatch('signalR/startSession', session.id);
                });
            // this.$router.push({name: 'orchestrate session'});
        }
    }
</script>