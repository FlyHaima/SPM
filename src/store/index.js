import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/api/axios'

Vue.use(Vuex)

const state = { // 要设置的全局访问的state对象
  passwordLevel: '',
  userInfo: {
    userName: '', // 用户名
    accountName: '' // 账号
  },
  msgNum: '', // 信息数量
  taskNum: '', // 待办数量
  count: 1,
  theme: '#1a6fba'
}

const getters = { // 实时监听state值的变化(最新状态)
}

const mutations = {
  CHANGE_SETTING: (state, data) => {
    state.theme = data
  },
  increment (state) {
    state.count++
  },
  BASE_INFO_GET (state, data) {
    state.userInfo = data
  },
  PASSWORD_LEVEL (state, data) {
    state.passwordLevel = data
  },
  MSG_NUM (state, data) {
    state.msgNum = data
  },
  TASK_NUM (state, data) {
    state.taskNum = data
  },
  SKIN_VALUE (state, data) {
    state.skin = data
  }
}

const actions = {
  changeSetting ({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  increment ({ commit }) {
    commit('increment')
  },
  BASE_INFO_SET ({ commit }) {
    axios
      .get('user/getUserBasicInfo', {
        dmsfbsf: sessionStorage.getItem('TOKEN_KEY')
      })
      .then((res) => {
        if (res.data.success === true) {
          commit('BASE_INFO_GET', res.data.data)
          sessionStorage.setItem('userId', res.data.data.userId)
          sessionStorage.setItem('userName', res.data.data.userName)
          commit('PASSWORD_LEVEL', res.data.aqjb)
          commit('MSG_NUM', res.data.msgNum)
          commit('TASK_NUM', res.data.taskNum)
          commit('SKIN_VALUE', res.data.skin)
          // console.log(res.data.data)
        }
      })
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
