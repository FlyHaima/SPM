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

// 安全基础管理--组织机构--获取组织机构下级组织结构示意图数据
export function getTreeDept (deptId) {
  const url = `${baseUrl}/dept/getChildDept?deptId=${deptId}`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
