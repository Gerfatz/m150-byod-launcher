<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-img src="@/assets/images/attendSession.svg"
                       max-height="500"
                       contain
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <h1 class="display-2 mb-3">An geführter Einrichtung teilnehmen</h1>
                <p class="body-1">Die geführte Einrichtung wird in wenigen Sekunden automatisch gestartet. Sie müssen
                    nichts unternehmen.</p>
            </v-col>
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate
                                     color="primary"
                                     size="60"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {signalRIdentifiers} from "@/store/newModules/signalR";

    @Component
    export default class JoinSession extends Vue {
        @Prop({required: true}) readonly participantId!: string;

        mounted() {
            setTimeout(() => {
                this.joinSession();
            }, 2000)
        }

        joinSession() {
            this.$store.dispatch(signalRIdentifiers.actions.joinSessionAsParticipant, this.participantId);
        }
    }

</script>