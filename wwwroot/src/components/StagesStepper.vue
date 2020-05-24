<template>
    <v-stepper v-show="stages.length > 0"
               :value="stageNumber"
               vertical>
        <template v-for="(stage, index) in stages">
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
                            :targets="targets[stage.id]"
                            :tutorial-steps="tutorialSteps"
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
    import {Vue, Component, Prop} from "vue-property-decorator";
    import StageView from "@/components/StageView.vue";
    import {Stage} from "@/models/stage";
    import {Target} from "@/models/target";
    import {TutorialStep} from "@/models/tutorialStep";

    @Component({
        components: {StageView},
    })
    export default class StagesStepper extends Vue {
        @Prop({required: true}) readonly stages!: Stage[];
        @Prop({required: true}) readonly targets!: { [key: string]: Target[] };
        @Prop({required: true}) readonly tutorialSteps!: { [key: string]: TutorialStep[] };
        @Prop({required: true}) readonly stageNumber!: number;
    }
</script>