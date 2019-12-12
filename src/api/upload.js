// 七牛云上传相关 API
import axios from 'axios'
import base from '@/api/baseUrl'

let baseUrl = base.baseUrl

// 安全基础管理--组织机构--获取领导小组树状图数据
export function getQiNiuToken () {
  const url = `${baseUrl}/user/qinToken`

  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
