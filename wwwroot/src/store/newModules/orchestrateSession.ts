import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import Vue from 'vue';
import {TargetResult, TargetResultCollection, TargetResultData} from "@/models/types";

const modulePrefix = 'orchestrateSession/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const orchestrateSessionIdentifiers = {
    actions: {
        participantJoined: modulePrefix + 'PARTICIPANT_JOINED',
        participantLeft: modulePrefix + 'PARTICIPANT_LEFT',
        addTargetResult: modulePrefix + 'ADD_TARGET_RESULT',
        removeTargetResult: modulePrefix + 'REMOVE_TARGET_RESULT',
        startSession: modulePrefix + 'START_SESSION',
        changeStageNumber: modulePrefix + 'CHANGE_STAGE_NUMBER',
    },
    mutations: {
        addParticipant: modulePrefix + 'ADD_PARTICIPANT',
        removeParticipant: modulePrefix + 'REMOVE_PARTICIPANT',
        addTargetResult: modulePrefix + 'ADD_TARGET_RESULT',
        removeTargetResult: modulePrefix + 'REMOVE_TARGET_RESULT',
        startSession: modulePrefix + 'START_SESSION',
        updateCurrentStageNumber: modulePrefix + 'UPDATE_CURRENT_STAGE_NUMBER',
    }
};

export interface OrchestrateSessionState {
    participants: { [key: string]: string };
    targetResults: TargetResultCollection;
    stageNumber: number;
}

const state = {
    participants: {},
    targetResults: {},
    stageNumber: 0,
} as OrchestrateSessionState;

const getters = {

    participantCount: (state) => {
        return Object.entries(state.participants).length;
    },

    targetResults: (state) => (targetId: Id): { [key: string]: TargetResult } => {
        return state.targetResults[targetId as string] ?? {};
    },

    totalExecutionsPercentage: (state, getters) => (targetId: Id) => {
        const participantCount = getters.participantCount;
        const targetResultCount = Object.keys(getters.targetResults(targetId)).length;
        const percentage = targetResultCount / participantCount * 100;
        return isFinite(percentage) ? percentage : 0;
    },

    successfulExecutionsPercentage: (state, getters) => (targetId: Id) => {
        const participantCount = getters.participantCount;
        const targetResults: { [key: string]: TargetResult } = getters.targetResults(targetId);
        const successfulTargetResultCount = Object.values(targetResults).filter((targetResult) => targetResult.success).length;
        const percentage = successfulTargetResultCount / participantCount * 100;
        return isFinite(percentage) ? percentage : 0;
    }
} as GetterTree<OrchestrateSessionState, any>;

const actions = {

    PARTICIPANT_JOINED({commit}, {participantId, displayName}: { participantId: Id; displayName: string }) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.addParticipant), {participantId, displayName});
    },

    PARTICIPANT_LEFT({commit}, participantId: Id) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.removeParticipant), participantId);
    },

    ADD_TARGET_RESULT({commit}, targetResultData: TargetResultData) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.addTargetResult), targetResultData);
    },

    REMOVE_TARGET_RESULT({commit}, {targetId, participantId}: { targetId: Id; participantId: Id }) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.removeTargetResult), {targetId, participantId});
    },

    START_SESSION({commit}) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.updateCurrentStageNumber), 1);
    },

    CHANGE_STAGE_NUMBER({commit, state}, change: number) {
        commit(localIdentifier(orchestrateSessionIdentifiers.mutations.updateCurrentStageNumber), state.stageNumber + change);
    }
} as ActionTree<OrchestrateSessionState, any>;

const mutations = {
    ADD_PARTICIPANT(state, {participantId, displayName}: { participantId: Id; displayName: string }) {
        if (participantId !== null) {
            Vue.set(state.participants, participantId, displayName);
        }
    },

    REMOVE_PARTICIPANT(state, participantId: Id) {
        if (participantId != null) {
            Vue.delete(state.participants, participantId);
        }
    },

    ADD_TARGET_RESULT(state, targetResultData: TargetResultData) {
        const targetId = targetResultData.targetId as string;
        if (!Object.prototype.hasOwnProperty.call(state.targetResults, targetId)) {
            Vue.set(state.targetResults, targetId, {} as TargetResult);
        }
        const participantId = targetResultData.participantId as string;
        const targetResult = {
            success: targetResultData.success,
            details: targetResultData.details,
        } as TargetResult;
        Vue.set(state.targetResults[targetId], participantId, targetResult);
    },

    REMOVE_TARGET_RESULT(state, {targetId, participantId}: { targetId: Id; participantId: Id }) {
        const targetIdString = targetId as string;
        const participantIdString = participantId as string;
        if (Object.hasOwnProperty.call(state.targetResults, targetIdString) &&
            Object.hasOwnProperty.call(state.targetResults[targetIdString], participantIdString)
        ) {
            Vue.delete(state.targetResults[targetIdString], participantIdString);
        }
    },

    START_SESSION(state) {
        state.stageNumber = 1;
    },

    UPDATE_CURRENT_STAGE_NUMBER(state, currentStage: number) {
        state.stageNumber = currentStage;
    }
} as MutationTree<OrchestrateSessionState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}