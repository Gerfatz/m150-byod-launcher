import Vue from 'vue';
import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Stage} from "@/models/stage";
import {stageApi} from "@/api/stageApi";
import {Target} from "@/models/target";
import {stageTargetApi} from "@/api/stageTargetApi";
import {StageTarget} from "@/models/stageTarget";
import {Id} from "@/models/idType";

export interface StageState {
    stages: Stage[];
    targets: { [key: string]: Target[] };
}

const state = {
    stages: [],
    targets: {},
} as StageState;

const getters = {
    sortedStages: (state) => {
        return state.stages.sort((a: Stage, b: Stage) => a.sequenceNumber - b.sequenceNumber);
    },

    stageTargets: (state, getters, rootState) => (stage: Stage) => {
        const targetIds = stage.targetIds;
        if (!targetIds) {
            return state.targets[stage.id as string];
        }
        const targets = rootState.target.availableTargets;
        return targetIds
            .map(id => targets.find((target: Target) => target.id === id))
            .sort((a: Target, b: Target) => a.title.localeCompare(b.title));
    },

    availableTargets: (state, getters, rootState) => (stage: Stage) => {
        let stageTargetIds = stage.targetIds;
        if (!stageTargetIds) {
            stageTargetIds = state.targets[stage.id as string]?.map(target => target.id) ?? [];
        }
        const targets = rootState.target.availableTargets;
        return targets.filter((target: Target) => !stageTargetIds.includes(target.id));
    }
} as GetterTree<StageState, any>;

const actions = {
    addStage({rootState, state, commit}) {
        const sessionId = rootState.session.activeSession.id;
        const sequenceNumber = state.stages.length + 1;
        const title = `Stufe ${sequenceNumber}`;
        const stage = new Stage({title, sequenceNumber});
        return stageApi.createStage(sessionId, stage)
            .then(newStage => {
                commit('addStage', newStage);
            });
    },

    update({state, commit}, updateData: Partial<Stage>) {
        if (!Object.prototype.hasOwnProperty.call(updateData, 'id') || updateData.id === undefined || updateData.id === null) {
            throw Error("Parameter 'updateData' must contain 'id' property with defined, non-null value.");
        }
        const stage = state.stages.find((stage: Stage) => stage.id === updateData.id) as Stage;
        if (stage === undefined) {
            throw Error(`Provided invalid value for 'id' property. No stage with id '${updateData.id}' found.`);
        }
        stage.update(updateData);
        commit('replaceExistingStage', stage);
    },

    remoteUpdate({state, commit}, id: Id) {
        const stage = state.stages.find((stage: Stage) => stage.id === id);
        if (stage === undefined) {
            throw Error(`Provided invalid value for 'id' property. No stage with id '${id}' found.`);
        }
        return stageApi.updateStage(stage)
            .then(() => {
                commit('replaceExistingStage', stage);
            });
    },

    addTarget({commit}, stageTarget: StageTarget) {
        return stageTargetApi.addStageTarget(stageTarget)
            .then(target => {
                stageTarget.targetId = target.id;
                commit('addTarget', stageTarget);
                return target;
            });
    },

    removeTarget({commit}, stageTarget: StageTarget) {
        return stageTargetApi.removeStageTarget(stageTarget)
            .then(target => {
                stageTarget.targetId = target.id;
                commit('removeTarget', stageTarget);
                return target;
            });
    },

    deleteStage({commit}, stage: Stage) {
        return stageApi.deleteStage(stage)
            .then(stage => {
                commit('deleteStage', stage);
            })
    },

    moveStageUp({state, dispatch}, stageId: Id) {
        const stage = state.stages.find(stage => stage.id === stageId);
        if (stage !== undefined) {
            const otherStage = state.stages.find(s => s.sequenceNumber === stage.sequenceNumber - 1);

            if (otherStage === undefined) {
                throw Error(`Could not move stage up. No other stage with sequenceNumber ${stage.sequenceNumber - 1} to move down found.`)
            }

            return Promise.all([
                dispatch('update', {...stage, sequenceNumber: stage.sequenceNumber - 1}),
                dispatch('update', {...otherStage, sequenceNumber: otherStage.sequenceNumber + 1})
            ]).then(() => {
                dispatch('remoteUpdate', stage.id);
                dispatch('remoteUpdate', otherStage.id);
            });
        }
    },

    moveStageDown({state, dispatch}, stageId: Id) {
        const stage = state.stages.find(stage => stage.id === stageId);
        if (stage !== undefined) {
            const otherStage = state.stages.find(s => s.sequenceNumber === stage.sequenceNumber + 1);

            if (otherStage === undefined) {
                throw Error(`Could not move stage down. No other stage with sequenceNumber ${stage.sequenceNumber + 1} to move up found.`)
            }

            return Promise.all([
                dispatch('update', {...stage, sequenceNumber: stage.sequenceNumber + 1}),
                dispatch('update', {...otherStage, sequenceNumber: otherStage.sequenceNumber - 1})
            ]).then(() => {
                dispatch('remoteUpdate', stage.id);
                dispatch('remoteUpdate', otherStage.id);
            });
        }
    },

    loadStages({commit}, sessionId: Id) {
        stageApi.getStages(sessionId).then(stages => {
            commit('SET_STAGES', stages);
            return stages;
        })
            .then(stages => {
                const requests = [];
                for (const stage of stages) {
                    requests.push(stageTargetApi.getStageTargets(stage.id));
                }
                Promise.all(requests).then(stageTargets => {
                    const targets: { [key: string]: Target[] } = {};
                    stageTargets.forEach((values, index) => {
                        const stageId = state.stages[index].id;
                        if (stageId != null) {
                            values = values.map(target => new Target(target));
                            targets[stageId] = values;
                        }
                    });
                    commit('SET_TARGETS', targets);
                });
            });
    },

} as ActionTree<StageState, any>;

const mutations = {
    addStage(state, newStage: Stage) {
        state.stages.push(new Stage(newStage));
    },

    replaceExistingStage(state, existingStage: Stage) {
        const index = state.stages.findIndex((stage: Stage) => stage.id === existingStage.id);
        if (index === -1) {
            throw Error(`No matching stage found for given existing stage with id '${existingStage.id}'.`);
        }
        state.stages.splice(index, 1, new Stage(existingStage));
    },

    removeTarget(state, stageTarget: StageTarget) {
        const stage = state.stages.find((stage: Stage) => stage.id === stageTarget.stageId);
        if (stage !== undefined) {
            const index = stage.targetIds.indexOf(stageTarget.targetId);
            if (index >= 0) {
                stage.targetIds.splice(index, 1);
            }
        }
    },

    deleteStage(state, stage: Stage) {
        const index = state.stages.findIndex((s: Stage) => s.id === stage.id)
        if (index !== -1) {
            state.stages.splice(index, 1);
        }
    },

    SET_STAGES(state, stages: Stage[]) {
        state.stages.splice(0, state.stages.length - 1, ...stages);
    },

    SET_TARGETS(state, targets: { [key: string]: Target[] }) {
        Vue.set(state, 'targets', targets);
    }

} as MutationTree<StageState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}