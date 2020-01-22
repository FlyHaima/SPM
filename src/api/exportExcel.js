// import axios from 'axios'
import base from '@/api/baseUrl'

// 导出
export default function exportExcel (api, params) {
  let token = sessionStorage.getItem('TOKEN_KEY')
  if (params) {
    window.location.href = base.baseUrl + '/' + api + '?' + 'token=' + token + '&' + params
  } else {
    window.location.href = base.baseUrl + '/' + api + '?' + 'token=' + token
  }
}
