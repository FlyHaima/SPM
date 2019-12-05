// 账号状态
export const ACCOUNT_STATUS = {
  normal: {
    label: '正常', value: '1'
  },
  abNormal: {
    label: '异常', value: '2'
  },
  freeze: {
    label: '冻结', value: '3'
  }
}
// 资格认证
export const ZGRZ = {
  verify: {
    label: '已认证', value: 'true'
  },
  unverified: {
    label: '未认证', value: 'false'
  }
}

// 显示位置
export const all = {text: '全部', label: '全部', value: 'all'}
export const pc = {text: '电脑端', label: '电脑端', value: 'pc'}
export const app = {text: '移动端', label: '移动端', value: 'app'}
export const DISPLAY_POSITION = {
  all,
  pc,
  app
}
export const DISPLAY_POSITION_LIST = [
  all,
  pc,
  app
]

// 新闻列表分类
export const xwdt = {text: '新闻动态', label: '新闻动态', value: 'xwdt'}
export const zcjd = {text: '政策解读', label: '政策解读', value: 'zcjd'}
export const flfg = {text: '法律法规', label: '法律法规', value: 'flfg'}
export const aqscsg = {text: '安全生产事故', label: '安全生产事故', value: 'aqscsg'}

export const NEWS_TYPE = {
  xwdt,
  zcjd,
  flfg,
  aqscsg
}
export const NEWS_TYPE_LIST = [
  xwdt,
  zcjd,
  flfg,
  aqscsg
]
