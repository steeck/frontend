import Vue from 'vue'
import Router from 'vue-router'
// import Vuex from 'vuex'
import Main from '@/pages/Main'
import Feeds from '@/pages/Feeds'
import Activities from '@/pages/Activities'
import My from '@/pages/My'
import Login from '@/components/auth/Login'
import Logout from '@/components/auth/Logout'
import Create from '@/pages/Create'
import store from '@/store'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/feeds',
      name: 'Feeds',
      component: Feeds
    },
    {
      path: '/activities',
      name: 'Activities',
      component: Activities
    },
    {
      path: '/my',
      name: 'My',
      component: My
    },
    {
      path: '/auth',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    }
  ]
})
router.beforeResolve((to, from, next) => {
  const defaultLayout = ['Feeds', 'Activities', 'My']
  if (to.name === 'Main') {
    store.commit('SET_LAYOUT', 'main-layout')
  } else if (defaultLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'default-layout')
  } else {
    store.commit('SET_LAYOUT', 'app-layout')
  }
  next()
})

export default router
