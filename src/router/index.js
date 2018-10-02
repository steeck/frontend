import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Login from '@/pages/auth/Login'
import Logout from '@/pages/auth/Logout'
import Main from '@/pages/Main'
import Feeds from '@/pages/Feeds'
import Activities from '@/pages/Activities'
import My from '@/pages/My'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
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
