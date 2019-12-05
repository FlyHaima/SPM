import { DISPLAY_POSITION, NEWS_TYPE } from '@/constants/status'

/**
 * 格式化显示位置
 * @param {string} type | all | pc | app
 */
export const DisplayPositionFilter = (type) => {
  try {
    return DISPLAY_POSITION[type].text
  } catch (e) {
    return ''
  }
}

/**
 * 格式化新闻类型
 * @param {string} type | xwdt | zcjd | flfg | aqscsg
 */
export const NewsTypeFilter = (type) => {
  try {
    return NEWS_TYPE[type].text
  } catch (e) {
    return ''
  }
}
