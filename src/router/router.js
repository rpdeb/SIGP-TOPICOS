import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/HomeView'
import Login from '@/views/NewLogin'
import SignUp from '@/views/NewSignUp'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

let baseRoutes = [
  {
    path: '/',
    redirect: '/newlogin'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/newlogin',
    name: 'Login',
    component: Login
  },
  {
    path: '/newsignup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: baseRoutes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/newlogin', '/newsignup']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (authRequired && !loggedIn) {
    return next('/newlogin')
  }
  next()
})

export default router