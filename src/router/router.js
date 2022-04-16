import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/NewLogin'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

let baseRoutes = [
  {
    path: '/',
    redirect: '/newlogin'
  },
  {
    path: '/newlogin',
    name: 'Login',
    component: Login
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
  const publicPages = ['/newlogin', ]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (authRequired && !loggedIn) {
    return next('/newlogin')
  }
  next()
})

export default router