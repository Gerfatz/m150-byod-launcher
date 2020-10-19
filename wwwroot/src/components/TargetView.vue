<template>
    <v-card class="my-3 target-card">
        <v-card-title class="display-1">
            {{target.title}}
        </v-card-title>

        <v-card-text>
            <p class="body-1">{{target.description}}</p>
            <template v-if="isSimpleScriptTarget()">

                <v-alert text border="left" icon="fa-exclamation">
                    <p class="body-2">Verwenden Sie nur die von Ihnen heruntergeladene Datei und geben Sie diese
                        keinesfalls weiter. Die Installationsdatei enthält spezifische und möglicherweise
                        sensible Informationen, welche nur für die Ausführung durch Sie persönlich vorgesehen sind.</p>
                </v-alert>
                <v-row justify="space-around">
                    <v-btn @click="downloadInstaller(target.id)"
                           :loading="isLoading"
                    >
                        <v-icon left small>fa-cloud-download-alt</v-icon>
                        Installationsdatei herunterladen
                    </v-btn>
                </v-row>
            </template>

            <template v-if="isTutorialTarget()">
                <tutorial-target-view :target="target" :steps="tutorialStepsForTarget(target.id)"/>
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
    import {targetApi} from "@/api/targetApi";
    import {mapGetters} from "vuex";
    import {rootIdentifiers} from "@/store/identifiers";

    @Component({
        components: {TutorialTargetView},
        computed: {
            ...mapGetters({
                isLoading: 'isLoading',
            }),
            ...mapGetters('tutorialStep', {
                tutorialStepsForTarget: 'tutorialStepsForTarget',
            })
        }
    })
    export default class TargetView extends Vue {
        @Prop({required: true}) readonly target!: Target;

        public isSimpleScriptTarget() {
            return Object.prototype.hasOwnProperty.call(this.target, 'script');
        }

        public isTutorialTarget() {
            return Object.prototype.hasOwnProperty.call(this.target, 'stepIds')
        }

        public downloadInstaller(targetId: Id) {
            this.$store.dispatch(rootIdentifiers.actions.startLoading);
            targetApi.downloadInstaller(targetId).then(() => {
                this.$store.dispatch(rootIdentifiers.actions.finishLoading);
            });
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