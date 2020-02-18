// 隐患排查治理--排查计划API
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 隐患排查治理--排查计划--复制基础类隐患清单
export function copyBasticHidden (data) {
  const url = `${baseUrl}/basticHidden/copyBasticHidden`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 隐患排查治理--排查计划--修改基础类隐患清单
export function updateBasicHidden (data) {
  const url = `${baseUrl}/basticHidden/updateBasicHidden`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 隐患排查治理--排查计划--复制现场类隐患清单
export function copyProductHidden (data) {
  const url = `${baseUrl}/productHidden/copyProductHidden`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 隐患排查治理--排查计划--修改现场类隐患清单
export function updateProductHidden (data) {
  const url = `${baseUrl}/productHidden/updateProductHidden`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
