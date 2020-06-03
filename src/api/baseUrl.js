// baseUrl, 所有的post & get axios请求均在此设置base_url
// 图片验证码除外

// 192.168.137.33 // 金殿亮
// 192.168.137.36 // 海娜
// 192.168.137.52 // MQY
// 192.168.137.29 // 测试服务
// http://1.62.120.34:4447/ // 测试
// const baseUrl = 'http://1.62.120.34:4447/spm'
const baseUrl = 'http://139.9.130.245:8808/spm'
// const baseUrl = 'http://192.168.137.18:8808/spm'
// const baseUrl = 'http://192.168.137.27:8086/spm'

// 设置七牛云服务器路径
const uploadQiniuAdr = 'http://upload-z1.qiniu.com'
const fileQiniuAddr = 'http://file.hljdmkj.com/'

export default {
  baseUrl,
  uploadQiniuAdr,
  fileQiniuAddr
}
