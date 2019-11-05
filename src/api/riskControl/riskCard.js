import axios from 'axios'
import base from '../baseUrl'

axios.defaults.headers.post['Content-Type'] = 'application/json'

let baseUrl = base.baseUrl

// 获取列表
export function getTableData (token, id, level) {
  const url = `${baseUrl}/spm/riskCard/getRiskCrad?dmsfbsf=${token}&id=${id}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 提交数据

export function submitData (data) {
  const url = `${baseUrl}/spm/riskCard/addCard`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
