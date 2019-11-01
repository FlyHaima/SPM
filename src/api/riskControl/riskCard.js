import axios from 'axios'
import base from '../baseUrl'

axios.defaults.headers.post['Content-Type'] = 'application/json'

let baseUrl = base.baseUrl

// 获取列表
export function getTableData (token, id, level) {
  const url = `${baseUrl}/spm/riskLevel/getRiskCrad?dmsfbsf=${token}&id=${id}&level=${level}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
