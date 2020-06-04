<template>
    <v-container>
        <v-form v-model="formIsValid">
            <v-row>
                <v-col>
                    <h1 class="display-3 font-weight-thin my-5">Tutorial erstellen</h1>
                    <p class="body-1">Auf dieser Seite können Sie ein Tutorial erstellen. Dieses Tutorial kann später
                        als einzelner Schritt bei der Erstellung einer geführten Einrichtung hinzugefügt werden.</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-text-field v-if="titleFieldHasFocus"
                                  v-model="title"
                                  ref="title"
                                  outlined
                                  placeholder="Titel des Tutorials"
                                  counter="100"
                                  autofocus
                                  :rules="[validationRules.required, validationRules.length]"
                                  @blur="onBlur('title')"
                                  @change="onChange"
                    />
                    <h1 v-else
                        class="headline editable-content"
                        @click="focusField('title')"
                    >
                        {{title}}
                        <v-icon>fa-pencil-alt</v-icon>
                    </h1>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-textarea v-if="descriptionFieldHasFocus"
                                v-model="description"
                                ref="description"
                                outlined
                                placeholder="Kurze Beschreibung des Tutorials (Ziel, Inhalt, ...)"
                                :rules="[validationRules.required]"
                                @blur="onBlur('description')"
                                @change="onChange"
                    />
                    <p v-else
                       class="body-1 editable-content"
                       @click="focusField('description')"
                    >
                        {{description}}
                        <v-icon small>fa-pencil-alt</v-icon>
                    </p>
                </v-col>
            </v-row>

            <v-row v-if="newTutorialTarget.id === null">
                <v-col class="text-center">
                    <v-btn large
                           :disabled="!formIsValid"
                           @click="createTutorialTarget"
                    >
                        <v-icon left>fa-save</v-icon>
                        Tutorial erstellen
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <v-row>
            <v-col v-if="orderedTutorialSteps.length > 0"
                   cols="12"
            >
                <tutorial-step-editor v-for="step of orderedTutorialSteps"
                                      :key="step.id"
                                      :step="step"
                />
            </v-col>

            <v-col v-if="newTutorialTarget.id"
                   class="text-center"
            >
                <v-btn text
                       @click="addTutorialStep"
                       :loading="isLoading"
                >
                    <v-icon left>fa-plus</v-icon>
                    Schritt hinzufügen
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Vue from 'vue';
    import Component from "vue-class-component";
    import TutorialStepEditor from "@/components/TutorialStepEditor";
    import {mapGetters, mapState} from "vuex";
    import {tutorialTargetIdentifiers} from "@/store/newModules/tutorialTarget";
    import {tutorialStepIdentifiers} from "@/store/newModules/tutorialStep";

    @Component({
        components: {TutorialStepEditor},
        computed: {
            ...mapGetters({
                isLoading: 'isLoading',
            }),
            ...mapState('tutorialTarget', {
                newTutorialTarget: 'newTutorialTarget'
            }),
            ...mapGetters('tutorialStep', {
                // tutorialStep: 'tutorialStep',
                orderedTutorialSteps: 'orderedTutorialSteps',
            }),
            title: {
                get() {
                    return this.$store.state.tutorialTarget.newTutorialTarget.title ?? '';
                },
                set(title) {
                    this.$store.dispatch(tutorialTargetIdentifiers.actions.update, {title})
                },
            },
            description: {
                get() {
                    return this.$store.state.tutorialTarget.newTutorialTarget.description ?? '';
                },
                set(description) {
                    this.$store.dispatch(tutorialTargetIdentifiers.actions.update, {description})
                },
            }
        }
    })
    export default class NewTutorialTarget extends Vue {
        titleFieldHasFocus = true;
        descriptionFieldHasFocus = true;

        formIsValid = false;

        validationRules = {
            required: value => !!value || "Feld darf nicht leer sein",
            length: value => value.length <= 100 || "Maximal 100 Zeichen erlaubt",
        };

        onBlur(fieldName) {
            let hasFocus = this[`${fieldName}`].length === 0;

            if (fieldName === 'title') {
                hasFocus = hasFocus || this[`${fieldName}`].length > 100;
            }

            this[`${fieldName}FieldHasFocus`] = hasFocus;
        }

        focusField(fieldName) {
            this[`${fieldName}FieldHasFocus`] = !this[`${fieldName}FieldHasFocus`];
            this.$nextTick(() => this.$refs[fieldName].focus());
        }

        createTutorialTarget() {
            this.$store.dispatch(tutorialTargetIdentifiers.actions.create);
        }

        onChange() {
            this.$store.dispatch(tutorialTargetIdentifiers.actions.remoteUpdate);
        }

        addTutorialStep() {
            this.$store.dispatch(tutorialStepIdentifiers.actions.add);
        }

    }
</script>