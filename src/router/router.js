import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let baseRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
]

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: baseRoutes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/funcionario', ]
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  if (authRequired && !loggedIn) {
    return next('/funcionario')
    
  }
  next()
  
  setTimeout(function(){
    window.location.reload();
  }, 1000);
  
})


export default router