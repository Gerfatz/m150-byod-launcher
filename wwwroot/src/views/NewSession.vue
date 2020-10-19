<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="display-3 font-weight-thin my-5">Geführte Einrichtung planen</h1>
                <p class="body-1">Planen Sie eine schrittweise geführte Einrichtung. Mit der sorgfältig geplante
                    Einrichtung können Sie Ihre Lernenden bei der Einrichtung derer persönlichen Geräte optimal
                    unterstützen.</p>
                <p class="body-1">Eine geführte Einrichtung besteht aus mehreren Stufen. Jede Stufe kann wiederum
                    mehrere Schritte enthalten. Während der geführten Einrichtung können Sie die Lernenden durch die
                    einzelnen Stufen begleiten - die Lernenden können nicht selbständig zwischen den Stufen vor und
                    zurück springen. Innerhalb einer Stufe können die Lernenden alle Schritte selbständig und in
                    beliebiger Reihenfolge aussühren.</p>
            </v-col>
        </v-row>

        <session-form :form-is-valid.sync="formIsValid"
                      @start-session="startSession"
                      @submit-session-form="createDirectorAndSession"
        />

        <v-row v-if="session.id === null">
            <v-col class="text-center">
                <v-btn :disabled="!formIsValid"
                       color="primary"
                       large
                       @click="createDirectorAndSession"
                       :loading="isLoading"
                >
                    <v-icon left>fa-save</v-icon>
                    Geführte Einrichtung erstellen
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-if="sortedStages.length > 0"
                   cols="12"
            >
                <stage-editor v-for="stage of sortedStages"
                              :key="stage.id"
                              :stage="stage"/>
            </v-col>

            <v-col v-if="session.id"
                   class="text-center"
            >
                <v-btn text @click="addStage">
                    <v-icon left>fa-plus</v-icon>
                    Stufe hinzufügen
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapGetters} from "vuex";
    import Component from 'vue-class-component'
    import StageEditor from "@/components/StageEditor.vue";
    import SessionForm from "@/components/SessionForm.vue";
    import {directorIdentifiers} from "@/store/newModules/director";
    import {sessionIdentifiers} from "@/store/newModules/session";
    import {targetIdentifiers} from "@/store/newModules/target";
    import {stageIdentifiers} from "@/store/newModules/stage";
    import {signalRIdentifiers} from "@/store/newModules/signalR";

    @Component({
        components: {SessionForm, StageEditor},
        computed: {
            ...mapGetters({
                isLoading: 'isLoading',
            }),
            ...mapGetters('stage', {
                sortedStages: 'sortedStages',
            }),
        }
    })
    export default class NewSession extends Vue {

        formIsValid = false;

        get session() {
            return this.$store.state.session.session;
        }
        
        created() {
            window.addEventListener('beforeunload', this.preventTabClose);
        }

        preventTabClose(event: BeforeUnloadEvent) {
            event.preventDefault();
            event.returnValue = "";
            return "";
        }

        createDirectorAndSession() {
            if (this.formIsValid) {
                this.$store.dispatch(directorIdentifiers.actions.create, this.$store.state.director.director)
                    .then(() => {
                        const session = this.$store.state.session.session;
                        session.directorId = this.$store.state.director.director.id;
                        this.$store.dispatch(sessionIdentifiers.actions.create, session);
                    })
                    .then(() => {
                        this.$store.dispatch(targetIdentifiers.actions.load);
                    });
            }
        }

        addStage() {
            this.$store.dispatch(stageIdentifiers.actions.add);
        }

        startSession() {
            this.$store.dispatch(signalRIdentifiers.actions.startSession, this.session.id);
        }

    }
</script>