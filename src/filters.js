import Vue from 'vue'

Vue.filter('tag', function (tag) {
  if (tag === 'steeck-life') return '라이프'
  else if (tag === 'steeck-hot') return '핫이슈'
  else if (tag === 'steeck-game') return '게임'
  else if (tag === 'steeck-travel') return '여행'
  else return tag
})
/** @property {Function} convdate */
Vue.filter('convdate', function (date) {
  const utc = new Date(date)
  return new Date(utc.setHours(utc.getHours() + 9))
})
Vue.filter('ago', function (date) {
  const diff = (new Date() - new Date(date)) / 1000 / 60  // min
  if (diff < 60) return Math.floor(diff) + '분 전'
  else if (diff < 60 * 24) return Math.floor(diff / 60) + '시간 전'
  else return Math.floor(diff / 60 / 24) + '일 전'
})
