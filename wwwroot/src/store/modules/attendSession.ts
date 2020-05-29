import Vue from 'vue';
import {Session} from "@/models/session";
import {Stage} from "@/models/stage";
import {Target} from "@/models/target";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {sessionApi} from "@/api/sessionApi";
import {stageApi} from "@/api/stageApi";
import {stageTargetApi} from "@/api/stageTargetApi";
import {targetResultApi} from "@/api/targetResult";
import {ParticipantTargetResults, TargetResult, TargetResultData} from "@/models/types";
import {TutorialStep} from "@/models/tutorialStep";
import {tutorialStepApi} from "@/api/tutorialStepApi";

export interface AttendSessionState {
    participantId: Id;
    displayName: string;
    session: Session | null;
    stages: Stage[];
    targets: { [key: string]: Target[] };
    tutorialSteps: { [key: string]: TutorialStep[] };
    stageNumber: number;
    targetResults: ParticipantTargetResults;
}

const state = {
    participantId: null,
    displayName: '',
    session: null,
    stages: [],
    targets: {},
    tutorialSteps: {},
    stageNumber: 0,
    targetResults: {} as ParticipantTargetResults
} as AttendSessionState;

const getters = {
    stageTargets: (state) => (stageId: Id) => {
        if (stageId == null) {
            return [] as Target[];
        }
        return state.targets[stageId];
    },

    targetResult: (state) => (targetId: Id): TargetResult => state.targetResults[targetId as string],

    targetSucceeded: (state, getters) => (targetId: Id): boolean => {
        const targetResult = getters.targetResult(targetId);
        return targetResult?.success === true ?? false;
    },

    targetFailed: (state, getters) => (targetId: Id): boolean => {
        const targetResult = getters.targetResult(targetId);
        return targetResult?.success === false ?? false;
    }
} as GetterTree<AttendSessionState, any>;

const actions = {
    setParticipantId({commit}, participantId: Id) {
        commit('SET_PARTICIPANT_ID', participantId);
    },
    
    setDisplayName({commit}, displayName: string){
        commit('SET_DISPLAY_NAME', displayName);
    },

    downloadSessionData({commit, state, dispatch}, sessionId: Id) {
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
            })
            .then(()=>{
                dispatch('updateStageNumber')
            });
    },

    updateStageNumber({state, commit}, stageNumber?: number) {
        if (stageNumber === undefined){
            stageNumber = state.session?.currentStage ?? 0;
        }
        commit('UPDATE_STAGE_NUMBER', stageNumber);
    },

    sendTargetResult({commit, state, getters}, {targetId, success}: { targetId: Id; success: boolean }) {
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
                    commit('REMOVE_TARGET_RESULT', targetResult);
                });
        } else {
            targetResultApi.createTargetResult({
                targetId: targetId,
                participantId: state.participantId,
                success: success,
                details: ''
            } as TargetResultData)
                .then(targetResult => {
                    commit('ADD_TARGET_RESULT', targetResult);
                });
        }
    }
} as ActionTree<AttendSessionState, any>;

const mutations = {
    SET_PARTICIPANT_ID(state, participantId: Id) {
        state.participantId = participantId;
    },

    SET_DISPLAY_NAME(state, displayName: string){
        state.displayName = displayName;
    },

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