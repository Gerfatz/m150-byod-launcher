import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Session} from "@/models/session";
import {sessionApi} from "@/api/sessionApi";
import {directorApi} from "@/api/directorApi";

export interface SessionState {
    activeSession: Session;
}

const state = {
    activeSession: new Session(),
} as SessionState;

const getters = {
    currentAccessCode(state) {
        if (!state.activeSession || !state.activeSession.accessCode) {
            return null;
        }
        return parseInt(state.activeSession.accessCode);
    },

    currentEditCode(state) {
        if (!state.activeSession || !state.activeSession.editCode) {
            return null;
        }
        return parseInt(state.activeSession.editCode);
    }
} as GetterTree<SessionState, any>;

const actions = {
    createAlongNewDirector({state, commit, rootState}) {
        return directorApi.createDirector(rootState.director.activeDirector)
            .then(director => {
                commit("director/setActiveDirector", director, {root: true});
                const session = state.activeSession;
                session.directorId = director.id;
                return session;
            })
            .then(session => {
                return sessionApi.createSession(session);
            })
            .then(session => {
                commit("setActiveSession", session);
            });
    },

    update({state, commit}, updateData: Partial<Session>) {
        const session = state.activeSession;
        session.update(updateData);
        commit('setActiveSession', session);
    },

    remoteUpdate({state, commit}) {
        if (state.activeSession.id != null) {
            const session = state.activeSession;
            return sessionApi.updateSession(session)
                .then(() => {
                    commit('setActiveSession', session);
                });
        }
    },
    
    loadByAccessCode(_, accessCode: string){
        return sessionApi.getByAccessCode(accessCode);
    },
    
} as ActionTree<SessionState, any>;

const mutations = {
    setActiveSession(state, session: Session) {
        state.activeSession = new Session(session);
    },
} as MutationTree<SessionState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}