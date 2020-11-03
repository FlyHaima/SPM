// baseUrl, 所有的post & get axios请求均在此设置base_url
// 图片验证码除外

// 192.168.137.33 // 金殿亮
// 192.168.137.36 // 海娜
// 192.168.137.52 // MQY
// 192.168.137.29 // 测试服务
// http://1.62.120.34:4447/ // 测试华电外网
// const baseUrl = 'http://10.192.167.2:8808/spm' // 华电内网
const baseUrl = 'http://192.168.0.158:8033/spm'
// const baseUrl = 'http://1.181.47.18:9903/spm'海拉尔外网
// const baseUrl = 'http://127.0.0.1:8808/spm'海拉尔内网
// const baseUrl = 'http://1.62.120.34:4447/spm'

// 设置七牛云服务器路径
const uploadQiniuAdr = 'http://upload-z1.qiniu.com'
const fileQiniuAddr = 'http://qfx2m2lmn.hb-bkt.clouddn.com/'

export default {
  baseUrl,
  uploadQiniuAdr,
  fileQiniuAddr
}
