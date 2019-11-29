import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl
// let cancel = null
// const CancelToken = axios.CancelToken

axios.defaults.baseURL = baseUrl
// 默认导出这个对象
export default {
  get (url, params, type) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params
        // cancelToken: new CancelToken ((c) => {
        //   cancel = c
        // })
      }).then((res) => {
        resolve(res)
      })
    })
  },
  post (url, data, type) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data
        // cancelToken: new CancelToken ((c) => {
        //   cancel = c
        // })
      }).then((res) => {
        resolve(res)
      })
    })
  },
  delete (url, params, type) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        params
        // cancelToken: new CancelToken ((c) => {
        //   cancel = c
        // })
      }).then((res) => {
        resolve(res)
      })
    })
  }
}
