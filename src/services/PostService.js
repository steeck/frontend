import Api from '@/services/Api'

export default {
  uploadFile (params) {
    return Api().post('create', params)
  }
}
