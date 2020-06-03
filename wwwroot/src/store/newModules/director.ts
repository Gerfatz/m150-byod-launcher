import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Director} from "@/models/director";
import {directorApi} from "@/api/directorApi";
import {Id} from "@/models/idType";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'director/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const directorIdentifiers = {
    actions: {
        create: modulePrefix + 'CREATE',
        update: modulePrefix + 'UPDATE',
        remoteUpdate: modulePrefix + 'REMOTE_UPDATE',
        load: modulePrefix + 'LOAD',
    },
    mutations: {
        setDirector: modulePrefix + 'SET_DIRECTOR',
    }
};

export interface DirectorState {
    director: Director;
}

const state = {
    director: new Director(),
} as DirectorState;

const getters = {
    displayName: (state) => state.director.displayName ?? '',
    email: (state) => state.director.email ?? '',
} as GetterTree<DirectorState, any>;

const actions = {
    CREATE({commit, dispatch}, director: Director) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return directorApi.createDirector(director)
            .then(result => {
                commit(localIdentifier(directorIdentifiers.mutations.setDirector), result);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    UPDATE({state, commit}, updateData: Partial<Director>) {
        const director = state.director;
        director.update(updateData);
        commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
    },

    REMOTE_UPDATE({state, dispatch, commit}) {
        if (state.director.id != null) {
            dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
            const director = state.director;
            return directorApi.updateDirector(director)
                .then(() => {
                    commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    },

    LOAD({dispatch, commit}, directorId: Id) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        directorApi.getDirector(directorId)
            .then(director => {
                commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    }

} as ActionTree<DirectorState, any>;

const mutations = {
    SET_DIRECTOR(state, directorData: Director) {
        state.director = new Director(directorData);
    }
} as MutationTree<DirectorState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}