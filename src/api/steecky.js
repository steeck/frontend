import http from '@/services/http'

export default {
  create (data) {
    return http.post('/steecky', data)
  },
  get (username) {
    return http.get('/steecky/' + username)
  },
  getDaily (username) {
    return http.get('/steecky/daily/' + username)
  }
}
