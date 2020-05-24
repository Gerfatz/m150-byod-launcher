import {TutorialStep} from "@/models/tutorialStep";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";
import {tutorialStepApi} from "@/api/tutorialStepApi";

export interface TutorialStepState {
    tutorialSteps: TutorialStep[];
    instructionsSaved: { [id: string]: boolean };
}

const state = {
    tutorialSteps: [],
    instructionsSaved: {},
} as TutorialStepState;

const getters = {
    tutorialStep: (state) => (stepId: Id) => {
        return state.tutorialSteps.find((tutorialStep: TutorialStep) => tutorialStep.id === stepId);
    },

    orderedTutorialSteps(state) {
        return state.tutorialSteps.sort((a: TutorialStep, b: TutorialStep) => a.sequenceNumber - b.sequenceNumber);
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
    addTutorialStep({commit, rootState}) {
        const sequenceNumber = rootState.tutorialTarget.activeTutorialTarget.stepIds.length + 1;
        const title = `Schritt ${sequenceNumber}`;
        const tutorialTargetId = rootState.tutorialTarget.activeTutorialTarget.id;
        const tutorialStep = new TutorialStep({sequenceNumber, title, tutorialTargetId});
        return tutorialStepApi.addTutorialStep(tutorialStep)
            .then(tutorialStep => {
                commit('tutorialTarget/addTutorialStepId', tutorialStep.id, {root: true});
                commit('addTutorialStep', tutorialStep);
                return tutorialStep;
            });
    },

    update({state, commit}, updateData: Partial<TutorialStep>) {
        if (!Object.prototype.hasOwnProperty.call(updateData, 'id') || updateData.id === undefined || updateData.id === null) {
            throw Error("Parameter 'updateData' must contain 'id' property with defined, non-null value.");
        }
        const tutorialStep = state.tutorialSteps.find((step: TutorialStep) => step.id === updateData.id) as TutorialStep;
        if (tutorialStep === undefined) {
            throw Error(`Provided invalid value for 'id' property. No tutorial step with id '${updateData.id}' found.`);
        }
        tutorialStep.update(updateData);
        commit('replaceExistingTutorialStep', tutorialStep);
    },

    remoteUpdate({state, commit}, id: Id) {
        const tutorialStep = state.tutorialSteps.find((step: TutorialStep) => step.id === id);
        if (tutorialStep === undefined) {
            throw Error(`Provided invalid value for 'id' property. No tutorial step with id '${id}' found.`);
        }
        return tutorialStepApi.updateTutorialStep(tutorialStep)
            .then(() => {
                commit('replaceExistingTutorialStep', tutorialStep);
                commit('setSavingStatus', {stepId: tutorialStep.id, isSaving: true});
            });
    },

    deleteStep({commit}, step: TutorialStep) {
        return tutorialStepApi.deleteTutorialStep(step)
            .then(step => {
                commit('deleteStep', step);
            });
    },

    moveStepUp({state, dispatch}, stepId: Id) {
        const step = state.tutorialSteps.find(step => step.id === stepId);
        if (step !== undefined) {
            const otherStep = state.tutorialSteps.find(s => s.sequenceNumber === step.sequenceNumber - 1);

            if (otherStep === undefined) {
                throw Error(`Could not move step up. No other step with sequenceNumber ${step.sequenceNumber - 1} to move down found.`)
            }

            Promise.all([
                dispatch('update', {...step, sequenceNumber: step.sequenceNumber - 1}),
                dispatch('update', {...otherStep, sequenceNumber: otherStep.sequenceNumber + 1})
            ]).then(() => {
                dispatch('remoteUpdate', step.id);
                dispatch('remoteUpdate', otherStep.id);
            });
        }
    },

    moveStepDown({state, dispatch}, stepId: Id) {
        const step = state.tutorialSteps.find(step => step.id === stepId);
        if (step !== undefined) {
            const otherStep = state.tutorialSteps.find(s => s.sequenceNumber === step.sequenceNumber + 1);

            if (otherStep === undefined) {
                throw Error(`Could not move step down. No other step with sequenceNumber ${step.sequenceNumber + 1} to move up found.`)
            }

            Promise.all([
                dispatch('update', {...step, sequenceNumber: step.sequenceNumber + 1}),
                dispatch('update', {...otherStep, sequenceNumber: otherStep.sequenceNumber - 1})
            ]).then(() => {
                dispatch('remoteUpdate', step.id);
                dispatch('remoteUpdate', otherStep.id);
            });
        }
    },

    updateSavingStatus({commit}, {stepId, isSaving}: { stepId: Id; isSaving: boolean }) {
        commit('setSavingStatus', {stepId, isSaving});
    }
} as ActionTree<TutorialStepState, any>;

const mutations = {
    addTutorialStep(state, tutorialStep: TutorialStep) {
        state.tutorialSteps.push(new TutorialStep(tutorialStep));
    },

    replaceExistingTutorialStep(state, existingTutorialStep: TutorialStep) {
        const index = state.tutorialSteps.findIndex((step: TutorialStep) => step.id === existingTutorialStep.id);
        if (index === -1) {
            throw Error(`No matching tutorial step found for given existing step with id '${existingTutorialStep.id}'.`);
        }
        state.tutorialSteps.splice(index, 1, new TutorialStep(existingTutorialStep));
    },

    setSavingStatus(state, {stepId, isSaving}: { stepId: Id; isSaving: boolean }) {
        if (stepId !== null) {
            state.instructionsSaved = {...state.instructionsSaved, [stepId]: isSaving};
        }
    },

    deleteStep(state, tutorialStep: TutorialStep) {
        const index = state.tutorialSteps.findIndex((step: TutorialStep) => step.id === tutorialStep.id);
        if (index === -1) {
            throw Error(`No matching tutorial step to delete found for given id: ${tutorialStep.id}`);
        }
        state.tutorialSteps.splice(index, 1);
    }
} as MutationTree<TutorialStepState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};