// import steemconnect from '@/services/steemconnect'
import steem from '@/services/steem'

/**
 * @property follow.follower_count : 나를 팔로우한 유저 수
 * @property follow.following_count : 내가 팔로잉한 유저 수
 * @type {{account: {}, profile: {}, follow: {}, follower: Array, following: Array}}
 */

// initial state
const state = {
  account: {},
  rc: {},
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
  following: [],
  ignore: [],
  followDoing: false
}

// getters
const getters = {}

// actions
const actions = {
  getAccount ({ rootState, commit }) {
    if (rootState.auth.accessToken) {
      steem.api.getAccounts([rootState.auth.username], function (err, res) {
        if (err) {
          console.log(err)
          return
        }
        commit('setAccount', res[0])
        commit('setProfile', res[0])
      })

      // steemconnect.setAccessToken(rootState.auth.accessToken)
      // steemconnect.me((err, res) => {
      //   if (err) {
      //     console.log(err)
      //     return
      //   }
      //   commit('setAccount', res.account)
      //   commit('setProfile', res.account)
      // })
    } else {
      console.error('No access token')
    }
  },
  getRC ({ rootState, commit }) {
    steem.api.send('rc_api', {
      method: 'find_rc_accounts',
      params: { 'accounts': [rootState.auth.username] }
    }, function (err, res) {
      if (err) {
        console.log(err)
        return
      }
      // console.log(res)
      commit('setRC', res.rc_accounts[0])
    })
  },
  getFollowInfo: function ({ rootState, commit }) {
    steem.api
      .callAsync('get_follow_count', [rootState.auth.username])
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
  setRC (state, rc) {
    state.rc = rc
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
  addIgnore (state, name) {
    console.log('call add ignore')
    state.ignore.push(name)
  },
  removeIgnore (state, name) {
    if (state.ignore.indexOf(name) > -1) {
      state.ignore.splice(state.ignore.indexOf(name), 1)
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
