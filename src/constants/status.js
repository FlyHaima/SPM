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

// 所属行业
export const government = {text: '政府', label: '政府', value: '01'}
export const enterprise = {text: '企业', label: '企业', value: '02'}

export const INDUSTRY_NAME_LIST = [
  government,
  enterprise
]

// 是否使用行业大数据
export const use = {text: '使用', label: '使用', value: '1'}
export const unuse = {text: '不使用', label: '不使用', value: '0'}

export const USE_INDUSTRY = [
  use,
  unuse
]

// 排查种类弹窗，是否显示操作按钮
export const show = {text: '显示', label: 'true', value: true}
export const hidden = {text: '隐藏', label: 'false', value: false}

export const VISIBLE_SWITCH_LIST = [
  show,
  hidden
]

export const VISIBLE_SWITCH = {
  show,
  hidden
}
