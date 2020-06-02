import Vue from 'vue';
import {Target} from "@/models/target";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {stageTargetApi} from "@/api/stageTargetApi";
import {StageTarget} from "@/models/stageTarget";

const modulePrefix = 'stageTarget/';

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const stageTargetIdentifiers = {
    actions: {
        load: modulePrefix + 'LOAD',
        add: modulePrefix + 'ADD',
        remove: modulePrefix + 'REMOVE',
    },
    mutations: {
        set: modulePrefix + 'SET',
        add: modulePrefix + 'ADD',
        remove: modulePrefix + 'REMOVE',
    }
}

export interface StageTargetState {
    /**
     * keys:    stage id
     * values:  array of targets for stage
     */
    stageTargets: { [key: string]: Target[] };
}

const state = {
    stageTargets: {}
} as StageTargetState;

const getters = {
    stageTargetsForStage: (state) => (stageId: Id) => {
        return state.stageTargets[stageId as string];
    },

    availableStageTargetsForStage: (state, getters, rootState) => (stageId: Id) => {
        const stageTargetIds = state.stageTargets[stageId as string]?.map(target => target.id) ?? [];
        const targets = rootState.target.targets;
        return targets.filter((target: Target) => !stageTargetIds.includes(target.id));
    }
} as GetterTree<StageTargetState, any>

const actions = {
    LOAD({commit}, stageId: Id) {
        return stageTargetApi.getStageTargets(stageId)
            .then(targets => {
                commit(localIdentifier(stageTargetIdentifiers.mutations.set), {stageId, targets});
            })
    },

    ADD({commit}, stageTarget: StageTarget) {
        const stageId = stageTarget.stageId;
        return stageTargetApi.addStageTarget(stageTarget)
            .then(target => {
                commit(localIdentifier(stageTargetIdentifiers.mutations.add), {stageId, target});
            });
    },

    REMOVE({commit, state}, stageTarget: StageTarget) {
        return stageTargetApi.removeStageTarget(stageTarget)
            .then(target => {
                const targetIndex = state.stageTargets[stageTarget.stageId as string]
                    .findIndex(t => t.id === target.id);
                if (targetIndex >= 0) {
                    const payload = {
                        stageId: stageTarget.stageId,
                        targetIndex
                    }
                    commit(localIdentifier(stageTargetIdentifiers.mutations.remove), payload);
                }
            });
    }
} as ActionTree<StageTargetState, any>

const mutations = {
    SET(state, {stageId, targets}: { stageId: Id; targets: Target[] }) {
        if (Object.prototype.hasOwnProperty.call(state.stageTargets, stageId as string)) {
            Vue.delete(state.stageTargets, stageId as string);
        }
        targets = targets.map(target => new Target(target));
        Vue.set(state.stageTargets, stageId as string, targets);
    },

    ADD(state, {stageId, target}: { stageId: Id; target: Target }) {
        if (!Object.prototype.hasOwnProperty.call(state.stageTargets, stageId as string)) {
            Vue.set(state.stageTargets, stageId as string, []);
        }
        state.stageTargets[stageId as string].push(new Target(target));
    },

    REMOVE(state, {stageId, targetIndex}: { stageId: Id; targetIndex: number }) {
        if (targetIndex >= 0) {
            state.stageTargets[stageId as string].splice(targetIndex, 1);
        }
    }
} as MutationTree<StageTargetState>

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}