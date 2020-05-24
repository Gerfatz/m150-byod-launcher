<template>
    <v-container>
        <v-form v-model="formIsValid">
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

            <v-row v-if="activeTutorialTarget.id === null">
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
            <v-col v-if="activeTutorialTarget.stepIds.length > 0"
                   cols="12"
            >
                <tutorial-step-editor v-for="step of orderedTutorialSteps"
                                      :key="step.id"
                                      :step="step"
                />
            </v-col>

            <v-col v-if="activeTutorialTarget.id"
                   class="text-right"
            >
                <v-btn text @click="addTutorialStep">
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

    @Component({
        components: {TutorialStepEditor},
        computed: {
            ...mapState('tutorialTarget', {
                activeTutorialTarget: 'activeTutorialTarget'
            }),
            ...mapGetters('tutorialStep', {
                tutorialStep: 'tutorialStep',
                orderedTutorialSteps: 'orderedTutorialSteps',
            }),
            title: {
                get() {
                    return this.$store.state.tutorialTarget.activeTutorialTarget.title ?? '';
                },
                set(title) {
                    this.$store.dispatch('tutorialTarget/update', {title})
                },
            },
            description: {
                get() {
                    return this.$store.state.tutorialTarget.activeTutorialTarget.description ?? '';
                },
                set(description) {
                    this.$store.dispatch('tutorialTarget/update', {description})
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
            this.$store.dispatch('tutorialTarget/create');
        }

        onChange() {
            this.$store.dispatch('tutorialTarget/remoteUpdate',);
        }

        addTutorialStep() {
            this.$store.dispatch('tutorialStep/addTutorialStep');
        }

    }
</script>