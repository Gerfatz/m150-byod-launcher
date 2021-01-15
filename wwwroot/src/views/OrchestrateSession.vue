<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="display-2 mb-3">{{session.title}}</h1>

                <v-alert text
                         border="left"
                         icon="fa-exclamation"
                >
                    <p class="body-1 mb-0">
                        Sie können mit dem Code <span class="font-weight-bold">{{formattedAccessCode}}</span> an dieser
                        geführten Einrichtung teilnehmen.</p>
                </v-alert>

                <p v-if="Object.entries(participants).length > 0"
                   class="body-1 mt-10 mb-0"
                >
                    Aktuell Teilnehmende an dieser geführten Einrichtung:
                </p>

                <div>
                    <v-chip v-for="[participantId, displayName] in Object.entries(participants)"
                            :key="participantId"
                            class="ma-2"
                    >
                        {{displayName}}
                    </v-chip>
                </div>

                <p v-if="participantsThatNeedHelp.length > 0"
                   class="body-1 mt-10 mb-0"
                >
                    Teilnehmer welche Hilfe benötigen:
                </p>

                <div>
                    <v-chip v-for="(participant, index) in participantsThatNeedHelp"
                            :key="index"
                            class="ma-2"
                    >
                        {{participant}}
                    </v-chip>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <stages-stepper>
                    <template v-slot:directors-stage-view>
                        <v-row justify="space-around"
                               class="py-2"
                        >
                            <v-btn v-if="stageNumber > 1"
                                   @click="$store.dispatch(orchestrateSessionIdentifiers.actions.changeStageNumber, -1)"
                                   small
                            >
                                <v-icon left>fa-caret-up</v-icon>
                                Zur vorherigen Stufe
                            </v-btn>
                            <v-btn v-if="stageNumber < stages.length"
                                   @click="$store.dispatch(orchestrateSessionIdentifiers.actions.changeStageNumber, 1)"
                                   small
                            >
                                Zur nächsten Stufe
                                <v-icon right>fa-caret-down</v-icon>
                            </v-btn>
                        </v-row>
                    </template>

                    <template v-slot:directors-target-view="{target}">
                        <target-results :target-id="target.id"/>
                    </template>
                </stages-stepper>
            </v-col>
        </v-row>

        <v-row v-show="stageNumber === 0">
            <v-col cols="12" class="text-center">
                <v-btn large
                       color="primary"
                       @click="startSession"
                >
                    <v-icon left small>fa-play</v-icon>
                    Geführte Einrichtung starten
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">

    import {Vue, Component} from "vue-property-decorator";
    import StagesStepper from "@/components/StagesStepper.vue";
    import {mapState} from "vuex";
    import TargetResults from "@/components/TargetResults.vue";
    import {orchestrateSessionIdentifiers} from "@/store/newModules/orchestrateSession";

    @Component({
        components: {TargetResults, StagesStepper},
        computed: {
            ...mapState('stage', {
                stages: 'stages',
            }),
            ...mapState('orchestrateSession', {
                participants: 'participants',
                stageNumber: 'stageNumber',
                participantsThatNeedHelp: 'participantsThatNeedHelp'
            })
        }
    })
    export default class OrchestrateSession extends Vue {
        get orchestrateSessionIdentifiers() {
            return orchestrateSessionIdentifiers;
        }

        get session() {
            return this.$store.state.session.session;
        }

        get formattedAccessCode() {
            return this.session.accessCode.substr(0, 3) + "-" + this.session.accessCode.substr(3);
        }

        startSession() {
            this.$store.dispatch(orchestrateSessionIdentifiers.actions.startSession);
        }
    }
</script>
