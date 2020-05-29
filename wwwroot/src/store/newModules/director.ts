import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Director} from "@/models/director";
import {directorApi} from "@/api/directorApi";
import {Id} from "@/models/idType";

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
    CREATE({commit}, director: Director) {
        return directorApi.createDirector(director)
            .then(result => {
                commit(localIdentifier(directorIdentifiers.mutations.setDirector), result);
            });
    },

    UPDATE({state, commit}, updateData: Partial<Director>) {
        const director = state.director;
        director.update(updateData);
        commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
    },

    REMOTE_UPDATE({state, commit}) {
        if (state.director.id != null) {
            const director = state.director;
            return directorApi.updateDirector(director)
                .then(() => {
                    commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
                });
        }
    },

    LOAD({commit}, directorId: Id) {
        directorApi.getDirector(directorId)
            .then(director => {
                commit(localIdentifier(directorIdentifiers.mutations.setDirector), director);
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