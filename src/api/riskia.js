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

// 风险辨识评估--风险单元--获取table
export function getRiskUnit (id) {
  const url = `${baseUrl}/riskia/getRiskUnitById?id=${id}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--评价记录--获取table
export function getRiskView (riskId, type) {
  const url = `${baseUrl}/riskia/getRiskView?riskId=${riskId}&type=${type}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--获取风险源列表
export function getDescribeList (riskId) {
  const url = `${baseUrl}/riskia/getDescribeList?riskId=${riskId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--树增加节点
export function addRiskTree (data) {
  const url = `${baseUrl}/riskia/addRiskTree`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--树编辑节点名称
export function updateRiskTree (data) {
  const url = `${baseUrl}/riskia/updateRiskTree`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--删除树节点
export function delRiskTree (param) {
  const url = `${baseUrl}/riskia/delRiskTree`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--添加危险源
export function addDescribe (data) {
  const url = `${baseUrl}/riskia/addDescribe`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险辨识评估--风险辨识--删除危险源
export function delDescribe (data) {
  const url = `${baseUrl}/riskia/delDescribe`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}
