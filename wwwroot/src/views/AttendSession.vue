<template>
    <div>

        <div v-show="stages.length <= 0">LOADING...</div>

        <div v-show="stages.length > 0" class="text-center">
            <h1 class="display-3 mt-10 mb-2">{{session.title}}</h1>
            <p class="body-1 mb-1">Sie nehmen aktuell an der geführten Einrichtung mit dem Titel <span
                    class="font-weight-bold">{{session.title}}</span> teil.</p>
            <p class="body-1 mb-10">Ihr Anzeigename lautet <span class="font-weight-bold">{{displayName}}</span>.</p>

            <stages-stepper :stages="stages"
                            :targets="targets"
                            :tutorial-steps="tutorialSteps"
                            :stage-number="stageNumber"
            >
                <template v-slot:participant-target-view="{target}">
                    <v-divider class="my-3"/>
                    <v-row v-if="Object.hasOwnProperty.call(target, 'stepIds')"
                           justify="space-around"
                    >
                        <v-btn-toggle v-model="targetResultToggleButton">
                            <v-btn @click="sendTargetResult(target.id, true)"
                                   small outlined color="primary"
                            >
                                Ausführung erfolgreich
                            </v-btn>
                            <v-btn @click="sendTargetResult(target.id, false)"
                                   small outlined color="primary"
                            >
                                Ausführung fehlgeschlagen
                            </v-btn>
                        </v-btn-toggle>
                    </v-row>
                </template>
            </stages-stepper>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {mapGetters, mapState} from "vuex";
    import StagesStepper from "@/components/StagesStepper.vue";
    import {Id} from "@/models/idType";

    @Component({
        components: {StagesStepper},
        computed: {
            ...mapState('attendSession', {
                session: 'session',
                stages: 'stages',
                targets: 'targets',
                tutorialSteps: 'tutorialSteps',
                stageNumber: 'stageNumber',
                displayName: 'displayName'
            }),
            ...mapGetters('attendSession', {
                targetSucceeded: 'targetSucceeded',
                targetFailed: 'targetFailed',
            })
        }
    })
    export default class AttendSession extends Vue {
        targetResultToggleButton = NaN;

        sendTargetResult(targetId: Id, success: boolean) {
            this.$store.dispatch('attendSession/sendTargetResult', {targetId, success});
        }
    }
</script>

<style lang="scss">

    .v-stepper__step__step .v-icon.v-icon {
        font-size: 0.95rem;
    }
    
    .v-stepper__step__step {
        font-size: 0.85rem;
    }
</style>