import {TutorialTarget} from "@/models/tutorialTarget";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {targetApi} from "@/api/targetApi";
import {Id} from "@/models/idType";

export interface TutorialTargetState {
    activeTutorialTarget: TutorialTarget;
}

const state = {
    activeTutorialTarget: new TutorialTarget(),
} as TutorialTargetState;

const getters = {} as GetterTree<TutorialTargetState, any>;

const actions = {
    create({state, commit}) {
        return targetApi.createTarget(state.activeTutorialTarget)
            .then(result => {
                commit('setActiveTutorialTarget', result);
            })
    },

    update({state, commit}, updateData: Partial<TutorialTarget>) {
        const tutorialTarget = state.activeTutorialTarget;
        tutorialTarget.update(updateData);
        commit('setActiveTutorialTarget', tutorialTarget);
    },

    remoteUpdate({state, commit}) {
        if (state.activeTutorialTarget.id != null) {
            const tutorialTarget = state.activeTutorialTarget;
            return targetApi.updateTarget(tutorialTarget)
                .then(() => {
                    commit('setActiveTutorialTarget', tutorialTarget);
                });
        }
    },
} as ActionTree<TutorialTargetState, any>;

const mutations = {
    setActiveTutorialTarget(state, tutorialTarget: TutorialTarget) {
        state.activeTutorialTarget = new TutorialTarget(tutorialTarget);
    },

    addTutorialStepId(state, tutorialStepId: Id) {
        state.activeTutorialTarget.stepIds.push(tutorialStepId);
    }
} as MutationTree<TutorialTargetState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}