import steemconnect from '@/services/steemconnect'

// initial state
const state = {
  account: {},
  profile: {
    // about: '',
    // coverImage: '',
    // location: '',
    // name: '',
    // profileImage: 'https://via.placeholder.com/100x100',
    // website: ''
  }
}

// getters
const getters = {}

// actions
const actions = {
  getAccount ({ rootState, commit }) {
    if (rootState.auth.accessToken) {
      steemconnect.setAccessToken(rootState.auth.accessToken)
      steemconnect.me((err, res) => {
        if (err) {
          console.log(err)
          return
        }
        commit('setAccount', res.account)
        commit('setProfile', res.account)
      })
    } else {
      console.error('No access token')
    }
  }
}

// mutations
const mutations = {
  setAccount (state, account) {
    state.account = account
  },
  setProfile (state, account) {
    let {created} = account
    let {
      about = '',
      cover_image: coverImage = '',
      location = '',
      name = '',
      profile_image: profileImage = 'https://via.placeholder.com/100x100',
      website = ''
    } = JSON.parse(account.json_metadata)
    let profile = Object.assign({created}, {about, coverImage, location, name, profileImage, website})
    state.profile = profile
  },
  clear (state) {
    state.account = {}
    state.profile = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
