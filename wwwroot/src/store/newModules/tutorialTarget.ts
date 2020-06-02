import {TutorialTarget} from "@/models/tutorialTarget";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {targetApi} from "@/api/targetApi";
import {tutorialStepIdentifiers} from "@/store/newModules/tutorialStep";

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
        return targetApi.createTarget(state.newTutorialTarget)
            .then(tutorialTarget => {
                commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
                return tutorialTarget;
            })
            .then(tutorialTarget => {
                dispatch(tutorialStepIdentifiers.actions.initialize, tutorialTarget.id, {root: true});
            })
    },

    UPDATE({state, commit}, updateData: Partial<TutorialTarget>) {
        const tutorialTarget = state.newTutorialTarget;
        tutorialTarget.update(updateData);
        commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
    },

    REMOTE_UPDATE({state, commit}) {
        if (state.newTutorialTarget.id != null) {
            const tutorialTarget = state.newTutorialTarget;
            return targetApi.updateTarget(tutorialTarget)
                .then(() => {
                    commit(localIdentifier(tutorialTargetIdentifiers.mutations.set), tutorialTarget);
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