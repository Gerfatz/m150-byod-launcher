<template>
    <v-card class="my-3 target-card">
        <v-card-title class="display-1">
            {{target.title}}
        </v-card-title>

        <v-card-text>
            <template v-if="isSimpleScriptTarget()">
                <p>Dieser Schritt enthält ein Skript. Laden Sie das Skript herunter und führen Sie es anschliessend
                    aus.</p>
                <v-row justify="space-around">
                    <v-btn @click="downloadScript(target.id)">
                        <v-icon left>fa-cloud-download-alt</v-icon>
                        Skript herunterladen
                    </v-btn>
                </v-row>
            </template>

            <template v-if="isTutorialTarget()">
                <tutorial-target-view :target="target" :steps="tutorialSteps"/>
                <slot name="participant-target-view" :target="target"></slot>
            </template>

            <slot name="directors-target-view" :target="target"></slot>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Target} from "@/models/target";
    import {Id} from "@/models/idType";
    import TutorialTargetView from "@/components/TutorialTargetView.vue";
    import {TutorialStep} from "@/models/tutorialStep";
    import {targetApi} from "@/api/targetApi";

    @Component({
        components: {TutorialTargetView}
    })
    export default class TargetView extends Vue {
        @Prop({required: true}) readonly target!: Target;
        @Prop({required: true}) readonly tutorialSteps!: TutorialStep[];

        public isSimpleScriptTarget() {
            return Object.prototype.hasOwnProperty.call(this.target, 'script');
        }

        public isTutorialTarget() {
            return Object.prototype.hasOwnProperty.call(this.target, 'stepIds')
        }

        public downloadScript(targetId: Id) {
            targetApi.downloadScript(targetId);
        }

    }
</script>

<style lang="scss" scoped>
    .target-card:first-child {
        margin-top: 0 !important;
    }

    .target-card:last-child {
        margin-bottom: 0 !important;
    }
</style>