import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";

export interface SignalRState {
    connected: boolean;
    error: string | null;
    sessionId: Id;
    participantId: Id;
    displayName: string;
}

const state = {
    connected: false,
    error: null,
    sessionId: null,
    participantId: null,
    displayName: '',
} as SignalRState;

const getters = {} as GetterTree<SignalRState, any>;

const actions = {
    connectionOpened({commit}) {
        commit('SET_CONNECTION', true);
    },

    connectionClosed({commit}) {
        commit('SET_CONNECTION', false);
    },

    connectionError({commit}, error) {
        commit('SET_ERROR', error);
    },

    startSession({commit}, sessionId: Id) {
        commit('START_SESSION', sessionId);
    },

    joinSession({commit}, {sessionId, displayName, username, password}: { sessionId: Id; displayName: string; username: string; password: string }) {
        commit('JOIN_SESSION', {sessionId, displayName, username, password});
    },

    joinSessionAsParticipant({commit}, participantId: Id) {
        commit('JOIN_SESSION_AS_PARTICIPANT', participantId);
    }
} as ActionTree<SignalRState, any>;

const mutations = {
    SET_CONNECTION(state, connectionState) {
        state.connected = connectionState;
    },

    SET_ERROR(state, error) {
        state.error = error;
    },

    START_SESSION(state, sessionId: Id) {
        state.sessionId = sessionId;
    },

    JOIN_SESSION(state, {sessionId, displayName}: { sessionId: Id; displayName: string }) {
        state.sessionId = sessionId;
        state.displayName = displayName;
    },

    JOIN_SESSION_AS_PARTICIPANT(state, participantId: Id) {
        state.participantId = participantId;
    }
} as MutationTree<SignalRState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}