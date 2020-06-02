<template>
    <v-stepper v-show="sortedStages.length > 0"
               :value="stageNumber"
               vertical>
        <template v-for="(stage, index) in sortedStages">
            <v-stepper-step :key="`step-${index}-step`"
                            :step="index+1"
                            :complete="(index+1)<stageNumber"
            >
                {{stage.title}}
            </v-stepper-step>

            <v-stepper-content :key="`step-${index}-content`"
                               :step="index+1"
            >
                <stage-view :stage="stage"
                            :targets="stageTargetsForStage(stage.id)"
                >
                    <template v-slot:participant-target-view="{target}">
                        <slot name="participant-target-view" :target="target"></slot>
                    </template>

                    <template v-slot:directors-stage-view="{stage}">
                        <slot name="directors-stage-view" :stage="stage"></slot>
                    </template>

                    <template v-slot:directors-target-view="{target}">
                        <slot name="directors-target-view" :target="target"></slot>
                    </template>
                </stage-view>
            </v-stepper-content>
        </template>
    </v-stepper>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import StageView from "@/components/StageView.vue";
    import {mapGetters, mapState} from "vuex";

    @Component({
        components: {StageView},
        computed: {
            ...mapGetters('stage', {
                sortedStages: 'sortedStages',
            }),
            ...mapState('attendSession', {
                stageNumber: 'stageNumber',
            }),
            ...mapGetters('stageTarget', {
                stageTargetsForStage: 'stageTargetsForStage',
            }),
        }
    })
    export default class StagesStepper extends Vue {

    }
</script>