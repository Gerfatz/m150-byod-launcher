import {Session} from "@/models/session";
import {Stage} from "@/models/stage";
import {Target} from "@/models/target";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {sessionApi} from "@/api/sessionApi";
import {stageApi} from "@/api/stageApi";
import {stageTargetApi} from "@/api/stageTargetApi";
import Vue from 'vue';
import {TargetResult, TargetResultCollection, TargetResultData} from "@/models/types";
import {tutorialStepApi} from "@/api/tutorialStepApi";
import {TutorialStep} from "@/models/tutorialStep";

export interface OrchestrateSessionState {
    session: Session | null;
    stages: Stage[];
    targets: { [key: string]: Target[] };
    tutorialSteps: { [key: string]: TutorialStep[] };
    participants: { [key: string]: string };
    targetResults: TargetResultCollection;
    stageNumber: number;
}

const state = {
    session: null,
    stages: [],
    targets: {},
    tutorialSteps: {},
    participants: {},
    targetResults: {},
    stageNumber: 0,
} as OrchestrateSessionState;

const getters = {
    stageTargets: (state) => (stageId: Id) => {
        if (stageId == null) {
            return [] as Target[];
        }
        return state.targets[stageId];
    },

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
    downloadSessionData({commit, state}, sessionId: Id) {
        sessionApi.getSession(sessionId)
            .then(session => {
                commit('SET_SESSION', session);
                return session;
            })
            .then(session => {
                return stageApi.getStages(session.id);
            })
            .then(stages => {
                commit('SET_STAGES', stages);
                return stages;
            })
            .then((stages) => {
                const requests = [];
                for (const stage of stages) {
                    requests.push(stageTargetApi.getStageTargets(stage.id));
                }
                return Promise.all(requests);
            })
            .then(stageTargets => {
                const targets: { [key: string]: Target[] } = {};
                stageTargets.forEach((values, index) => {
                    const stageId = state.stages[index].id;
                    if (stageId != null) {
                        values = values.map(target => new Target(target));
                        targets[stageId] = values;
                    }
                });
                commit('SET_TARGETS', targets);
                return targets;
            })
            .then((targets: { [key: string]: Target[] }) => {
                const tutorialStepPromises = [];
                for (const tutorialTargets of Object.values(targets)) {
                    for (const tutorialTarget of tutorialTargets) {
                        if (!Object.prototype.hasOwnProperty.call(tutorialTarget, 'script')) {
                            tutorialStepPromises.push(tutorialStepApi.getTutorialSteps(tutorialTarget.id));
                        }
                    }
                }
                return Promise.all(tutorialStepPromises);
            })
            .then(response => {
                const tutorialSteps: { [key: string]: TutorialStep[] } = {};
                response.forEach((stepsOfTarget: TutorialStep[]) => {
                    if (stepsOfTarget.length > 0) {
                        const targetId = stepsOfTarget[0].tutorialTargetId as string;
                        tutorialSteps[targetId] = stepsOfTarget.map(step => new TutorialStep(step))
                            .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    }
                });
                commit('SET_TUTORIAL_STEPS', tutorialSteps);
                return tutorialSteps;
            });
    },

    participantJoined({commit}, {participantId, displayName}: { participantId: Id; displayName: string }) {
        commit('ADD_PARTICIPANT', {participantId, displayName});
    },

    participantLeft({commit}, participantId: Id) {
        commit('REMOVE_PARTICIPANT', participantId);
    },

    addTargetResult({commit}, targetResultData: TargetResultData) {
        commit('ADD_TARGET_RESULT', targetResultData);
    },

    removeTargetResult({commit}, {targetId, participantId}: { targetId: Id; participantId: Id }) {
        commit('REMOVE_TARGET_RESULT', {targetId, participantId});
    },

    startSession({commit}) {
        commit('UPDATE_CURRENT_STAGE_NUMBER', 1);
    },

    changeStageNumber({commit, state}, change: number) {
        commit('UPDATE_CURRENT_STAGE_NUMBER', state.stageNumber + change);
    }
} as ActionTree<OrchestrateSessionState, any>;

const mutations = {
    SET_SESSION(state, session: Session) {
        state.session = new Session(session);
    },

    SET_STAGES(state, stages: Stage[]) {
        stages = stages.map(stage => new Stage(stage));
        state.stages.splice(0, state.stages.length, ...stages);
    },

    SET_TARGETS(state, targets: { [key: string]: Target[] }) {
        Object.keys(state.targets).forEach(key => delete state.targets[key]);
        state.targets = {...state.targets, ...targets};
    },

    SET_TUTORIAL_STEPS(state, tutorialSteps: { [key: string]: TutorialStep[] }) {
        Object.keys(state.tutorialSteps).forEach(key => delete state.tutorialSteps[key]);
        state.tutorialSteps = {...state.tutorialSteps, ...tutorialSteps};
    },

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