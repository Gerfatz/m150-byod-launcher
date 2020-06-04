<template>
    <div class="my-4">
        <v-form v-model="validForm">

            <v-card>
                <v-card-title>
                    <v-text-field v-if="title.length === 0 || titleFieldHasFocus"
                                  v-model="title"
                                  outlined
                                  autofocus
                                  counter="100"
                                  placeholder="Titel für den Tutorial-Schritt"
                                  :rules="[validationRules.required, validationRules.length]"
                                  @blur="onBlur"
                                  @change="onChange"
                    />
                    <h2 v-else
                        class="title editable-content"
                        @click="titleFieldHasFocus = !titleFieldHasFocus"
                    >
                        {{title}}
                        <v-icon>fa-pencil-alt</v-icon>
                    </h2>
                </v-card-title>

                <v-card-text>
                    <p class="body-1">
                        Verwenden Sie den untenstehenden Editor um den Schritt möglichst präzise zu beschreiben.<br/>
                        Möglicherweise ist die Verwendung von Bildern hilfreich für das Verständnis der Erklärungen.
                    </p>
                    <ckeditor :editor="editor" v-model="instruction" :config="editorConfig" @ready="onEditorReady"/>
                    <div class="ck-footer">
                        <p>{{savingStatusMessage(step.id)}}</p>
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="text-right">
                    <v-btn text
                           @click="$store.dispatch(tutorialStepIdentifiers.actions.delete, step)"
                    >
                        <v-icon left small>fa-trash-alt</v-icon>
                        Schritt löschen
                    </v-btn>
                    <v-spacer/>
                    <v-btn icon
                           :disabled="step.sequenceNumber === 1"
                           @click="$store.dispatch(tutorialStepIdentifiers.actions.moveUp, step)"
                    >
                        <v-icon small>fa-chevron-up</v-icon>
                    </v-btn>
                    <v-btn icon
                           :disabled="step.sequenceNumber === $store.state.tutorialStep.tutorialSteps[$store.state.tutorialTarget.newTutorialTarget.id].length"
                           @click="$store.dispatch(tutorialStepIdentifiers.actions.moveDown, step)"
                    >
                        <v-icon small>fa-chevron-down</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>

</template>

<script lang="js">
    import CKEditor from '@ckeditor/ckeditor5-vue';
    import '@ckeditor/ckeditor5-build-classic/build/translations/de'
    import {Vue, Component, Prop} from "vue-property-decorator";
    import {mapGetters} from "vuex";
    import {tutorialStepIdentifiers} from "@/store/newModules/tutorialStep";

    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

    import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
    import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
    import AutoFormat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
    import AutoSave from '@ckeditor/ckeditor5-autosave/src/autosave'
    import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
    import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
    import Heading from '@ckeditor/ckeditor5-heading/src/heading';
    import Indent from '@ckeditor/ckeditor5-indent/src/indent';
    import Image from '@ckeditor/ckeditor5-image/src/image';
    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
    import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
    import Link from '@ckeditor/ckeditor5-link/src/link';
    import List from '@ckeditor/ckeditor5-list/src/list';
    import Table from '@ckeditor/ckeditor5-table/src/table';
    import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
    import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
    import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
    import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
    import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';


    @Component({
        components: {
            ckeditor: CKEditor.component,
        },
        computed: {
            editorConfig() {
                return Object.assign(this.defaultEditorConfig, this.config);
            },
            title: {
                get() {
                    return this.step.title;
                },
                set(title) {
                    const payload = {
                        id: this.step.id,
                        tutorialTargetId: this.step.tutorialTargetId,
                        title
                    }
                    this.$store.dispatch(tutorialStepIdentifiers.actions.update, payload);
                },
            },
            instruction: {
                get() {
                    return this.step.instruction;
                },
                set(instruction) {
                    const payload = {
                        id: this.step.id,
                        tutorialTargetId: this.step.tutorialTargetId,
                        instruction
                    }
                    this.$store.dispatch(tutorialStepIdentifiers.actions.update, payload);
                },
            },
            ...mapGetters('tutorialStep', {
                savingStatusMessage: 'savingStatusMessage',
            })
        }
    })
    export default class TutorialStepEditor extends Vue {
        @Prop() step;
        @Prop() config;

        get tutorialStepIdentifiers() {
            return tutorialStepIdentifiers;
        }

        validForm = false;

        titleFieldHasFocus = true;

        validationRules = {
            required: value => !!value || "Required",
            length: value => value.length <= 100 || "Max 100 characters",
        };

        editor = ClassicEditor;
        defaultEditorConfig = {
            language: 'de',
            plugins: [
                Essentials,
                AutoFormat,
                Bold,
                Italic,
                Heading,
                Indent,
                Image,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageUpload,
                Link,
                List,
                Alignment,
                AutoSave,
                Table,
                TableToolbar,
                TableProperties,
                TableCellProperties,
                Paragraph,
                SimpleUploadAdapter,
            ],
            toolbar: {
                items: [
                    "heading",
                    "|",
                    'bold',
                    'italic',
                    'link',
                    "numberedList",
                    "bulletedList",
                    "|",
                    "indent",
                    "outdent",
                    "|",
                    "alignment",
                    "|",
                    "insertTable",
                    "|",
                    'undo',
                    'redo',
                    "|",
                    "imageUpload",
                ]
            },
            image: {
                toolbar: [
                    'imageStyle:full',
                    'imageStyle:side',
                    '|',
                    'imageTextAlternative'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn', 'tableRow', 'mergeTableCells',
                    'tableProperties', 'tableCellProperties'
                ],

            },
            autosave: {
                waitingTime: 1500,  // in ms
                save: this.autosave,
            },
            simpleUpload: {
                uploadUrl: process.env.VUE_APP_CKEDITOR_IMAGE_UPLOAD_URL,
            }
        };

        onEditorReady(editor) {
            const pendingActions = editor.plugins.get('PendingActions');
            pendingActions.on('change:hasAny', (event, propertyName, newValue) => {
                if (newValue) {
                    this.$store.dispatch(tutorialStepIdentifiers.actions.updateSavingState, {
                        stepId: this.step.id,
                        isSaving: false
                    });
                }
            });
        }

        onBlur() {
            this.titleFieldHasFocus = this.title.length === 0 || this.title.length > 100;
        }

        onChange() {
            this.$store.dispatch(tutorialStepIdentifiers.actions.remoteUpdate, this.getRemoteUpdatePayload());
        }

        autosave() {
            return this.$store.dispatch(tutorialStepIdentifiers.actions.remoteUpdate, this.getRemoteUpdatePayload());
        }

        getRemoteUpdatePayload() {
            return {
                tutorialTargetId: this.step.tutorialTargetId,
                stepId: this.step.id,
            }
        }

    }
</script>

<style scoped>
    .ck-footer {
        background-color: var(--ck-color-toolbar-background);
        border: 1px solid var(--ck-color-toolbar-border);
        border-radius: var(--ck-border-radius);
        border-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        padding: 5px;
    }

    .ck-footer p {
        margin: 0;
        padding: 0;
        text-align: center;
    }
</style>