import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: 'Sala',
    name: 'Sala',
    component: () => import('../views/Sala.vue')
  },
  {
    path: 'Horario',
    name: 'Horario',
    component: () => import('../views/Horario.vue')
  },
  {
    path: 'Semestre',
    name: 'Sesmestre',
    component: () => import('../views/Semestre.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
