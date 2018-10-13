// initial state
const state = {
  accessToken: null,
  tokenExpires: 0,
  username: null
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  login (state, {accessToken, tokenExpires, username}) {
    state.accessToken = accessToken
    state.tokenExpires = tokenExpires
    state.username = username
  },
  logout (state) {
    state.accessToken = null
    state.tokenExpires = 0
    state.username = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
