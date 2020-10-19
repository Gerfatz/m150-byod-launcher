<template>
    <v-dialog
            v-model="showDialog"
            width="700"
    >
        <template v-slot:activator="{ on }">
            <v-btn small
                   text
                   v-on="on"
            >
                <v-icon left x-small>fa-plus</v-icon>
                Schritt hinzufügen
            </v-btn>
        </template>

        <v-card>
            <v-card-title>
                <h3 class="display-1 mt-5 primary--text">Schritt hinzufügen</h3>
            </v-card-title>

            <v-card-text>
                <p class="body-2">Wählen Sie Schritte aus, um diese zur aktuellen Stufe hinzuzufügen.</p>
            </v-card-text>

            <v-card-text>
                <v-list flat>
                    <v-list-item-group v-model="selectedTargets" multiple>
                        <v-list-item three-line
                                     v-for="target in availableStageTargetsForStage(stage.id)"
                                     :key="target.id"
                                     :value="target.id">
                            <template v-slot:default="{active, toggle}">
                                <v-list-item-action>
                                    <v-checkbox :input-value="active"
                                                :true-value="target.id"
                                                @click="toggle"
                                    ></v-checkbox>
                                </v-list-item-action>

                                <v-list-item-content>
                                    <v-list-item-title>{{target.title}}</v-list-item-title>
                                    <v-list-item-subtitle>{{target.description}}</v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-icon>
                                    <v-img v-if="isScriptTarget(target)"
                                           src="@/assets/icons/scriptTarget.svg"
                                           max-width="30"
                                           max-height="30"
                                    />
                                    <v-img v-if="isTutorialTarget(target)"
                                           src="@/assets/icons/tutorialTarget.svg"
                                           max-width="30"
                                           max-height="30"
                                    />
                                </v-list-item-icon>
                            </template>

                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text
                       @click="confirm"
                       :disabled="selectedTargets.length === 0"
                       :loading="isLoading"
                >
                    <span v-if="selectedTargets.length < 2">Schritt hinzufügen</span>
                    <span v-else>{{selectedTargets.length}} Schritte hinzufügen</span>
                </v-btn>

                <v-btn text
                       @click="showDialog = false"
                >
                    Abbrechen
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {mapGetters} from "vuex";
    import {Prop} from "vue-property-decorator";
    import {StageTarget} from "@/models/stageTarget";
    import {Target} from "@/models/target";
    import {Stage} from "@/models/stage";
    import {stageTargetIdentifiers} from "@/store/newModules/stageTarget";

    @Component({
        computed: {
            ...mapGetters({
                isLoading: 'isLoading',
            }),
            ...mapGetters('stageTarget', {
                availableStageTargetsForStage: 'availableStageTargetsForStage',
            })
        }
    })
    export default class AddTargetDialog extends Vue {
        @Prop() stage!: Stage;

        showDialog = false;
        selectedTargets = [];

        confirm() {
            const stage = this.stage;
            const promises: Promise<void>[] = [];
            this.selectedTargets.forEach(targetId => {
                const stageTarget = new StageTarget({stageId: stage.id, targetId});
                promises.push(this.$store.dispatch(stageTargetIdentifiers.actions.add, stageTarget));
            });

            Promise.all(promises).then(() => {
                this.showDialog = false;
                this.selectedTargets.splice(0, this.selectedTargets.length);
            })
        }

        isScriptTarget(target: Target) {
            return Object.prototype.hasOwnProperty.call(target, 'script');
        }

        isTutorialTarget(target: Target) {
            return !this.isScriptTarget(target);
        }
    }
</script>