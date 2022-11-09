import {createWebHistory, createRouter} from 'vue-router'

const constRouter = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/page/home')
    },
    {
        path: '/searchBangumi',
        name: 'searchBangumi',
        component: () => import('@/page/searchBangumi'),

    },
    {
        path: '/addBangumi',
        name: 'addBangumi',
        component: () => import('@/components/changBangumi')
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: constRouter,
})

export default router;
