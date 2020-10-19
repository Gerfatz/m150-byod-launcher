<template>
    <v-form v-model="syncFormIsValid"
            ref="baseForm"
            @submit.prevent="submit"
    >
        <v-row>
            <v-col cols="12">
                <v-text-field v-if="sessionTitleFieldHasFocus"
                              v-model="sessionTitle"
                              outlined
                              placeholder="Titel für die geführte Einrichtung"
                              counter="100"
                              autofocus
                              :rules="[validationRules.required, validationRules.length]"
                              @keydown.enter="submit"
                              @blur="onBlur('sessionTitle')"
                              @change="updateSessionTitle"
                />
                <div v-else>
                    <p class="overline">Titel der geführten Einrichtung</p>
                    <h2 class="display-1 editable-content"
                        @click="sessionTitleFieldHasFocus = !sessionTitleFieldHasFocus"
                    >
                        {{sessionTitle}}
                        <v-icon>fa-pencil-alt</v-icon>
                    </h2>
                </div>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="6">
                <v-text-field v-if="directorNameFieldHasFocus"
                              ref="directorName"
                              v-model="directorName"
                              label="Name der Lehrperson"
                              counter="100"
                              :rules="[validationRules.required, validationRules.length]"
                              outlined
                              prepend-inner-icon="fa-user"
                              @keydown.enter="submit"
                              @blur="onBlur('directorName')"
                              @change="onDirectorChange"
                />
                <div v-else>
                    <p class="overline">Ihr Name</p>
                    <p class="title editable-content"
                       @click="focusField('directorName')"
                    >
                        {{directorName}}
                        <v-icon small>fa-pencil-alt</v-icon>
                    </p>
                </div>
            </v-col>
            <v-col cols="6">
                <v-text-field v-if="directorEmailFieldHasFocus"
                              ref="directorEmail"
                              v-model="directorEmail"
                              label="E-Mail Adresse der Lehrperson"
                              :rules="[validationRules.required]"
                              outlined
                              prepend-inner-icon="fa-envelope"
                              suffix="@gibz.ch"
                              @keydown.enter="submit"
                              @blur="onBlur('directorEmail')"
                              @change="onDirectorChange"
                />
                <div v-else>
                    <p class="overline">Ihre E-Mail Adresse</p>
                    <p class="title editable-content"
                       @click="focusField('directorEmail')"
                    >
                        {{directorEmail}}
                        <v-icon small>fa-pencil-alt</v-icon>
                    </p>
                </div>
            </v-col>
            <v-col cols="6"
                   v-if="currentAccessCode"
            >
                <p class="overline">Code für Teilnehmende</p>
                <p class="title">
                    {{getCodeString(currentAccessCode)}}
                </p>
            </v-col>
            <v-col cols="6"
                   v-if="currentEditCode"
            >
                <p class="overline">Code für Administration</p>
                <p class="title">
                    {{getCodeString(currentEditCode)}}
                </p>
            </v-col>
            <v-col cols="12"
                   class="text-center"
                   v-show="stages.length >= 1"
            >
                <v-btn large
                       color="primary"
                       @click="$emit('start-session')"
                       :loading="isLoading"
                >
                    <v-icon left small>fa-play</v-icon>
                    Einrichtung starten
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">

    import {Vue, Component, PropSync, Prop} from "vue-property-decorator";
    import {mapGetters, mapState} from "vuex";
    import {mask} from "vue-the-mask";
    import {sessionIdentifiers} from "@/store/newModules/session";
    import {directorIdentifiers} from "@/store/newModules/director";

    type focusFieldType = 'sessionTitleFieldHasFocus' | 'directorNameFieldHasFocus' | 'directorEmailFieldHasFocus';

    @Component({
        directives: {mask},
        computed: {
            ...mapGetters({
                isLoading: 'isLoading',
            }),
            ...mapGetters('session', {
                currentAccessCode: 'currentAccessCode',
                currentEditCode: 'currentEditCode',
            }),
            ...mapState('stage', {
                stages: 'stages'
            })
        }
    })
    export default class SessionForm extends Vue {
        @PropSync('formIsValid', {type: Boolean}) syncFormIsValid!: boolean;
        @Prop({default: true}) readonly defaultDirectorFieldsFocus!: boolean;
        @Prop({ default: true }) readonly focusFieldOnLoad!: boolean;


        directorEmailSuffix = '@gibz.ch';
        formIsValid = false;

        sessionTitleFieldHasFocus = this.focusFieldOnLoad;
        directorNameFieldHasFocus = this.defaultDirectorFieldsFocus;
        directorEmailFieldHasFocus = this.defaultDirectorFieldsFocus;

        get sessionTitle() {
            return this.$store.state.session.session.title ?? '';
        }

        set sessionTitle(title) {
            this.$store.dispatch(sessionIdentifiers.actions.update, {title});
        }

        get directorName() {
            return this.$store.state.director.director.displayName ?? '';
        }

        set directorName(displayName) {
            this.$store.dispatch(directorIdentifiers.actions.update, {displayName});
        }

        get directorEmail() {
            return this.$store.state.director.director.email ?? '';
        }

        set directorEmail(email) {
            this.$store.dispatch(directorIdentifiers.actions.update, {email});
        }

        validationRules = {
            required: (value: string) => !!value || "Feld darf nicht leer sein",
            length: (value: string) => value.length <= 100 || "Maximal 100 Zeichen erlaubt",
        };

        async onBlur(fieldName: 'sessionTitle' | 'directorName' | 'directorEmail') {
            let hasFocus = this[fieldName].length === 0;

            if (fieldName === 'sessionTitle' || fieldName === 'directorName') {
                hasFocus = hasFocus || this[fieldName].length > 100;
            } else if (fieldName === 'directorEmail' && this[fieldName] && !this[fieldName].endsWith(this.directorEmailSuffix)) {
                await this.$store.dispatch(directorIdentifiers.actions.update, {email: this.directorEmail + this.directorEmailSuffix})
            }

            const focusFieldName = (fieldName + "FieldHasFocus") as focusFieldType;
            this[focusFieldName] = hasFocus;
        }

        async focusField(fieldName: string) {
            if (fieldName === 'directorEmail') {
                let email = this.$store.state.director.director.email;
                if (email.endsWith(this.directorEmailSuffix)) {
                    email = email.replace(this.directorEmailSuffix, '');
                    await this.$store.dispatch(directorIdentifiers.actions.update, {email});
                }
            }

            const focusFieldName = (fieldName + "FieldHasFocus") as focusFieldType;

            this[focusFieldName] = !this[focusFieldName];
            this.$nextTick(() => (this.$refs[fieldName] as HTMLInputElement).focus());
        }

        updateSessionTitle() {
            this.$store.dispatch(sessionIdentifiers.actions.remoteUpdate);
        }

        async onDirectorChange() {
            if (this.directorEmail && !this.directorEmail.endsWith(this.directorEmailSuffix)) {
                await this.$store.dispatch(directorIdentifiers.actions.update, {email: this.directorEmail + this.directorEmailSuffix})
            }
            this.$store.dispatch(directorIdentifiers.actions.remoteUpdate);
        }

        getCodeString(code: number) {
            return code.toString().substr(0, 3) + '-' + code.toString().substr(3, 3)
        }

        submit() {
            if ((this.$refs['baseForm'] as HTMLFormElement).validate()) {
                this.sessionTitleFieldHasFocus = false;
                this.directorNameFieldHasFocus = false;
                this.directorEmailFieldHasFocus = false;
                this.$emit('submit-session-form');
            }
        }

    }
</script>