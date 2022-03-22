import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
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
  }
]

const router = new VueRouter({
  routes
})

export default router
