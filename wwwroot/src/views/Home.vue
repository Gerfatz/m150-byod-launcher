<template>
    <v-container>

        <header>
            <v-img src="@/assets/images/titleImage.svg" contain min-height="200"></v-img>

            <h1 class="display-4 font-weight-thin text-center">BYOD Launcher</h1>
            <p class="subtitle-1 text-center">Der BYOD Launcher unterstützt Sie bei der Einrichtung Ihres persönlichen
                Geräts für die Nutzung am GIBZ.</p>
        </header>

        <v-divider class="divider-with-space"/>

        <section>
            <v-form ref="joinSessionForm" @submit.stop.prevent="validateJoinSessionForm">
                <v-row class="text-center" justify="center">
                    <v-col cols="12">
                        <h2 class="display-2 font-weight-thin my-5">An einer geführten Einrichtung teilnehmen</h2>
                        <p class="body-1 mx-12 px-12">Sie können an einer geführten Einrichtung teilnehmen, um Ihr
                            persönliches Gerät unter der Anleitung Ihrer Lehrperson für den Einsatz im Unterricht
                            vorzubereiten.</p>
                        <p class="body-1 mx-12 px-12">Die Lehrperson wird Ihnen für die Teilnahme an der geführten
                            Einrichtung einen 6-stelligen Code mitteilen. Geben Sie diesen Code in das nachfolgende
                            Eingabefeld ein.</p>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field ref="accessCodeField"
                                      v-model="accessCode"
                                      class="centered-input font-weight-thin accessCode-input"
                                      outlined
                                      v-mask="`###-###`"
                                      @keyup="onKeyUp"
                                      hint="6-stelliger Code"
                                      autofocus
                                      placeholder="XXX-XXX"
                                      :rules="accessCodeRules"
                        />
                    </v-col>
                </v-row>
            </v-form>
        </section>

        <v-divider class="divider-with-space"/>

        <v-dialog v-model="showJoinDialog"
                  max-width="600"
        >
            <v-card>
                <v-card-title>
                    <h3 class="display-1 mt-5 primary--text">Teilnahme an geführter Einrichtung</h3>
                </v-card-title>
                <v-card-text>
                    <v-form ref="personalDataForm"
                            v-model="validPersonalData"
                            @submit.prevent="submitPersonalDataForm"
                    >
                        <v-row>
                            <v-col cols="12">
                                <p class="body-2">Sie sind auf gutem Weg! Geben Sie Ihren Namen ins untenstehende Feld
                                    ein, damit Ihr Fortschritt während der geführten Einrichtung erkennbar ist.
                                </p>
                                <v-text-field ref="displayNameField"
                                              v-model="displayName"
                                              autofocus
                                              outlined
                                              label="Anzeigename"
                                              hint="Geben Sie Ihren Namen ein"
                                              :rules="[v => !!v || 'Dieses Feld darf nicht leer sein.']"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <v-row v-if="sessionToJoin != null && sessionToJoin.requiresCredentials">
                            <v-col cols="12">
                                <v-alert text border="left" icon="fa-exclamation">
                                    <h3 class="title">Persönliche Zugangsdaten</h3>
                                    <p class="body-2">Im Rahmen dieser Einrichtung werden Ihre persönlichen Zugangsdaten
                                        benötigt.
                                        Um
                                        Sie bei der automatisierten Einrichtung Ihres Geräts bestmöglich unterstützen zu
                                        können,
                                        müssen
                                        Sie diese Zugangsdaten in den nachfolgenden Feldern eingeben.</p>
                                    <p class="body-2">Ihre persönlichen Zugangsdaten werden vertraulich behandelt und
                                        lediglich
                                        temporär
                                        für die Einrichtung Ihres Geräts gespeichert. Sobald die entsprechende
                                        Einrichtung
                                        abgeschlossen
                                        ist, werden wie Zugangsdaten unwiederruflich vom Server gelöscht.</p>
                                </v-alert>
                            </v-col>

                            <v-col cols="6">
                                <v-text-field v-model="username"
                                              outlined
                                              dense
                                              label="Benutzername"
                                              :rules="[v => !!v || 'Dieses Feld darf nicht leer sein']"
                                />
                            </v-col>

                            <v-col cols="6">
                                <v-text-field v-model="password"
                                              outlined
                                              dense
                                              label="Passwort"
                                              :rules="[v => !!v || 'Dieses Feld darf nicht leer sein']"
                                              :type="showPassword ? 'text' : 'password'"
                                >
                                    <template v-slot:append>
                                        <v-icon @click="showPassword = !showPassword">
                                            {{showPassword ? 'fa-eye' : 'fa-eye-slash'}}
                                        </v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="showJoinDialog = false"
                           text
                    >
                        Abbrechen
                    </v-btn>
                    <v-btn @click="joinSession"
                           text
                    >
                        Einrichtung starten
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-card>
                    <v-img src="@/assets/images/configureSession.svg" height="180" contain/>
                    <v-card-title>Einrichtung planen</v-card-title>
                    <v-card-text>Lehrpersonen können mit dem BYOD Launcher die Einrichtung persönlicher Geräte
                        planen. Dazu können verschiedene Aspekte der Einrichtung gezielt ausgewählt und für
                        verschiedene Bedürfnisse vorbereitet werden.
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text small :to="{name: 'new session'}">Einrichtung planen</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card>
                    <v-img src="@/assets/images/attendSession.svg" height="180" contain/>
                    <v-card-title>Geführte Einrichtung</v-card-title>
                    <v-card-text>Lernende können im Klassenverband schrittweise durch die Einrichtung ihrer
                        persönlichen Geräte begleitet werden. Dabei behält die Lehrperson die Kontrolle und den
                        Überblick über den Arbeitsverlauf aller Lernenden.
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text small @click="joinGuidedSession">An Einrichtung teilnehmen</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card>
                    <v-img src="@/assets/images/individualSetup.svg" height="180" contain/>
                    <v-card-title>Individuelle Einrichtung</v-card-title>
                    <v-card-text>In Zukunft wird es mit diesem BYOD Launcher möglich sein, selbständig die
                        Einrichtung des eigenen Geräts für den Einsatz am GIBZ zu planen und durchzuführen. Eine
                        Einrichtung ist dadurch jederzeit und individuell möglich.
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text small @click="startPersonalSession">Einrichtung starten</v-btn>
                    </v-card-actions>
                </v-card>

                <v-dialog v-model="personalSessionDialog"
                          width="450"
                >
                    <v-card>
                        <v-card-title class="headline">Etwas Geduld noch</v-card-title>
                        <v-card-text>
                            Haben Sie bitte noch etwas Geduld. Dieses Feature wird voraussichtlich im Verlauf des
                            Schuljahres 2020/2021 verfügbar sein.
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="personalSessionDialog=false;">OK, ich bin geduldig</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {mask} from 'vue-the-mask';
    import {Session} from "@/models/session";
    import {sessionApi} from "@/api/sessionApi";
    import {Vue, Component, Watch} from "vue-property-decorator";
    import {participantApi} from "@/api/participantApi";
    import {ParticipantCreationObject} from "@/models/types";

    @Component({
        directives: {
            mask
        }
    })
    export default class Home extends Vue {
        showJoinDialog = false;
        invalidAccessCode = false;

        accessCode = '';
        displayName = '';
        sessionToJoin: Session | null = null;

        validPersonalData = false;
        personalSessionDialog = false;
        showCredentialsForm = false;
        username = '';
        password = '';
        showPassword = false;

        @Watch('sessionToJoin')
        onSessionToJoinChange(newValue: Session) {
            if (newValue.requiresCredentials) {
                this.showCredentialsForm = true;
            }
        }

        accessCodeRules = [
            (value: string) => {
                if (this.getRawValue(value).length < 6) {
                    return true;
                }

                if (!this.isAccessCodeValid()) {
                    return 'Der eingegebene Code ist ungültig!';
                }

                return true;
            },
        ];

        @Watch('invalidAccessCode')
        onInvalidAccessCodeChanged() {
            (this.$refs['joinSessionForm'] as HTMLFormElement).validate()
        }

        isAccessCodeValid() {
            return !this.invalidAccessCode;
        }

        onKeyUp() {
            const accessCode = this.getRawValue(this.accessCode);
            if (accessCode.length === 6) {
                sessionApi.getByAccessCode(accessCode)
                    .then(this.thenHandler);
            } else {
                this.invalidAccessCode = false;
                this.showJoinDialog = false;
            }
        }

        thenHandler(sessions: Session[]) {
            if (sessions.length === 1) {
                this.sessionToJoin = sessions[0];
                this.showJoinDialog = true;
            } else {
                this.invalidAccessCode = true;
                this.$nextTick(() => {
                    (this.$refs['joinSessionForm'] as HTMLFormElement).validate();
                });
            }
        }

        getRawValue(maskedValue: string) {
            return maskedValue.split('-').join('');
        }

        validateJoinSessionForm() {
            (this.$refs['joinSessionForm'] as HTMLFormElement).validate();
        }

        submitPersonalDataForm() {
            if ((this.$refs['personalDataForm'] as HTMLFormElement).validate()) {
                this.joinSession();
            }
        }

        joinSession() {
            if (this.sessionToJoin != null) {
                const participantData = {
                    displayName: this.displayName,
                    username: this.username,
                    password: this.password
                } as ParticipantCreationObject;

                participantApi.createParticipant((this.sessionToJoin.id as string), participantData)
                    .then(joinUrl => {
                        window.location.assign(joinUrl);
                    });
            }
        }

        joinGuidedSession() {
            this.$nextTick((this.$refs.accessCodeField as HTMLInputElement).focus);
        }

        startPersonalSession() {
            this.personalSessionDialog = true;
        }
    }

</script>

<style lang="scss">
    .centered-input {
        input {
            text-align: center;
        }

        &.accessCode-input {
            input {
                font-size: 60px;
                max-height: none;
            }

            .v-text-field__details {
                font-weight: normal;
            }
        }

        .v-messages__message {
            text-align: center;
        }
    }

    .centered-input .v-messages {
        text-align: center;
    }


    .divider-with-space {
        margin: 70px 0;
    }
</style>