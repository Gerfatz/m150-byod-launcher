import {TutorialTarget} from "@/models/tutorialTarget";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {targetApi} from "@/api/targetApi";
import {tutorialStepIdentifiers} from "@/store/newModules/tutorialStep";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'tutorialTarget/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const tutorialTargetIdentifiers = {
    actions: {
        create: modulePrefix + 'CREATE',
        update: modulePrefix + 'UPDATE',
        remoteUpdate: modulePrefix + 'REMOTE_UPDATE',
    },
    mutations: {
        set: modulePrefix + 'SET'
    }
}

export interface TutorialTargetState {
    newTutorialTarget: TutorialTarget;
    tutorialTargets: TutorialTarget[];
}

const state = {
    newTutorialTarget: new TutorialTarget(),
    tutorialTargets: [],
} as TutorialTargetState;

const getters = {} as GetterTree<TutorialTargetState, any>;

const actions = {
    CREATE({state, commit, dispatch}) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return targetApi.createTarget(state.newTutorialTarget)
            .then(tutorialTarget => {
                commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
                return tutorialTarget;
            })
            .then(tutorialTarget => {
                dispatch(tutorialStepIdentifiers.actions.initialize, tutorialTarget.id, {root: true});
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    UPDATE({state, commit}, updateData: Partial<TutorialTarget>) {
        const tutorialTarget = state.newTutorialTarget;
        tutorialTarget.update(updateData);
        commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
    },

    REMOTE_UPDATE({state, dispatch, commit}) {
        if (state.newTutorialTarget.id != null) {
            const tutorialTarget = state.newTutorialTarget;
            dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
            return targetApi.updateTarget(tutorialTarget)
                .then(() => {
                    commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    },
} as ActionTree<TutorialTargetState, any>;

const mutations = {
    SET(state, tutorialTarget: TutorialTarget) {
        state.newTutorialTarget = new TutorialTarget(tutorialTarget);
    },
} as MutationTree<TutorialTargetState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}