import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './modules/auth'
import global from './modules/global'
import me from './modules/me'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    global,
    me
  },
  state: {
    layout: 'default-layout',
    follower: [],
    following: [],
    steemGlobalProperties: {},
    steemPrice: 0,
    manage: {
      mail: {
        report: 'report@gmail.com'
      }
    },
    draft: {},
    contentObj: {}  // obj array with card contents
  },
  actions: {
  },
  mutations: {
    SET_LAYOUT (state, payload) {
      state.layout = payload
    },
    SET_ACCOUNT (state, account) {
      state.account = account
    },
    SET_PROFILE (state, profile) {
      state.profile = profile
    },
    setSteemGlobalProperties (state, payload) {
      state.steemGlobalProperties = payload
    },
    setSteemPrice (state, payload) {
      state.steemPrice = payload
    },
    setCardContents (state, payload) {
      state.contentObj = payload
    }
  },
  getters: {
    steemGlobalProperties (state) {
      return state.steemGlobalProperties
    },
    steemPrice (state) {
      return state.steemPrice
    },
    cardContents (state) {
      return state.contentObj
    }
  },
  plugins: [(new VuexPersistence()).plugin]
})
