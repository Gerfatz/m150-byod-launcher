import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Target} from "@/models/target";
import {targetApi} from "@/api/targetApi";

export interface TargetState {
    availableTargets: Target[];
}

const state = {
    availableTargets: []
} as TargetState;

const getters = {} as GetterTree<TargetState, any>;

const actions = {
    loadAvailableTargets({commit}) {
        return targetApi.getTargets()
            .then(targets => {
                commit('setActiveTargets', targets)
            })
    }
} as ActionTree<TargetState, any>;

const mutations = {
    setActiveTargets(state, targets: Target[]) {
        state.availableTargets = targets;
    }
} as MutationTree<TargetState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}