<template>
    <v-container class="py-0">
        <v-row>
            <v-col>
                <template v-for="target in targets">
                    <target-view :key="target.id"
                                 :target="target"
                    >
                        <template v-slot:participant-target-view="{target}">
                            <slot name="participant-target-view" :target="target"></slot>
                        </template>
                        <template v-slot:directors-target-view="{target}">
                            <slot name="directors-target-view" :target="target"></slot>
                        </template>
                    </target-view>
                </template>
            </v-col>
        </v-row>

        <slot name="directors-stage-view" :stage="stage"></slot>

    </v-container>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Stage} from "@/models/stage";
    import TargetView from "@/components/TargetView.vue";
    import {Target} from "@/models/target";

    @Component({
        components: {TargetView},
    })
    export default class StageView extends Vue {
        @Prop({required: true}) readonly stage!: Stage;
        @Prop({required: true}) readonly targets!: Target[];
    }
</script>