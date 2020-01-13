// 安全基础管理API
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 风险分级管控--风险四色图--获取现有map下拉列表
export function getPlaceSelector () {
  const url = `${baseUrl}/fourColor/getPlaceSelect`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--获取现有map下 layer
export function getLayer (id) {
  const url = `${baseUrl}/fourColor/getLayer?id=${id}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--获取现有风险点下拉列表
export function getRiskSelector (riskName) {
  const url = `${baseUrl}/fourColor/getRiskSelect?riskName=${riskName}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--新增地图
export function addPlace (data) {
  const url = `${baseUrl}/fourColor/addPlace`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--保存坐标点修改
export function bindLayer (data) {
  const url = `${baseUrl}/fourColor/bindLayer`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--删除地图
export function delMap (param) {
  const url = `${baseUrl}/fourColor/delPic`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--删除地图
export function delPoint (param) {
  const url = `${baseUrl}/fourColor/delPoint`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--上传图片
export function uploadPic (data) {
  const url = `${baseUrl}/fourColor/uploadPic`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 风险分级管控--风险四色图--查看风险点详情
export function checkItemDetail (bindId) {
  const url = `${baseUrl}/fourColor/getDescribelist?bindId=${bindId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取图片尺寸，通过七牛云接口
export function getImageSize (imageUrl) {
  const url = `${imageUrl}?imageInfo`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
