// login & regsin 页面的接口
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 获取登录页 新闻列表
export function getNewsList (tabType) {
  const url = `${baseUrl}/ontroller/getNewsList?tabType=${tabType}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// login
export function login (data) {
  const url = `${baseUrl}/ontroller/login`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
