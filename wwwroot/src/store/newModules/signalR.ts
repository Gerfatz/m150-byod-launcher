import {ActionTree, GetterTree, MutationTree} from "vuex";
import {Id} from "@/models/idType";

const modulePrefix = 'signalR/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const signalRIdentifiers = {
    actions: {
        connectionOpened: modulePrefix + 'CONNECTION_OPENED',
        connectionClosed: modulePrefix + 'CONNECTION_CLOSED',
        connectionError: modulePrefix + 'CONNECTION_ERROR',
        startSession: modulePrefix + 'START_SESSION',
        joinSession: modulePrefix + 'JOIN_SESSION',
        joinSessionAsParticipant: modulePrefix + 'JOIN_SESSION_AS_PARTICIPANT',
    },
    mutations: {
        setConnection: modulePrefix + 'SET_CONNECTION',
        setError: modulePrefix + 'SET_ERROR',
        startSession: modulePrefix + 'START_SESSION',
        joinSession: modulePrefix + 'JOIN_SESSION',
        joinSessionAsParticipant: modulePrefix + 'JOIN_SESSION_AS_PARTICIPANT',
    }
};

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
    CONNECTION_OPENED({commit}) {
        commit(localIdentifier(signalRIdentifiers.mutations.setConnection), true);
    },

    CONNECTION_CLOSED({commit}) {
        commit(localIdentifier(signalRIdentifiers.mutations.setConnection), false);
    },

    CONNECTION_ERROR({commit}, error) {
        commit(localIdentifier(signalRIdentifiers.mutations.setError), error);
    },

    START_SESSION({commit}, sessionId: Id) {
        commit(localIdentifier(signalRIdentifiers.mutations.startSession), sessionId);
    },

    JOIN_SESSION({commit}, {sessionId, displayName, username, password}: { sessionId: Id; displayName: string; username: string; password: string }) {
        commit(localIdentifier(signalRIdentifiers.mutations.joinSession), {sessionId, displayName, username, password});
    },

    JOIN_SESSION_AS_PARTICIPANT({commit}, participantId: Id) {
        commit(localIdentifier(signalRIdentifiers.mutations.joinSessionAsParticipant), participantId);
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