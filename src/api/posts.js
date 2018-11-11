import http from '@/services/http'

export default {
  upload (data) {
    return http.post('/create', data)
  },
  create (data) {
    return http.post('/posts', data)
  },
  delete (data) {
    return http.post('/delete', data)
  },
  get (id) {
    return http.get('/posts/' + id)
  },
  getByCategory (data) {
    return http.get('/posts/c/' + data.category)
  },
  getBest (data) {
    return http.get('/posts/best')
  },
  getNew (data) {
    return http.get('/posts/new')
  },
  getNewbie (data) {
    return http.get('/posts/newbie')
  },
  getPayout (data) {
    return http.get('/posts/payout')
  },
  getWeekly (data) {
    return http.get('/posts/weekly')
  },
  getSearch (q) {
    return http.get('/posts/search/' + q)
  },
  moreSearch (url, params) {
    return http.post(url, params)
  },
  getFeed (data) {
    return http.post('posts/feed', data)
  }
}
