<template>
    <div class="mt-5">
        <v-progress-linear :value="successfulExecutionsPercentage(targetId)"
                           :buffer-value="totalExecutionsPercentage(targetId)"
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
    import {mapGetters} from "vuex";
    import {Id} from "@/models/idType";

    @Component({
        computed: {
            ...mapGetters('orchestrateSession', {
                successfulExecutionsPercentage: 'successfulExecutionsPercentage',
                totalExecutionsPercentage: 'totalExecutionsPercentage'
            })
        }
    })
    export default class TargetResults extends Vue {
        @Prop({required: true}) targetId!: Id;
    }
</script>

<style lang="css">
    .v-progress-linear__stream {
        color: #000000 !important;
        caret-color: #000000 !important;
    }
</style>