// 安全基础管理API
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 风险辨识评估--风险单元--获取tree
export function getRiskTree () {
  const url = `${baseUrl}/riskia/getRiskTree`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险单元--获取tree
