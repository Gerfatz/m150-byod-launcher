import Vue from 'vue';
import {TutorialStep} from "@/models/tutorialStep";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {tutorialStepApi} from "@/api/tutorialStepApi";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'tutorialStep/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const tutorialStepIdentifiers = {
    actions: {
        initialize: modulePrefix + 'INITIALIZE',
        load: modulePrefix + 'LOAD',
        add: modulePrefix + 'ADD',
        update: modulePrefix + 'UPDATE',
        remoteUpdate: modulePrefix + 'REMOTE_UPDATE',
        delete: modulePrefix + 'DELETE',
        moveUp: modulePrefix + 'MOVE_UP',
        moveDown: modulePrefix + 'MOVE_DOWN',
        updateSavingState: modulePrefix + 'UPDATE_SAVING_STATE',
    },
    mutations: {
        initialize: modulePrefix + 'INITIALIZE',
        set: modulePrefix + 'SET',
        add: modulePrefix + 'ADD',
        replace: modulePrefix + 'REPLACE',
        delete: modulePrefix + 'DELETE',
        setSavingState: modulePrefix + 'SET_SAVING_STATE',
    }
}

export interface TutorialStepState {
    tutorialSteps: { [key: string]: TutorialStep[] };
    instructionsSaved: { [id: string]: boolean };
}

const state = {
    tutorialSteps: {},
    instructionsSaved: {},
} as TutorialStepState;

const getters = {

    tutorialStepsForTarget: (state) => (tutorialTargetId: Id) => {
        // TODO: sort steps!
        return state.tutorialSteps[tutorialTargetId as string];
    },

    orderedTutorialSteps(state, getters, rootState) {
        const newTutorialTargetId = rootState.tutorialTarget.newTutorialTarget.id as string;
        return state.tutorialSteps[newTutorialTargetId]
            ?.sort((a: TutorialStep, b: TutorialStep) => a.sequenceNumber - b.sequenceNumber) ?? [];
    },

    instructionsSaved: (state) => (stepId: Id) => {
        if (stepId === null || !Object.prototype.hasOwnProperty.call(state.instructionsSaved, stepId)) {
            return false;
        }
        return state.instructionsSaved[stepId];
    },

    savingStatusMessage: (state, getters) => (stepId: Id) => {
        const isSaved = getters.instructionsSaved(stepId);
        return isSaved ? 'Erklärungen gespeichert!' : 'Wird gespeichert...';
    }
} as GetterTree<TutorialStepState, any>;

