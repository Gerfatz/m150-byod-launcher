import Vue from 'vue'
import Vuex from 'vuex'
import director from '@/store/newModules/director'
import session from '@/store/newModules/session'
import stage from "@/store/newModules/stage";
import stageTarget from "@/store/newModules/stageTarget";
import target from "@/store/newModules/target";
import tutorialTarget from "@/store/newModules/tutorialTarget";
import tutorialStep from "@/store/newModules/tutorialStep";
import attendSession from "@/store/newModules/attendSession";
import orchestrateSession from "@/store/newModules/orchestrateSession";
import signalR from "@/store/newModules/signalR";
import createSignalRPlugin from "@/store/plugin/signalR";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoading: false,
        loadingCounter: 0,
    },
    getters: {
        isLoading: (state) => {
            return state.loadingCounter > 0;
        }
    },
    actions: {
        START_LOADING({commit}) {
            commit('SET_LOADING_STATE', true);
        },

        FINISH_LOADING({commit}) {
            commit('SET_LOADING_STATE', false);
        },

        SET_LOADING({commit}, isLoading: boolean) {
            commit('SET_LOADING_STATE', isLoading);
        }

    },
    mutations: {
        SET_LOADING_STATE(state, newLoadingStage: boolean) {
            if (newLoadingStage) {
                state.loadingCounter++;
            } else {
                state.loadingCounter--;
            }
            state.isLoading = newLoadingStage;
        }
    },
    modules: {
        director,
        session,
        stage,
        stageTarget,
        target,
        tutorialTarget,
        tutorialStep,
        signalR,
        attendSession,
        orchestrateSession,
    },
    plugins: [createSignalRPlugin()]
});