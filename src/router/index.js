import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/funcionario',
        name: 'Funcionario',
        component: () => import('../views/Funcionario.vue')
    },
    {
        path: '/usuarios',
        name: 'Usuarios',
        component: () => import('../views/Usuarios.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
