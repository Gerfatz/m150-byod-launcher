<template>
    <v-container>
        <v-fade-transition>
            <div v-show="!showEditForm">
                <v-row>
                    <v-col cols="12">
                        <v-img src="@/assets/images/configureSession.svg"
                               max-height="500"
                               contain
                        />
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="12" class="text-center">
                        <h1 class="display-2 mb-3">Geführte Einrichtung verwalten</h1>
                        <p class="body-1">Auf dieser Seite können Sie eine geführte Einrichtung verwalten, die Sie zuvor
                            erstellt haben. Geben Sie den 6-stelligen Administrations-Code ins nachfolgende Eingabefeld
                            ein um die vorbereitete Einrichtung zu laden.</p>
                    </v-col>
                    <v-col cols="5">
                        <v-form v-model="editCodeForm" ref="editCodeForm">
                            <v-text-field ref="editCodeField"
                                          v-model="editCode"
                                          class="centered-input font-weight-thin accessCode-input"
                                          outlined
                                          v-mask="`###-###`"
                                          @keyup="onKeyUp"
                                          hint="6-stelliger Code"
                                          autofocus
                                          placeholder="XXX-XXX"
                                          :rules="editCodeRules"
                            />
                        </v-form>
                    </v-col>
                </v-row>
            </div>
        </v-fade-transition>

        <v-fade-transition v-if="showEditForm">
            <div v-show="session !== null">
                <v-row>
                    <v-col cols="12">
                        <h1 class="display-3 text-center">{{session.title}}</h1>
                    </v-col>
                    <v-col cols="12">
                        <session-form :default-director-fields-focus="false"
                                      @start-session="startSession"
                                      :focus-field-on-load="false"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col v-if="sortedStages.length > 0"
                           cols="12"
                    >
                        <stage-editor v-for="stage of sortedStages"
                                      :key="stage.id"
                                      :stage="stage"
                                      :focus-title-field-on-load="false"
                        />
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
            </div>
        </v-fade-transition>


    </v-container>
</template>

<script lang="ts">

    import {Vue, Component, Watch} from "vue-property-decorator";
    import {mask} from 'vue-the-mask';
    import {Session} from "@/models/session";
    import SessionForm from "@/components/SessionForm.vue";
    import StageEditor from "@/components/StageEditor.vue";
    import {mapGetters} from "vuex";
    import {sessionIdentifiers} from "@/store/newModules/session";
    import {targetIdentifiers} from "@/store/newModules/target";
    import {signalRIdentifiers} from "@/store/newModules/signalR";
    import {stageIdentifiers} from "@/store/newModules/stage";

    @Component({
        components: {SessionForm, StageEditor},
        directives: {
            mask
        },
        computed: {
            ...mapGetters('stage', {
                sortedStages: 'sortedStages',
            }),
        }
    })
    export default class EditSession extends Vue {

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

        showEditForm = false;

        editCodeForm = true;
        editCode = '';

        invalidEditCode = false;

        editCodeRules = [
            (value: string) => {
                if (this.getRawValue(value).length < 6) {
                    return true;
                }

                if (!this.isEditCodeValid()) {
                    return 'Der eingegebene Code ist ungültig!';
                }

                return true;
            },
        ];

        @Watch('invalidEditCode')
        onInvalidEditCodeChange() {
            (this.$refs['editCodeForm'] as HTMLFormElement).validate()
        }

        isEditCodeValid() {
            return !this.invalidEditCode;
        }

        async onKeyUp() {
            const editCode = this.getRawValue(this.editCode);
            if (editCode.length === 6) {
                await this.$store.dispatch(sessionIdentifiers.actions.loadByEditCode, editCode)
                    .then(this.thenHandler);
            } else {
                this.invalidEditCode = false;
            }
        }

        getRawValue(maskedValue: string) {
            return maskedValue.split('-').join('');
        }

        thenHandler(session: Session | null) {
            if (!session) {
                this.invalidEditCode = true;
                this.$nextTick(() => {
                    (this.$refs['editCodeForm'] as HTMLFormElement).validate();
                });
            } else {
                this.showEditForm = true;
                this.$store.dispatch(sessionIdentifiers.actions.downloadAllData, session.id)
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