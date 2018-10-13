import http from '@/services/http'

export default {
  upload (data) {
    return http.post('/create', data)
  },
  create (data) {
    return http.post('/posts', data)
  }
}
