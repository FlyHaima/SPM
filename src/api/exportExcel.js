import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

// 导出
export default function exportExcel (api, params) {
  const instance = axios.create({
    baseURL: baseUrl
  })
  return instance.get(api, {
    params: {
      ...params
    }
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
