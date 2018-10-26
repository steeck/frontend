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
  getByCategory (data) {
    return http.get('/posts/' + data.category)
  }
}
