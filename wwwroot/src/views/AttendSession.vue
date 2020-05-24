<template>
    <div>
        <div v-show="stages.length <= 0">LOADING...</div>

        <stages-stepper v-show="stages.length > 0"
                        :stages="stages"
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
                               small
                        >
                            Ausführung erfolgreich
                        </v-btn>
                        <v-btn @click="sendTargetResult(target.id, false)"
                               small
                        >
                            Ausführung fehlgeschlagen
                        </v-btn>
                    </v-btn-toggle>
                </v-row>
            </template>
        </stages-stepper>
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
                stages: 'stages',
                targets: 'targets',
                tutorialSteps: 'tutorialSteps',
                stageNumber: 'stageNumber',
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