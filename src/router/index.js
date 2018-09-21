import Vue from 'vue'
import Router from 'vue-router'
import staticRouters from './staticRouters'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import store from '../store'
import Cookies from 'js-cookie'
NProgress.configure({ showSpinner: false })// NProgress Configuration

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: staticRouters
})
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  next()
  store.dispatch('setId', Cookies.get('UserId'))
  let UserID = store.getters.user_id
  if (to.path !== '/login' && !UserID) {
    next('/login')
  }
  if (to.path === '/login' && UserID) {
    next('/index/dashbodrd')
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
export default router
