// baseUrl, 所有的post & get axios请求均在此设置base_url
// 图片验证码除外

// 192.168.137.33 // 金殿亮
// 192.168.137.36 // 海娜
// 192.168.137.52 // MQY
const baseUrl = 'http://192.168.137.36:8033/spm'

// 设置七牛云服务器路径
const uploadQiniuAdr = 'http://upload-z1.qiniu.com'
const fileQiniuAddr = 'http://file.hljdmkj.com/'

export default {
  baseUrl,
  uploadQiniuAdr,
  fileQiniuAddr
}
