// import axios from 'axios'
import base from '@/api/baseUrl'

// 导出
export default function exportExcel (api, params) {
  if (params) {
    window.location.href = base.baseUrl + '/' + api + '?' + params
  } else {
    window.location.href = base.baseUrl + '/' + api
  }
}
