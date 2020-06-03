import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Stage} from "@/models/stage";
import {stageApi} from "@/api/stageApi";
import {Id} from "@/models/idType";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'stage/';

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const stageIdentifiers = {
    actions: {
        load: modulePrefix + 'LOAD',
        add: modulePrefix + 'ADD',
        update: modulePrefix + 'UPDATE',
        remoteUpdate: modulePrefix + 'REMOTE_UPDATE',
        delete: modulePrefix + 'DELETE',
        moveUp: modulePrefix + 'MOVE_UP',
        moveDown: modulePrefix + 'MOVE_DOWN',
    },
    mutations: {
        setStages: modulePrefix + 'SET_STAGES',
        add: modulePrefix + 'ADD',
        replace: modulePrefix + 'REPLACE',
        delete: modulePrefix + 'DELETE',
    }
}

export interface StageState {
    stages: Stage[];
}

const state = {
    stages: [],
} as StageState;

const getters = {
    sortedStages: (state) => {
        return state.stages.sort((a: Stage, b: Stage) => a.sequenceNumber - b.sequenceNumber);
    },

} as GetterTree<StageState, any>;

const actions = {
    LOAD({dispatch, commit}, sessionId: Id) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return stageApi.getStages(sessionId)
            .then(stages => {
                commit(localIdentifier(stageIdentifiers.mutations.setStages), stages);
                return stages;
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    ADD({rootState, state, dispatch, commit}) {
        const sessionId = rootState.session.session.id;
        const sequenceNumber = state.stages.length + 1;
        const title = `Stufe ${sequenceNumber}`;
        const stage = new Stage({title, sequenceNumber});
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return stageApi.createStage(sessionId, stage)
            .then(newStage => {
                commit(localIdentifier(stageIdentifiers.mutations.add), newStage);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    UPDATE({state, commit}, updateData: Partial<Stage>) {
        if (!Object.prototype.hasOwnProperty.call(updateData, 'id') || updateData.id === undefined || updateData.id === null) {
            throw Error("Parameter 'updateData' must contain 'id' property with defined, non-null value.");
        }
        const stage = state.stages.find((stage: Stage) => stage.id === updateData.id) as Stage;
        if (stage === undefined) {
            throw Error(`Provided invalid value for 'id' property. No stage with id '${updateData.id}' found.`);
        }
        stage.update(updateData);
        commit(localIdentifier(stageIdentifiers.mutations.replace), stage);
    },

    REMOTE_UPDATE({state, dispatch, commit}, id: Id) {
        const stage = state.stages.find((stage: Stage) => stage.id === id);
        if (stage === undefined) {
            throw Error(`Provided invalid value for 'id' property. No stage with id '${id}' found.`);
        }
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return stageApi.updateStage(stage)
            .then(() => {
                commit(localIdentifier(stageIdentifiers.mutations.replace), stage);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    DELETE({dispatch, commit}, stage: Stage) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return stageApi.deleteStage(stage)
            .then(stage => {
                commit(localIdentifier(stageIdentifiers.mutations.delete), stage);
            }).finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    MOVE_UP({state, dispatch}, stageId: Id) {
        const stage = state.stages.find(stage => stage.id === stageId);
        if (stage !== undefined) {
            const otherStage = state.stages.find(s => s.sequenceNumber === stage.sequenceNumber - 1);

            if (otherStage === undefined) {
                throw Error(`Could not move stage up. No other stage with sequenceNumber ${stage.sequenceNumber - 1} to move down found.`)
            }
            dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
            return Promise.all([
                dispatch(localIdentifier(stageIdentifiers.actions.update), {
                    ...stage,
                    sequenceNumber: stage.sequenceNumber - 1
                }),
                dispatch(localIdentifier(stageIdentifiers.actions.update), {
                    ...otherStage,
                    sequenceNumber: otherStage.sequenceNumber + 1
                })
            ])
                .then(() => {
                    dispatch(localIdentifier(stageIdentifiers.actions.remoteUpdate), stage.id);
                    dispatch(localIdentifier(stageIdentifiers.actions.remoteUpdate), otherStage.id);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    },

    MOVE_DOWN({state, dispatch}, stageId: Id) {
        const stage = state.stages.find(stage => stage.id === stageId);
        if (stage !== undefined) {
            const otherStage = state.stages.find(s => s.sequenceNumber === stage.sequenceNumber + 1);

            if (otherStage === undefined) {
                throw Error(`Could not move stage down. No other stage with sequenceNumber ${stage.sequenceNumber + 1} to move up found.`)
            }
            dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
            return Promise.all([
                dispatch(localIdentifier(stageIdentifiers.actions.update), {
                    ...stage,
                    sequenceNumber: stage.sequenceNumber + 1
                }),
                dispatch(localIdentifier(stageIdentifiers.actions.update), {
                    ...otherStage,
                    sequenceNumber: otherStage.sequenceNumber - 1
                })
            ])
                .then(() => {
                    dispatch(localIdentifier(stageIdentifiers.actions.remoteUpdate), stage.id);
                    dispatch(localIdentifier(stageIdentifiers.actions.remoteUpdate), otherStage.id);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    },


} as ActionTree<StageState, any>;

const mutations = {
    SET_STAGES(state, stages: Stage[]) {
        stages = stages.map(stage => new Stage(stage));
        state.stages.splice(0, state.stages.length, ...stages);
    },

    ADD(state, newStage: Stage) {
        state.stages.push(new Stage(newStage));
    },

    REPLACE(state, existingStage: Stage) {
        const index = state.stages.findIndex((stage: Stage) => stage.id === existingStage.id);
        if (index === -1) {
            throw Error(`No matching stage found for given existing stage with id '${existingStage.id}'.`);
        }
        state.stages.splice(index, 1, new Stage(existingStage));
    },

    DELETE(state, stage: Stage) {
        const index = state.stages.findIndex((s: Stage) => s.id === stage.id)
        if (index !== -1) {
            state.stages.splice(index, 1);
        }
    },

} as MutationTree<StageState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}