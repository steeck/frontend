import steem from '@/services/steem'

// initial state
const state = {
  properties: {
    shares: 0,
    fund: 0
  }
}

// getters
const getters = {}

// actions
const actions = {
  getProperties ({ commit }) {
    steem.api.getDynamicGlobalProperties((err, res) => {
      if (err) {
        console.log(err)
        return
      }
      commit('setProperties', {
        shares: parseFloat(res.total_vesting_shares),
        fund: parseFloat(res.total_vesting_fund_steem)
      })
    })
  }
}

// mutations
const mutations = {
  setProperties (state, properties) {
    state.properties = properties
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
