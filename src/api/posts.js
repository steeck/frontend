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
  getWeekly (data) {
    return http.get('/posts/weekly')
  },
  getSearch (q) {
    return http.get('posts/search/' + q)
  }
}
