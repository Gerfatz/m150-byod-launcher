import Vue from 'vue'
import Vuex from 'vuex'
import director from './newModules/director'
import session from './newModules/session'
import stage from "@/store/modules/stage";
import target from "@/store/modules/target";
import tutorialTarget from "@/store/modules/tutorialTarget";
import tutorialStep from "@/store/modules/tutorialStep";
import signalR from "@/store/modules/signalR";
import attendSession from "@/store/modules/attendSession";
import orchestrateSession from "@/store/modules/orchestrateSession";
import createSignalRPlugin from "@/store/plugin/signalR";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        director,
        session,
        stage,
        target,
        tutorialTarget,
        tutorialStep,
        signalR,
        attendSession,
        orchestrateSession,
    },
    plugins: [createSignalRPlugin()]
});