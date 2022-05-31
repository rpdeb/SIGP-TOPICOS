import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/semestres',
    name: 'Semestres',
    component: () => import('../views/Semestres.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/salas',
    name: 'Salas',
    component: () => import('../views/Salas.vue')
  },
  {
    path: '/curso',
    name: 'Curso',
    component: () => import('../views/Curso.vue')
  },
  {
    path: '/campus',
    name: 'Campus',
    component: () => import('../views/Campus.vue')
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue')
  },
  {
    path: '/bloco',
    name: 'Bloco',
    component: () => import('../views/Bloco.vue')
  },
  {
    path: '/horarios',
    name: 'Horarios',
    component: () => import('../views/Horarios.vue')
  },
  {
    path: '/oferta',
    name: 'Oferta',
    component: () => import('../views/Oferta.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
