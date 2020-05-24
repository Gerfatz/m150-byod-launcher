<template>
    <v-container>
        <v-row v-show="stages.length <= 0">
            <v-col cols="12">
                <div>LOADING...</div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <p class="headline">Teilnehmende</p>
                <div>
                    <v-chip v-for="[participantId, displayName] in Object.entries(participants)"
                            :key="participantId"
                            class="ma-2"
                    >
                        {{displayName}}
                    </v-chip>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <stages-stepper v-show="stages.length > 0"
                                :stages="stages"
                                :targets="targets"
                                :tutorial-steps="tutorialSteps"
                                :stage-number="stageNumber"
                >
                    <template v-slot:directors-stage-view>
                        <v-row justify="space-around"
                               class="py-2"
                        >
                            <v-btn @click="$store.dispatch('orchestrateSession/changeStageNumber', -1)"
                                   small
                            >
                                Zum vorherigen Schritt
                            </v-btn>
                            <v-btn @click="$store.dispatch('orchestrateSession/changeStageNumber', 1)"
                                   small
                            >
                                Zum nächsten Schritt
                            </v-btn>
                        </v-row>
                    </template>

                    <template v-slot:directors-target-view="{target}">
                        <target-results :target="target"/>
                    </template>
                </stages-stepper>
            </v-col>
        </v-row>

        <v-row v-show="stageNumber === 0">
            <v-col cols="12" class="text-center">
                <v-btn @click="startSession">Start session</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

    import {Vue, Component} from "vue-property-decorator";
    import StagesStepper from "@/components/StagesStepper.vue";
    import {mapState} from "vuex";
    import TargetResults from "@/components/TargetResults.vue";

    @Component({
        components: {TargetResults, StagesStepper},
        computed: {
            ...mapState('orchestrateSession', {
                stages: 'stages',
                targets: 'targets',
                tutorialSteps: 'tutorialSteps',
                participants: 'participants',
                stageNumber: 'stageNumber',
            })
        }
    })
    export default class OrchestrateSession extends Vue {
        startSession() {
            this.$store.dispatch('orchestrateSession/startSession');
        }
    }
</script>
