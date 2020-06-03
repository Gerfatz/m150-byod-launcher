import Vue from 'vue';
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {targetResultApi} from "@/api/targetResult";
import {ParticipantTargetResults, TargetResult, TargetResultData} from "@/models/types";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'attendSession/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const attendSessionIdentifiers = {
    actions: {
        setParticipantId: modulePrefix + 'SET_PARTICIPANT_ID',
        setDisplayName: modulePrefix + 'SET_DISPLAY_NAME',
        updateStageNumber: modulePrefix + 'UPDATE_STAGE_NUMBER',
        sendTargetResult: modulePrefix + 'SEND_TARGET_RESULT',
    },
    mutations: {
        setParticipantId: modulePrefix + 'SET_PARTICIPANT_ID',
        setDisplayName: modulePrefix + 'SET_DISPLAY_NAME',
        updateStageNumber: modulePrefix + 'UPDATE_STAGE_NUMBER',
        addTargetResult: modulePrefix + 'ADD_TARGET_RESULT',
        removeTargetResult: modulePrefix + 'REMOVE_TARGET_RESULT',
    }
};

export interface AttendSessionState {
    participantId: Id;
    displayName: string;
    stageNumber: number;
    targetResults: ParticipantTargetResults;
}

const state = {
    participantId: null,
    displayName: '',
    stageNumber: 0,
    targetResults: {} as ParticipantTargetResults
} as AttendSessionState;

const getters = {
    targetResult: (state) => (targetId: Id): TargetResult => state.targetResults[targetId as string],
} as GetterTree<AttendSessionState, any>;

const actions = {
    SET_PARTICIPANT_ID({commit}, participantId: Id) {
        commit(localIdentifier(attendSessionIdentifiers.mutations.setParticipantId), participantId);
    },

    SET_DISPLAY_NAME({commit}, displayName: string) {
        commit(localIdentifier(attendSessionIdentifiers.mutations.setDisplayName), displayName);
    },

    UPDATE_STAGE_NUMBER({rootState, commit}, stageNumber?: number) {
        if (stageNumber === undefined) {
            stageNumber = rootState.session.session?.currentStage;
            if (stageNumber === undefined) {
                stageNumber = 0;
            }
        }
        commit(localIdentifier(attendSessionIdentifiers.mutations.updateStageNumber), stageNumber);
    },

    SEND_TARGET_RESULT({state, getters, dispatch, commit}, {targetId, success}: { targetId: Id; success: boolean }) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        const currentTargetResult = getters.targetResult(targetId);
        if (currentTargetResult?.success === success) {
            const targetResultData = {
                targetId: targetId,
                participantId: state.participantId,
                success: currentTargetResult.success,
                details: currentTargetResult.details
            } as TargetResultData;
            targetResultApi.removeTargetResult(targetResultData)
                .then(targetResult => {
                    commit(localIdentifier(attendSessionIdentifiers.mutations.removeTargetResult), targetResult);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        } else {
            targetResultApi.createTargetResult({
                targetId: targetId,
                participantId: state.participantId,
                success: success,
                details: ''
            } as TargetResultData)
                .then(targetResult => {
                    commit(localIdentifier(attendSessionIdentifiers.mutations.addTargetResult), targetResult);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    }
} as ActionTree<AttendSessionState, any>;

const mutations = {
    SET_PARTICIPANT_ID(state, participantId: Id) {
        state.participantId = participantId;
    },

    SET_DISPLAY_NAME(state, displayName: string) {
        state.displayName = displayName;
    },

    UPDATE_STAGE_NUMBER(state, stageNumber: number) {
        state.stageNumber = stageNumber;
    },

    ADD_TARGET_RESULT(state, targetResultData: TargetResultData) {
        const targetResult = {
            success: targetResultData.success,
            details: targetResultData.details
        } as TargetResult;

        Vue.set(state.targetResults, targetResultData.targetId as string, targetResult);
    },

    REMOVE_TARGET_RESULT(state, targetResultData: TargetResultData) {
        Vue.delete(state.targetResults, targetResultData.targetId as string);
    }
} as MutationTree<AttendSessionState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}