const actions = {
    INITIALIZE({commit}, tutorialTargetId: Id) {
        commit(localIdentifier(tutorialStepIdentifiers.mutations.initialize), tutorialTargetId);
    },

    LOAD({dispatch, commit}, tutorialTargetId: Id) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return tutorialStepApi.getTutorialSteps(tutorialTargetId)
            .then(tutorialSteps => {
                commit(localIdentifier(tutorialStepIdentifiers.mutations.set), {tutorialTargetId, tutorialSteps});
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    ADD({rootState, state, dispatch, commit}) {
        const tutorialTargetId = rootState.tutorialTarget.newTutorialTarget.id;
        const sequenceNumber = (state.tutorialSteps[tutorialTargetId]?.length ?? 0) + 1;
        const title = `Schritt ${sequenceNumber}`;
        const tutorialStep = new TutorialStep({tutorialTargetId, sequenceNumber, title});
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return tutorialStepApi.addTutorialStep(tutorialStep)
            .then(tutorialStep => {
                commit(localIdentifier(tutorialStepIdentifiers.mutations.add), tutorialStep);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    UPDATE({state, commit}, updateData: Partial<TutorialStep>) {
        if (!Object.prototype.hasOwnProperty.call(updateData, 'id') || updateData.id === undefined || updateData.id === null) {
            throw Error("Parameter 'updateData' must contain 'id' property with defined, non-null value.");
        }
        const tutorialTargetId = updateData.tutorialTargetId as string;
        const tutorialStep = state.tutorialSteps[tutorialTargetId]
            .find((step: TutorialStep) => step.id === updateData.id) as TutorialStep;
        if (tutorialStep === undefined) {
            throw Error(`Provided invalid value for 'id' property. No tutorial step with id '${updateData.id}' found.`);
        }
        tutorialStep.update(updateData);
        commit(localIdentifier(tutorialStepIdentifiers.mutations.replace), tutorialStep);
    },

    REMOTE_UPDATE({state, dispatch, commit}, {tutorialTargetId, stepId}: { tutorialTargetId: Id; stepId: Id }) {
        const tutorialStep = state.tutorialSteps[tutorialTargetId as string]
            .find((step: TutorialStep) => step.id === stepId);
        if (tutorialStep === undefined) {
            throw Error(`Provided invalid value for id properties. No tutorial step with id '${stepId}' within tutorial target with id '${tutorialTargetId}' found.`);
        }
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return tutorialStepApi.updateTutorialStep(tutorialStep)
            .then(() => {
                commit(localIdentifier(tutorialStepIdentifiers.mutations.replace), tutorialStep);
                commit(localIdentifier(tutorialStepIdentifiers.mutations.setSavingState), {
                    stepId: tutorialStep.id,
                    isSaving: true
                });
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    DELETE({dispatch, commit}, step: TutorialStep) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return tutorialStepApi.deleteTutorialStep(step)
            .then(step => {
                commit(localIdentifier(tutorialStepIdentifiers.mutations.delete), step);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    MOVE_UP({state, dispatch}, step: TutorialStep) {
        const otherStep = state.tutorialSteps[step.tutorialTargetId as string]
            .find(s => s.sequenceNumber === step.sequenceNumber - 1);

        if (otherStep === undefined) {
            throw Error(`Could not move step up. No other step with sequenceNumber ${step.sequenceNumber - 1} to move down found.`)
        }

        Promise.all([
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.update), {
                ...step,
                sequenceNumber: step.sequenceNumber - 1
            }),
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.update), {
                ...otherStep,
                sequenceNumber: otherStep.sequenceNumber + 1
            })
        ]).then(() => {
            const payload = {tutorialTargetId: step.tutorialTargetId};
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.remoteUpdate), {...payload, stepId: step.id});
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.remoteUpdate), {...payload, stepId: otherStep.id});
        });
    },

    MOVE_DOWN({state, dispatch}, step: TutorialStep) {
        const otherStep = state.tutorialSteps[step.tutorialTargetId as string]
            .find(s => s.sequenceNumber === step.sequenceNumber + 1);

        if (otherStep === undefined) {
            throw Error(`Could not move step down. No other step with sequenceNumber ${step.sequenceNumber + 1} to move up found.`)
        }

        Promise.all([
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.update), {
                ...step,
                sequenceNumber: step.sequenceNumber + 1
            }),
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.update), {
                ...otherStep,
                sequenceNumber: otherStep.sequenceNumber - 1
            })
        ]).then(() => {
            const payload = {tutorialTargetId: step.tutorialTargetId};
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.remoteUpdate), {...payload, stepId: step.id});
            dispatch(localIdentifier(tutorialStepIdentifiers.actions.remoteUpdate), {...payload, stepId: otherStep.id});
        });
    },

    UPDATE_SAVING_STATE({commit}, {stepId, isSaving}: { stepId: Id; isSaving: boolean }) {
        commit(localIdentifier(tutorialStepIdentifiers.mutations.setSavingState), {stepId, isSaving});
    }
} as ActionTree<TutorialStepState, any>;

const mutations = {
    INITIALIZE(state, tutorialTargetId: Id) {
        if (!Object.prototype.hasOwnProperty.call(state.tutorialSteps, tutorialTargetId as string)) {
            Vue.set(state.tutorialSteps, tutorialTargetId as string, []);
        }
    },

    SET(state, {tutorialTargetId, tutorialSteps}: { tutorialTargetId: Id; tutorialSteps: TutorialStep[] }) {
        tutorialSteps = tutorialSteps.map(tutorialStep => new TutorialStep(tutorialStep));
        Vue.set(state.tutorialSteps, tutorialTargetId as string, tutorialSteps);
    },

    ADD(state, tutorialStep: TutorialStep) {
        const tutorialTargetId = tutorialStep.tutorialTargetId as string;
        if (!Object.prototype.hasOwnProperty.call(state.tutorialSteps, tutorialTargetId)) {
            Vue.set(state.tutorialSteps, tutorialTargetId, []);
        }
        state.tutorialSteps[tutorialTargetId].push(new TutorialStep(tutorialStep));
    },

    REPLACE(state, existingTutorialStep: TutorialStep) {
        const tutorialTargetId = existingTutorialStep.tutorialTargetId as string;
        const index = state.tutorialSteps[tutorialTargetId]
            .findIndex((step: TutorialStep) => step.id === existingTutorialStep.id);
        if (index === -1) {
            throw Error(`No matching tutorial step found for given existing step with id '${existingTutorialStep.id}'.`);
        }
        state.tutorialSteps[tutorialTargetId].splice(index, 1, new TutorialStep(existingTutorialStep));
    },

    SET_SAVING_STATE(state, {stepId, isSaving}: { stepId: Id; isSaving: boolean }) {
        if (stepId !== null) {
            state.instructionsSaved = {...state.instructionsSaved, [stepId]: isSaving};
        }
    },

    DELETE(state, tutorialStep: TutorialStep) {
        const tutorialTargetId = tutorialStep.tutorialTargetId as string;
        const index = state.tutorialSteps[tutorialTargetId]
            .findIndex((step: TutorialStep) => step.id === tutorialStep.id);
        if (index === -1) {
            throw Error(`No matching tutorial step to delete found for given id: ${tutorialStep.id}`);
        }
        state.tutorialSteps[tutorialTargetId].splice(index, 1);
    }
} as MutationTree<TutorialStepState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};