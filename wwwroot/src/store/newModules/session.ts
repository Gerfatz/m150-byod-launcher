import {GetterTree, MutationTree, ActionTree} from "vuex";
import {Session} from "@/models/session";
import {sessionApi} from "@/api/sessionApi";
import {Id} from "@/models/idType";
import {stageIdentifiers} from "@/store/newModules/stage";
import {stageTargetIdentifiers} from "@/store/newModules/stageTarget";
import {Target} from "@/models/target";
import {tutorialStepIdentifiers} from "@/store/newModules/tutorialStep";
import {directorIdentifiers} from "@/store/newModules/director";
import {rootIdentifiers} from "@/store/identifiers";

const modulePrefix = 'session/'

function localIdentifier(identifier: string) {
    return identifier.substring(modulePrefix.length);
}

export const sessionIdentifiers = {
    actions: {
        create: modulePrefix + 'CREATE',
        update: modulePrefix + 'UPDATE',
        remoteUpdate: modulePrefix + 'REMOTE_UPDATE',
        loadByAccessCode: modulePrefix + 'LOAD_BY_ACCESS_CODE',
        loadByEditCode: modulePrefix + 'LOAD_BY_EDIT_CODE',
        downloadAllData: modulePrefix + 'DOWNLOAD_ALL_DATA',
    },
    mutations: {
        setSession: modulePrefix + 'SET_SESSION'
    }
}

export interface SessionState {
    session: Session;
}

const state = {
    session: new Session(),
} as SessionState;

const getters = {
    currentAccessCode(state) {
        if (!state.session || !state.session.accessCode) {
            return null;
        }
        return parseInt(state.session.accessCode);
    },

    currentEditCode(state) {
        if (!state.session || !state.session.editCode) {
            return null;
        }
        return parseInt(state.session.editCode);
    }
} as GetterTree<SessionState, any>;

const actions = {
    CREATE({dispatch, commit}, session: Session) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return sessionApi.createSession(session)
            .then(session => {
                commit(localIdentifier(sessionIdentifiers.mutations.setSession), session);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    UPDATE({state, commit}, updateData: Partial<Session>) {
        const session = state.session;
        session.update(updateData);
        commit(localIdentifier(sessionIdentifiers.mutations.setSession), session);
    },

    REMOTE_UPDATE({state, dispatch, commit}) {
        if (state.session.id != null) {
            dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
            const session = state.session;
            return sessionApi.updateSession(session)
                .then(() => {
                    commit(localIdentifier(sessionIdentifiers.mutations.setSession), session);
                })
                .finally(() => {
                    dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
                });
        }
    },

    LOAD_BY_ACCESS_CODE({dispatch}, accessCode: string) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return sessionApi.getByAccessCode(accessCode)
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    LOAD_BY_EDIT_CODE({dispatch, commit}, editCode: string) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return sessionApi.getByEditCode((editCode))
            .then(sessions => {
                if (sessions.length === 1) {
                    commit(localIdentifier(sessionIdentifiers.mutations.setSession), sessions[0]);
                    return sessions[0];
                }
                return null;
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    },

    DOWNLOAD_ALL_DATA({state, rootState, commit, dispatch}, sessionId: Id) {
        dispatch(rootIdentifiers.actions.startLoading, null, {root: true});
        return sessionApi.getSession(sessionId)
            .then(session => {
                commit(localIdentifier(sessionIdentifiers.mutations.setSession), session);
                return session;
            })
            .then((session: Session) => {
                dispatch(directorIdentifiers.actions.load, session.directorId, {root: true});
            })
            .then(() => {
                return dispatch(stageIdentifiers.actions.load, state.session.id, {root: true});
            })
            .then(() => {
                const requests = [];
                for (const stage of rootState.stage.stages) {
                    requests.push(dispatch(stageTargetIdentifiers.actions.load, stage.id, {root: true}));
                }
                return Promise.all(requests);
            })
            .then(() => {
                const tutorialStepPromises = [];
                const targetsArray = Object.values(rootState.stageTarget.stageTargets as { [key: string]: Target[] });
                for (const tutorialTargets of targetsArray) {
                    for (const tutorialTarget of tutorialTargets) {
                        if (!Object.prototype.hasOwnProperty.call(tutorialTarget, 'script')) {
                            tutorialStepPromises.push(
                                dispatch(tutorialStepIdentifiers.actions.load, tutorialTarget.id, {root: true}))
                            ;
                        }
                    }
                }
                return Promise.all(tutorialStepPromises);
            })
            .finally(() => {
                dispatch(rootIdentifiers.actions.finishLoading, null, {root: true});
            });
    }

} as ActionTree<SessionState, any>;

const mutations = {
    SET_SESSION(state, session: Session) {
        state.session = new Session(session);
    },
} as MutationTree<SessionState>;

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}