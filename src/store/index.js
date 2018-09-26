import Vue from 'vue'
import Vuex from 'vuex'
import VueSteemConnect from 'vue-steemconnect'

Vue.use(Vuex)
Vue.use(VueSteemConnect, {
  app: 'app.steeck',
  callbackURL: 'http://localhost:8080/#/auth',
  scope: ['vote', 'comment', 'comment_options', 'custom_json']
})

export default new Vuex.Store({
  state: {
    layout: 'default-layout',
    steemGlobalProperties: {},
    steemPrice: 0
  },
  mutations: {
    SET_LAYOUT (state, payload) {
      state.layout = payload
    },
    setSteemGlobalProperties (state, payload) {
      state.steemGlobalProperties = payload
    },
    setSteemPrice (state, payload) {
      state.steemPrice = payload
    }
  },
  getters: {
    layout (state) {
      return state.layout
    },
    steemGlobalProperties (state) {
      return state.steemGlobalProperties
    },
    steemPrice (state) {
      return state.steemPrice
    }
  },
  modules: {
    steemconnect: Vue.SteemConnectStore
  }
})
