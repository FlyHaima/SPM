// vuex 里token会随着刷新消失，放在 sessionStorage 里
export function getToken () {
    return sessionStorage.getItem('TokenKey')
  }
  
  export function setToken (token) {
    return sessionStorage.setItem('TokenKey', token)
  }
  
  export function removeToken () {
    return sessionStorage.removeItem('TokenKey')
  }