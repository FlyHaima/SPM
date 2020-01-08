// baseUrl, 所有的post & get axios请求均在此设置base_url
// 图片验证码除外

// const baseUrl = 'http://58.155.61.31:8022'
// 192.168.1.121 // 殿亮
// 192.168.137.36 // 海娜
const baseUrl = 'http://192.168.137.36:8033/spm'

// 设置七牛云服务器路径
const uploadQiniuAdr = 'http://upload-z1.qiniu.com'
const fileQiniuAddr = 'http://file.hljdmkj.com/'

export default {
  baseUrl,
  uploadQiniuAdr,
  fileQiniuAddr
}
