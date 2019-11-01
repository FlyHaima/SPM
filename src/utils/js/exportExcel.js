import axios from 'axios'
import baseURL from './baseUrl'

export default function (api, params) {
  let token = sessionStorage.getItem('token')

  const instance = axios.create({
    baseURL: baseURL,
    responseType: 'blob'
  })
  instance.defaults.headers.Token = token
  instance.get(api, {
    params: {
      ...params,
      _: new Date().getTime()
    }
  }).then(res => {
    if (res.headers['content-type'].indexOf('application/json') !== -1) {
      Notification({
        type: 'error',
        title: '错误',
        message: res.data.message
      })
    } else {
      const header = res.headers['content-disposition']
      let filename = 'excel.xlsx'
      if (header) {
        let key = 'filename='
        let index = header.indexOf(key)
        filename = decodeURIComponent(header.substr(index + key.length))
      }
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const ua = window.navigator.userAgent.toLowerCase()
      // 微软浏览器
      if (ua.indexOf('edge') !== -1 || ua.indexOf('msie') !== -1) {
        navigator.msSaveBlob(blob, filename)
      } else {
        if ('download' in document.createElement('a')) {
          const downloadElement = document.createElement('a')
          let href = ''
          if (window.URL) {
            href = window.URL.createObjectURL(blob)
          } else {
            href = window.webkitURL.createObjectURL(blob)
          }
          downloadElement.href = href
          downloadElement.download = filename
          document.body.appendChild(downloadElement)
          downloadElement.click()
          if (window.URL) {
            window.URL.revokeObjectURL(href)
          } else {
            window.webkitURL.revokeObjectURL(href)
          }
          document.body.removeChild(downloadElement)
        }
      }
    }
  })
}
