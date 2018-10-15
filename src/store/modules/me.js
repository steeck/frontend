import steemconnect from '@/services/steemconnect'
import steem from '@/services/steem'

/**
 * @property follow.follower_count : 나를 팔로우한 유저 수
 * @property follow.following_count : 내가 팔로잉한 유저 수
 * @type {{account: {}, profile: {}, follow: {}, follower: Array, following: Array}}
 */

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
  },
  follow: {},
  follower: [],
  following: []
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
  },
  getFollowInfo: function ({ rootState, commit }) {
    steem.api
      .callAsync('get_follow_count', [rootState.me.account.name])
      .then(function (result) {
        commit('setFollow', result)
      })
      .catch(err => {
        console.log(err)
      })
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
  setFollow (state, value) {
    state.follow = value
  },
  addFollowing (state, name) {
    console.log('call add following')
    state.following.push(name)
  },
  removeFollowing (state, name) {
    if (state.following.indexOf(name) > -1) {
      state.following.splice(state.following.indexOf(name), 1)
    }
  },
  clear (state) {
    state.account = {}
    state.profile = {}
    state.follow = {}
    state.follower = []
    state.following = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
