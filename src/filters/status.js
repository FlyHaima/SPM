import { DISPLAY_POSITION, NEWS_TYPE, VISIBLE_SWITCH } from '@/constants/status'

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

/**
 * 获取显示开关的value
 * @param {string} status | true | false
 */
export function getVisibleSwitchValue (status) {
  return status === VISIBLE_SWITCH.show.label ? VISIBLE_SWITCH.show.value : VISIBLE_SWITCH.hidden.value
}
