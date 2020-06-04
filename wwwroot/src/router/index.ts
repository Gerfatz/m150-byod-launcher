import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NewSession from '../views/NewSession.vue'
import NewTutorialTarget from '../views/NewTutorialTarget.vue'
import JoinSession from '../views/JoinSession.vue'
import AttendSession from '../views/AttendSession.vue'
import OrchestrateSession from "@/views/OrchestrateSession.vue";
import EditSession from "@/views/EditSession.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/new-session',
        name: 'new session',
        component: NewSession
    },
    {
        path: '/edit-session',
        name: 'edit session',
        component: EditSession,
        props: true
    },
    {
        path: '/new-tutorial-target',
        name: 'new tutorial target',
        component: NewTutorialTarget
    },
    {
        path: '/join-session/:participantId',
        name: 'join session',
        component: JoinSession,
        props: true
    },
    {
        path: '/orchestrate-session',
        name: 'orchestrate session',
        component: OrchestrateSession,
    },
    {
        path: '/attend-session',
        name: 'attend session',
        component: AttendSession,
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
