import Vue from 'vue'

/* 金额校验限制 */
/** 权限指令 **/
const decimal = Vue.directive('decimal', {

  inserted: function (el, binding, vnode) {
    const input = el.getElementsByTagName('input')[0]

    // 添加@input事件
    input.onkeyup = function (e) {
      var regStrs = [
        ['^0(\\d+)$', '$1'], // 禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
      ]
      for (var i = 0; i < regStrs.length; i++) {
        var reg = new RegExp(regStrs[i][0])
        input.value = input.value.replace(reg, regStrs[i][1])
      }

      trigger(input, 'input')
    }
  }
})

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

export default {
  decimal
}
