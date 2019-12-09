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

// 安全基础管理--组织机构--删除节点
export function delTreeData (param) {
  const url = `${baseUrl}/dept/delDept`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--领导小组--获取table
export function getLeaderTabel (deptId, pageNo, pageSize) {
  const url = `${baseUrl}/leadUser/getList?deptId=${deptId}&pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--工作小组--获取table
export function getWorkerTabel (deptId, pageNo, pageSize) {
  const url = `${baseUrl}/workUser/getList?deptId=${deptId}&pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--组织机构--编辑工作小组/领导小组接口
export function updateGroup (data) {
  const url = `${baseUrl}/workUser/updateGroup`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训计划--getTreeData
export function getPlanDeptList () {
  const url = `${baseUrl}/dept/getPlanDeptList`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训计划table
export function getPlanTable (deptId, pageNo, pageSize) {
  const url = `${baseUrl}/train/getPlanList?deptId=${deptId}&pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训内容table
export function getContentTable (pageNo, pageSize) {
  const url = `${baseUrl}/train/getTrainPersonList?pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训记录table
export function getRecordTable (pageNo, pageSize) {
  const url = `${baseUrl}/train/getTrainPersonList?pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--计划发布
export function releasePlan (data) {
  const url = `${baseUrl}/train/addPlan`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--删除计划
export function deletePlan (param) {
  const url = `${baseUrl}/train/delPlan`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--制度建设--获取列表
export function getConstructionList (pageNo, pageSize) {
  const url = `${baseUrl}/construction/getConstructionList?pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--制度建设--修改制度建设文件
export function editSystemFile (data) {
  const url = `${baseUrl}/construction/editFile`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--制度建设--删除制度建设文件
export function deleteSystemFile (param) {
  const url = `${baseUrl}/construction/delConstruction`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--制度建设--重置制度建设文件
export function resetSystemFile (data) {
  const url = `${baseUrl}/construction/resetFile`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--基础资料--获取文件类别列表
export function getBasicCategory () {
  const url = `${baseUrl}/basticData/getBasicCategory`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
