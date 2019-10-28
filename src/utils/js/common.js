/* 公用JS方法 */

// 设置LocalStorage
export function setLocalStorage (name, value) {
  window.localStorage.setItem(name, value)
}

// 清除LocalStorage
export function removeLocalStorage (name) {
  window.localStorage.removeItem(name)
}

// 获取LocalStorage
export function getLocalStorage (name) {
  if (window.localStorage.getItem(name) == null) {
    return ''
  } else {
    return window.localStorage.getItem(name)
  }
}

// 格式化时间，返回####-##-## ##：##
export function formatTime (t) {
  let thisD = new Date(t)
  let tyear = thisD.getFullYear()
  let tmonth = thisD.getMonth() + 1
  let tday = thisD.getDate()
  let thour = thisD.getHours()
  let tmin = thisD.getMinutes()
  if (tday < 10) {
    tday = '0' + tday
  }
  if (tmonth < 10) {
    tmonth = '0' + tmonth
  }
  if (thour < 10) {
    thour = '0' + thour
  }
  if (tmin < 10) {
    tmin = '0' + tmin
  }

  return `${tyear}-${tmonth}-${tday} ${thour}:${tmin}`
}
