import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Login from '@/pages/auth/Login'
import Logout from '@/pages/auth/Logout'
import Main from '@/pages/Main'
import Feeds from '@/pages/Feeds'
import Categories from '@/pages/Categories'
import Activities from '@/pages/Activities'
import My from '@/pages/My'
import Lease from '@/pages/center/Lease'
import Delegate from '@/pages/center/Delegate'
import Transactions from '@/pages/center/Transactions'
import RequestVote from '@/pages/center/RequestVote'
import UserProfile from '@/pages/UserProfile'
import Post from '@/pages/Post'
import View from '@/pages/View'
import Search from '@/pages/Search'
import Account from '@/pages/Account'

import Create from '@/pages/Create'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
      path: '/categories/:category',
      name: 'Categories',
      component: Categories,
      props: true
    },
    {
      path: '/activities',
      name: 'Activities',
      component: Activities
    },
    {
      path: '/my/:tab',
      name: 'My',
      component: My
    },
    {
      path: '/user/:username',
      name: 'User',
      component: UserProfile
    },
    {
      path: '/center/lease',
      name: 'Lease',
      component: Lease
    },
    {
      path: '/center/delegate',
      name: 'Delegate',
      component: Delegate
    },
    {
      path: '/center/request_vote',
      name: 'RequestVote',
      component: RequestVote
    },
    {
      path: '/center/transactions',
      name: 'Transactions',
      component: Transactions
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/:category/:author/:permlink',
      name: 'PostView',
      component: Post
    },
    {
      path: '/posts/:id',
      name: 'View',
      component: View,
      props: true
    },
    {
      path: '/search/:q',
      name: 'Search',
      component: Search,
      props: true
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    }
  ]
})
router.beforeResolve((to, from, next) => {
  const defaultLayout = ['My', 'User', 'PostView']
  const centerLayout = ['Lease', 'Delegate', 'RequestVote', 'Transactions']
  const viewLayout = ['Feeds', 'View', 'Search']
  const listLayout = ['Activities']
  const categoryLayout = ['Categories']

  // const appLayout = ['Delegate']
  if (to.name === 'Main') {
    store.commit('SET_LAYOUT', 'main-layout')
  } else if (defaultLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'default-layout')
  } else if (listLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'list-layout')
  } else if (categoryLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'category-layout')
  } else if (viewLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'view-layout')
  } else if (centerLayout.indexOf(to.name) >= 0) {
    store.commit('SET_LAYOUT', 'center-layout')
  } else {
    store.commit('SET_LAYOUT', 'app-layout')
  }
  // console.log(this.$store.getters.layout)
  next()
})
router.afterEach((to, from) => {
  fetch(location.protocol + '//' + location.host)
    .then(response => {
      if (response.status !== 200) {
        throw new Error('offline')
      }
      return response.text()
    })
    .then(html => {
      if (!store.state.version) {
        store.commit('setAppVersion', html)
      } else {
        if (store.state.version !== html) {
          store.commit('setAppVersion', html)
          console.info('Reload application')
          location.reload()
        }
      }
    })
})

export default router
