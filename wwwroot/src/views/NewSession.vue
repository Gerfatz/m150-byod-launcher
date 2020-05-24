<template>
    <v-container>

        <session-form :form-is-valid.sync="formIsValid"/>

        <v-row v-if="activeSession.id === null">
            <v-col class="text-center">
                <v-btn :disabled="!formIsValid"
                       large
                       @click="createDirectorAndSession"
                >
                    <v-icon left>fa-save</v-icon>
                    Tour erstellen
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-if="sortedStages.length > 0"
                   cols="12"
            >
                <stage-component v-for="stage of sortedStages"
                                 :key="stage.id"
                                 :stage="stage"/>
            </v-col>

            <v-col v-if="activeSession.id"
                   class="text-right"
            >
                <v-btn text @click="addStage">
                    <v-icon left>fa-plus</v-icon>
                    Stufe hinzufügen
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters, mapState} from "vuex";
    import Component from 'vue-class-component'
    import StageComponent from "@/components/StageEditor";
    import SessionForm from "@/components/SessionForm";

    @Component({
        components: {SessionForm, StageComponent},
        computed: {
            ...mapState('session', {
                activeSession: 'activeSession'
            }),
            ...mapGetters('stage', {
                sortedStages: 'sortedStages',
            }),
        }
    })
    export default class NewSession extends Vue {


        formIsValid = false;

        createDirectorAndSession() {
            if (this.formIsValid) {
                this.$store.dispatch('session/createAlongNewDirector')
                    .then(() => {
                        this.$store.dispatch('target/loadAvailableTargets');
                    });
            }
        }

        addStage() {
            this.$store.dispatch('stage/addStage');
        }

    }
</script>