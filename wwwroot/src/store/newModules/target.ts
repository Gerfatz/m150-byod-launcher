import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Target} from "@/models/target";
import {targetApi} from "@/api/targetApi";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'target/';

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const targetIdentifiers = {
    actions: {
        load: modulePrefix + 'LOAD',
    },
    mutations: {
        set: modulePrefix + 'SET',
    }
}

export interface TargetState {
    targets: Target[];
}

const state = {
    targets: []
} as TargetState;

const getters = {} as GetterTree<TargetState, any>;

const actions = {
    LOAD({dispatch, commit}) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return targetApi.getTargets()
            .then(targets => {
                commit(localIdentifier(targetIdentifiers.mutations.set), targets)
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            })
    }
} as ActionTree<TargetState, any>;

const mutations = {
    SET(state, targets: Target[]) {
        state.targets = targets.map(target => new Target(target));
    }
} as MutationTree<TargetState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}