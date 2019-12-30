// baseUrl, 所有的post & get axios请求均在此设置base_url
// 图片验证码除外

// const baseUrl = 'http://58.155.61.31:8022'
// 58.155.61.34 // 殿亮
// 58.155.61.37 // 海娜
const baseUrl = 'http://58.155.61.34:8033/spm'

// 设置七牛云服务器路径
const uploadQiniuAdr = 'http://upload-z1.qiniu.com'
const fileQiniuAddr = 'http://file.hljdmkj.com/'

export default {
  baseUrl,
  uploadQiniuAdr,
  fileQiniuAddr
}
