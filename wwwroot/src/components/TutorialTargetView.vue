<template>
    <v-carousel v-model="carouselIndex"
                :hide-delimiters="true"
                :show-arrows="false"
                :continuous="false"
                height="auto"
    >
        <v-carousel-item v-for="step in steps"
                         :key="step.id"
        >
            <p class="title">{{step.title}}</p>
            <div class="content-div">
            <div v-html="step.instruction"
                 class="ck-content image-fit"
            />
            </div>
            <v-divider light/>
            <v-row class="controls"
                   align="center"
                   justify="space-around"
            >
                <v-col cols="3"
                       class="text-center"
                >
                    <v-btn v-show="carouselIndex > 0"
                           @click="carouselIndex--"
                           block
                           small
                           outlined
                           light
                    >
                        <v-icon left x-small>fa-chevron-left</v-icon>
                        zurück
                    </v-btn>
                </v-col>
                <v-col cols="3"
                       class="text-center"
                >
                    <v-chip light class="font-weight-bold">{{carouselIndex+1}} / {{steps.length}}</v-chip>
                </v-col>
                <v-col cols="3"
                       class="text-center"
                >
                    <v-btn v-show="carouselIndex < steps.length - 1"
                           @click="carouselIndex++"
                           block
                           small
                           outlined
                           light
                    >
                        weiter
                        <v-icon right x-small>fa-chevron-right</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-carousel-item>
    </v-carousel>
</template>

<script lang="ts">

    import {Vue, Component, Prop} from "vue-property-decorator";
    import {TutorialTarget} from "@/models/tutorialTarget";
    import {TutorialStep} from "@/models/tutorialStep";

    @Component({})
    export default class TutorialTargetView extends Vue {
        @Prop({required: true}) target!: TutorialTarget;
        @Prop({required: true}) steps!: TutorialStep[];

        carouselIndex = 0;
    }

</script>

<style scoped>
    .content-div {
        height: 550px;
        width: 100%;
    }

    .image-fit{
        height: 100%;
        width: 100%;
        object-fit: contain;
    }
</style>