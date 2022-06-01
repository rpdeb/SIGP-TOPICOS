import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let baseRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/semestres',
    name: 'Semestres',
    component: () => import('../views/Semestres.vue')
  },
]

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes: baseRoutes
})

// router.beforeEach((to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/semestres', ]
//   const authRequired = !publicPages.includes(to.path)
//   const loggedIn = localStorage.getItem('user')
//   if (authRequired && !loggedIn) {
//     return next('/semestres')
    
//   }
//   next()
  
//   setTimeout(function(){
//     window.location.reload();
//   }, 1000);
  
// })


export default router