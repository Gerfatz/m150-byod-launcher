<template>
    <div class="my-4">
        <v-card>

            <v-card-title>
                <v-text-field v-if="stageTitle.length === 0 || titleFieldHasFocus"
                              v-model="stageTitle"
                              outlined
                              autofocus
                              counter="100"
                              placeholder="Titel der Stufe"
                              :rules="[rules.required, rules.length]"
                              @keypress.enter="(event) => event.target.blur()"
                              @blur="onBlur"
                              @change="onChange"
                />
                <h2 v-else
                    class="title editable-content"
                    @click="titleFieldHasFocus = !titleFieldHasFocus"
                >
                    {{stageTitle}}
                    <v-icon>fa-pencil-alt</v-icon>
                </h2>
            </v-card-title>

            <v-list-item v-for="target of stageTargetsForStage(stage.id)"
                         :key="target.id"
            >
                <v-list-item-icon>
                    <v-img v-if="isScriptTarget(target)"
                           src="@/assets/icons/scriptTarget.svg"
                           max-width="30"
                           max-height="30"
                    />
                    <v-img v-else
                           src="@/assets/icons/tutorialTarget.svg"
                           max-width="30"
                           max-height="30"
                    />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{target.title}}</v-list-item-title>
                    <v-list-item-subtitle>{{target.description}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn icon
                           @click="() => removeStageTarget(target.id)"
                    >
                        <v-icon small color="primary">fa-trash-alt</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>


            <v-card-text class="text-center">
                <add-target-dialog :stage="stage"/>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="text-right">
                <v-btn text
                       @click="$store.dispatch(stageIdentifiers.actions.delete, stage)"
                >
                    <v-icon left small>fa-trash-alt</v-icon>
                    Stufe löschen
                </v-btn>
                <v-spacer/>
                <v-btn icon
                       :disabled="stage.sequenceNumber === 1"
                       @click="$store.dispatch(stageIdentifiers.actions.moveUp, stage.id)"
                >
                    <v-icon small>fa-chevron-up</v-icon>
                </v-btn>
                <v-btn icon
                       :disabled="stage.sequenceNumber === $store.state.stage.stages.length"
                       @click="$store.dispatch(stageIdentifiers.actions.moveDown, stage.id)"
                >
                    <v-icon small>fa-chevron-down</v-icon>
                </v-btn>
            </v-card-actions>

        </v-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Prop} from "vue-property-decorator";
    import {mapGetters} from "vuex";
    import {StageTarget} from "@/models/stageTarget";
    import {Target} from "@/models/target";
    import {Stage} from "@/models/stage";
    import AddTargetDialog from "@/components/AddTargetDialog.vue";
    import {Id} from "@/models/idType";
    import {stageIdentifiers} from '@/store/newModules/stage';
    import {stageTargetIdentifiers} from "@/store/newModules/stageTarget";

    @Component({
            components: {AddTargetDialog},
            computed: {
                ...mapGetters('stageTarget', {
                    stageTargetsForStage: 'stageTargetsForStage'
                }),
            }
        }
    )
    export default class StageEditor extends Vue {
        @Prop() stage!: Stage;
        @Prop({ default: true }) readonly focusTitleFieldOnLoad!: boolean;


        get stageIdentifiers() {
            return stageIdentifiers
        }

        get stageTitle() {
            return this.stage.title;
        }

        set stageTitle(title) {
            this.$store.dispatch(stageIdentifiers.actions.update, {id: this.stage.id, title});
        }

        titleFieldHasFocus = this.focusTitleFieldOnLoad;

        rules = {
            required: (value: string) => !!value || 'Feld darf nicht leer sein',
            length: (value: string) => value.length <= 100 || 'Maximal 100 Zeichen erlaubt'
        };

        onBlur() {
            this.titleFieldHasFocus = this.stageTitle.length === 0 || this.stageTitle.length > 100;
        }

        onChange() {
            this.$store.dispatch(stageIdentifiers.actions.remoteUpdate, this.stage.id);
        }

        removeStageTarget(targetId: Id) {
            const stageTarget = new StageTarget({stageId: this.stage.id, targetId});
            this.$store.dispatch(stageTargetIdentifiers.actions.remove, stageTarget);
        }

        isScriptTarget(target: Target) {
            return Object.prototype.hasOwnProperty.call(target, 'script');
        }
    }
</script>