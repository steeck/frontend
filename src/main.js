import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import './filters'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueHead from 'vue-head'
import VueMoment from 'vue-moment'

Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(VueHead)
Vue.use(VueMoment)

window.vm = store

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
