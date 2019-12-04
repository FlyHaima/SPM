// 安全基础管理API
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

axios.defaults.headers.post['Content-Type'] = 'application/json'

// 安全基础管理--组织机构--获取组织机构树状图数据
export function getOrgTree (userId) {
  const url = `${baseUrl}/dept/getDeptList?userId=${userId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--获取领导小组树状图数据
export function getLeaderTree (userId) {
  const url = `${baseUrl}/dept/getLeadDeptList?userId=${userId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--获取组织机构下级组织结构示意图数据
export function getTreeDept (deptId) {
  const url = `${baseUrl}/dept/getChildDept?deptId=${deptId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--修改岗位人员信息 组织结构示意图数据
export function editDeptInfo (data) {
  const url = `${baseUrl}/dept/updatePostPerson`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--新增组织结构
export function addTreeData (data) {
  const url = `${baseUrl}/dept/addDept`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--编辑组织结构
export function editTreeData (data) {
  const url = `${baseUrl}/dept/updateDept`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 评估报告--删除
export function delTreeData (param) {
  const url = `${baseUrl}/dept/delDept`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}
