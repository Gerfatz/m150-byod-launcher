import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Director} from "@/models/director";
import {directorApi} from "@/api/directorApi";
import {Id} from "@/models/idType";

export interface DirectorState {
    activeDirector: Director;
}

const state = {
    activeDirector: new Director(),
} as DirectorState;

const getters = {
    displayName: (state) => state.activeDirector.displayName ?? '',
    email: (state) => state.activeDirector.email ?? '',
} as GetterTree<DirectorState, any>;

const actions = {
    create({commit}, director: Director) {
        return directorApi.createDirector(director)
            .then(result => {
                commit("setActiveDirector", result);
            });
    },

    update({state, commit}, updateData: Partial<Director>) {
        const director = state.activeDirector;
        director.update(updateData);
        commit('setActiveDirector', director);
    },

    remoteUpdate({state, commit}) {
        if (state.activeDirector.id != null) {
            const director = state.activeDirector;
            return directorApi.updateDirector(director)
                .then(() => {
                    commit('setActiveDirector', director);
                });
        }
    },

    loadDirector({commit}, directorId: Id) {
        directorApi.getDirector(directorId)
            .then(director => {
                commit('setActiveDirector', director);
            });
    }

} as ActionTree<DirectorState, any>;

const mutations = {
    setActiveDirector(state, directorData: Director) {
        state.activeDirector = new Director(directorData);
    }
} as MutationTree<DirectorState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}