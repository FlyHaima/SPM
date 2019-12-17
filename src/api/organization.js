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
export function getLeaderTabel (deptId, position, pageNo, pageSize) {
  const url = `${baseUrl}/leadUser/getList?deptId=${deptId}&position=${position}&pageNo=${pageNo}&pageSize=${pageSize}`

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

// 安全基础管理--全员培训--培训内容table--开始学习
export function startLearn (data) {
  const url = `${baseUrl}/train/startLearn`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训内容table--结束学习
export function endLearn (data) {
  const url = `${baseUrl}/train/endLearn`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--培训记录table
export function getRecordTable (deptId, pageNo, pageSize) {
  const url = `${baseUrl}/train/getTrainRecordList?deptId=${deptId}&pageNo=${pageNo}&pageSize=${pageSize}`

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

// 安全基础管理--全员培训--编辑计划
export function updatePlan (data) {
  const url = `${baseUrl}/train/updatePlan`

  return axios.post(url, JSON.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--全员培训--计划复制
export function copyPlan (data) {
  const url = `${baseUrl}/train/copyPlan`

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

// 安全基础管理--全员培训--培训记录--详情
export function getTrainStatistic (id) {
  const url = `${baseUrl}/train/getTrainStatistic?id=${id}`

  return axios.get(url, {}).then((res) => {
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

// 安全基础管理--基础资料--获取文件列表
export function getBasicList (basicCategoryId, pageNo, pageSize) {
  const url = `${baseUrl}/basticData/getBasicList?basicCategoryId=${basicCategoryId}&pageNo=${pageNo}&pageSize=${pageSize}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--基础资料--删除
export function delBasicFile (param) {
  const url = `${baseUrl}/basticData/delBasicFile`

  return axios.delete(url, {params: param}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 安全基础管理--证件管理--获取证件列表
export function getDocumentList (riskId) {
  const url = `${baseUrl}/document/getDocumentList?risk_id=${riskId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
