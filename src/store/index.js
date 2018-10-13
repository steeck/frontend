import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import steemconnect from '@/services/steemconnect'
import global from './modules/global'
import me from './modules/me'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    me
  },
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
    getMe ({ commit }) {
      // console.log(this.state.accessToken)
      if (this.state.accessToken) {
        steemconnect.setAccessToken(this.state.accessToken)
        steemconnect.me((err, res) => {
          if (err) {
            console.log(err)
            return
          }
          commit('SET_ACCOUNT', res.account)
        })
      } else {
        console.error('No access token')
      }
    }
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
