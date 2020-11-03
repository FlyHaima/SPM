import axios from 'axios'
import router from '../../router'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/js/token'
import store from '@/store'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20 * 1000, // 请求超时时间
  params: {
    _: new Date().getTime()
  }
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    config.url = config.url + `?_=${new Date().getTime()}`
    config.headers.Token = getToken() // 让每个请求携带token--[xToken]为自定义key 请根据实际情况自行修改
  }
  store.state.pageLoading = true // 请求开始时，添加pageloading
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
      * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
      * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
      */
    store.state.pageLoading = false // 请求返回response后，移除pageloading
    const res = response
    if (res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      // 401:非法的token or Token 过期了;
      if (res.status === 401) {
        Message.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeToken()
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.fullPath }
          })
        })
      }
      return Promise.reject(res.status)
    } else if (response.data.code !== 200) { // 处理返回数据的报错
      Message({
        message: response.data.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res.status)
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  })

export default service
