import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    layout: 'default-layout',
    accessToken: null,
    tokenExpires: 0,
    username: null,
    account: {},
    profile: {
      profileImage: 'https://via.placeholder.com/100x100',
      about: 'Update about me',
      name: '',
      location: '',
      website: 'https://steeck.io',
      coverImage: ''
    },
    steemGlobalProperties: {},
    steemPrice: 0,
    draft: {}
  },
  mutations: {
    LOGIN (state, {accessToken, tokenExpires, username}) {
      state.accessToken = accessToken
      state.tokenExpires = tokenExpires
      state.username = username
    },
    LOGOUT (state) {
      state.accessToken = null
      state.tokenExpires = 0
      state.username = null
      state.account = {}
      state.profile = {
        profileImage: 'https://via.placeholder.com/100x100',
        about: 'Update about me',
        name: '',
        location: '',
        website: 'https://steeck.io',
        coverImage: ''
      }
    },
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
    }
  },
  getters: {
    steemGlobalProperties (state) {
      return state.steemGlobalProperties
    },
    steemPrice (state) {
      return state.steemPrice
    }
  },
  modules: {
  },
  plugins: [(new VuexPersistence()).plugin]
})
