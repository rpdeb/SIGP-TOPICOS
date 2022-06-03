import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let baseRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/semestres',
    name: 'Semestres',
    component: () => import('../views/Semestres.vue')
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
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: baseRoutes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/signup']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next()

  

})

export default router
