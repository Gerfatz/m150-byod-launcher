<template>
    <div>
        <v-container>
            <v-form ref="joinSessionForm" @keyup.native.enter="submitForm">
                <v-row class="text-center">
                    <v-col cols="12">
                        <span class="headline">An einer geführten Einrichtung teilnehmen</span>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="accessCode"
                                      class="centered-input"
                                      outlined
                                      v-mask="`###-###`"
                                      @keyup="onKeyUp"
                                      hint="6-stelliger Code"
                                      autofocus
                                      :rules="accessCodeRules"
                        />
                    </v-col>
                    <v-col>
                        <v-slide-y-transition>
                            <v-text-field ref="displayNameField"
                                          v-model="displayName"
                                          v-show="showDisplayNameField"
                                          class="centered-input"
                                          outlined
                                          hint="Geben Sie Ihren Namen ein"
                                          :rules="[v => !!v || 'Dieses Feld darf nicht leer sein.']"
                            >
                                <template v-slot:append>
                                    <v-icon @click="joinSession">fa-chevron-right</v-icon>
                                </template>
                            </v-text-field>
                        </v-slide-y-transition>

                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-card>
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
                            <v-card-title>Geführte Einrichtung</v-card-title>
                            <v-card-text>Lernende können im Klassenverband schrittweise durch die Einrichtung ihrer
                                persönlichen Geräte begleitet werden. Dabei behält die Lehrperson die Kontrolle und den
                                Überblick über den Arbeitsverlauf aller Lernenden.
                            </v-card-text>
                            <v-divider/>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn text small>An Einrichtung teilnehmen</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card>
                            <v-card-title>Individuelle Einrichtung</v-card-title>
                            <v-card-text>In Zukunft wird es mit diesem BYOD Launcher möglich sein, selbständig die
                                Einrichtung des eigenen Geräts für den Einsatz am GIBZ zu planen und durchzuführen. Eine
                                Einrichtung ist dadurch jederzeit und individuell möglich.
                            </v-card-text>
                            <v-divider/>
                            <v-card-actions>
                                <v-spacer/>
                                <v-btn text small>Einrichtung starten</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script lang="ts">

    import Vue from 'vue'
    import {mask} from 'vue-the-mask';
    import Component from "vue-class-component";
    import {Session} from "@/models/session";
    import {sessionApi} from "@/api/sessionApi";
    import {Watch} from "vue-property-decorator";

    @Component({
        directives: {
            mask
        }
    })
    export default class Home extends Vue {
        showDisplayNameField = false;
        invalidAccessCode = false;

        accessCode = '';
        displayName = '';
        sessionToJoin: Session | null = null;

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
                this.showDisplayNameField = false;
            }
        }

        thenHandler(sessions: Session[]) {
            if (sessions.length === 1) {
                this.sessionToJoin = sessions[0];
                this.showDisplayNameField = true;
                this.$nextTick((this.$refs.displayNameField as HTMLInputElement).focus);
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

        submitForm() {
            if ((this.$refs['joinSessionForm'] as HTMLFormElement).validate()) {
                this.joinSession();
            }
        }

        joinSession() {
            const sessionId = this.sessionToJoin?.id;
            const displayName = this.displayName;
            this.$store.dispatch('signalR/joinSession', {sessionId, displayName});
        }
    }

</script>

<style>
    .centered-input input {
        text-align: center;
    }

    .centered-input .v-messages {
        text-align: center;
    }

    .v-messages__message {
        text-align: center;
    }
</style>