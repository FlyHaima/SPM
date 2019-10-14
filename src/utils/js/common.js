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
