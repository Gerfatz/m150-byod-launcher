<template>
    <v-form v-model="syncFormIsValid" ref="baseForm">

        <v-row>
            <v-col cols="12">
                <v-text-field v-if="sessionTitleFieldHasFocus"
                              v-model="sessionTitle"
                              outlined
                              placeholder="Titel für die neue Tour"
                              counter="100"
                              autofocus
                              :rules="[validationRules.required, validationRules.length]"
                              @blur="onBlur('sessionTitle')"
                              @change="updateSessionTitle"
                />
                <h1 v-else
                    class="headline editable-content"
                    @click="sessionTitleFieldHasFocus = !sessionTitleFieldHasFocus"
                >
                    {{sessionTitle}}
                    <v-icon>fa-pencil-alt</v-icon>
                </h1>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="5">
                <v-text-field v-if="directorNameFieldHasFocus"
                              ref="directorName"
                              v-model="directorName"
                              label="Name des Tour-Guides"
                              counter="100"
                              :rules="[validationRules.required, validationRules.length]"
                              prepend-inner-icon="fa-user"
                              @blur="onBlur('directorName')"
                              @change="onDirectorChange"
                />
                <p v-else
                   class="subtitle-1 editable-content"
                   @click="focusField('directorName')"
                >
                    <v-icon left>fa-user</v-icon>
                    {{directorName}}
                    <v-icon small>fa-pencil-alt</v-icon>
                </p>
            </v-col>
            <v-col cols="5">
                <v-text-field v-if="directorEmailFieldHasFocus"
                              ref="directorEmail"
                              v-model="directorEmail"
                              label="E-Mail Adresse des Tour-Guides"
                              :rules="[validationRules.required]"
                              prepend-inner-icon="fa-envelope"
                              @blur="onBlur('directorEmail')"
                              @change="onDirectorChange"
                />
                <p v-else
                   class="subtitle-1 editable-content"
                   @click="focusField('directorEmail')"
                >
                    <v-icon left>fa-envelope</v-icon>
                    {{directorEmail}}
                    <v-icon small>fa-pencil-alt</v-icon>
                </p>
            </v-col>
            <v-col cols="5">

                <v-text-field v-if="currentAccessCode"
                              label="Code für Teilnehmende"
                              :value="currentAccessCode"
                              v-mask="'###-###'"
                              prepend-inner-icon="fa-door-open"
                              readonly
                              outlined
                />
            </v-col>
            <v-col cols="5">
                <v-text-field v-if="currentEditCode"
                              label="Code für die Bearbeitung"
                              :value="currentEditCode"
                              v-mask="'###-###'"
                              prepend-inner-icon="fa-lock"
                              readonly
                              outlined
                />
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">

    import {Vue, Component, PropSync} from "vue-property-decorator";
    import {mapGetters} from "vuex";
    import {mask} from "vue-the-mask";

    type focusFieldType = 'sessionTitleFieldHasFocus' | 'directorNameFieldHasFocus' | 'directorEmailFieldHasFocus';

    @Component({
        directives: {mask},
        computed: {
            ...mapGetters('session', {
                currentAccessCode: 'currentAccessCode',
                currentEditCode: 'currentEditCode',
            }),
            // ...mapGetters('director', {
            //     displayName: 'displayName',
            //     email: 'email'
            // }),

        }
    })
    export default class SessionForm extends Vue {
        @PropSync('formIsValid', {type: Boolean}) syncFormIsValid!: boolean;

        formIsValid = false;

        sessionTitleFieldHasFocus = true;
        directorNameFieldHasFocus = true;
        directorEmailFieldHasFocus = true;

        get sessionTitle() {
            return this.$store.state.session.activeSession.title ?? '';
        }

        set sessionTitle(title) {
            this.$store.dispatch('session/update', {title});
        }

        get directorName() {
            return this.$store.state.director.activeDirector.displayName ?? '';
        }

        set directorName(displayName) {
            this.$store.dispatch('director/update', {displayName});
        }

        get directorEmail() {
            return this.$store.state.director.activeDirector.email ?? '';
        }

        set directorEmail(email) {
            this.$store.dispatch('director/update', {email});
        }

        validationRules = {
            required: (value: string) => !!value || "Feld darf nicht leer sein",
            length: (value: string) => value.length <= 100 || "Maximal 100 Zeichen erlaubt",
        };

        onBlur(fieldName: 'sessionTitle' | 'directorName' | 'directorEmail') {
            let hasFocus = this[fieldName].length === 0;

            if (fieldName === 'sessionTitle' || fieldName === 'directorName') {
                hasFocus = hasFocus || this[fieldName].length > 100;
            }

            const focusFieldName = (fieldName + "FieldHasFocus") as focusFieldType;
            this[focusFieldName] = hasFocus;
        }

        focusField(fieldName: string) {
            const focusFieldName = (fieldName + "FieldHasFocus") as focusFieldType;

            this[focusFieldName] = !this[focusFieldName];
            this.$nextTick(() => (this.$refs[fieldName] as HTMLInputElement).focus());
        }

        updateSessionTitle() {
            this.$store.dispatch('session/remoteUpdate');
        }

        onDirectorChange() {
            this.$store.dispatch('director/remoteUpdate');
        }

    }
</script>