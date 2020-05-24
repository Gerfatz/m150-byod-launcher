<template>
    <v-dialog
            v-model="showDialog"
            width="500"
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
            <v-card-title class="headline"
                          primary-title
            >
                Schritt hinzufügen
            </v-card-title>

            <v-card-text>
                <p>Wählen Sie Schritte aus, um diese zur aktuellen Stufe hinzuzufügen.</p>
            </v-card-text>

            <v-list two-line
                    flat
            >
                <v-list-item-group v-model="selectedTargets"
                                   multiple
                >
                    <v-list-item v-for="target in availableTargets(stage)"
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
                                <v-icon dense color="blue" v-text="'fa-scroll'"></v-icon>
                            </v-list-item-icon>
                        </template>

                    </v-list-item>
                </v-list-item-group>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text
                       @click="confirm"
                       :disabled="selectedTargets.length === 0"
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

<script>
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {mapGetters} from "vuex";
    import {Prop} from "vue-property-decorator";
    import {StageTarget} from "@/models/stageTarget";

    @Component({
        computed: {
            ...mapGetters('stage', {
                availableTargets: 'availableTargets',
            })
        }
    })
    export default class AddTargetDialog extends Vue {
        @Prop() stage;

        showDialog = false;
        selectedTargets = [];

        confirm() {
            const stage = this.stage;
            const promises = [];
            this.selectedTargets.forEach(targetId => {
                const stageTarget = new StageTarget({stageId: stage.id, targetId});
                promises.push(this.$store.dispatch('stage/addTarget', stageTarget));
            });

            Promise.all(promises).then(() => {
                this.showDialog = false;
                this.selectedTargets.splice(0, this.selectedTargets.length);
            })
        }
    }
</script>