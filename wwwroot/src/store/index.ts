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