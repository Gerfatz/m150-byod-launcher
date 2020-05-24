<template>
    <div class="mt-5">
        <v-progress-linear :value="successfulExecutionsPercentage(target.id)"
                           :buffer-value="totalExecutionsPercentage(target.id)"
                           :stream="true"
                           height="15"
                           rounded
                           color="#009944"
                           background-color="#cf000f"
        />
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {Target} from "@/models/target";
    import {mapGetters} from "vuex";

    @Component({
        computed: {
            ...mapGetters('orchestrateSession', {
                successfulExecutionsPercentage: 'successfulExecutionsPercentage',
                totalExecutionsPercentage: 'totalExecutionsPercentage'
            })
        }
    })
    export default class TargetResults extends Vue {
        @Prop({required: true}) target!: Target;
    }
</script>

<style lang="css">
    .v-progress-linear__stream {
        color: #000000 !important;
        caret-color: #000000 !important;
    }
</style>