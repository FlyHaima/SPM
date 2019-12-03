import Vue from 'vue'
import Vuex from 'vuex'
import axios from '@/api/axios'

Vue.use(Vuex)

const state = { // 要设置的全局访问的state对象
  // isMap: true,
  // mapType: 'normal', // normal（正常），sensor（传感器信号）, video（监控视频）, car（车辆调度）, remoteQuery（远程查询）
  // hasMapSearch: true, // 显示地图搜索组件
  // hasMapVideo: true, // 显示地图视频组件
  // allowBack: true, // 允许浏览器返回
  // showPath: false, // 显示地图路径
  // menuList: [], // index页面右侧菜单
  // userImg: '', // 用户个人头像
  // userName: '', // 用户个人名
  // companyName: null,
  passwordLevel: '',
  userInfo: {
    userName: ''
  },
  count: 1
}

const getters = { // 实时监听state值的变化(最新状态)
}

const mutations = {
  increment (state) {
    state.count++
  },
  BASE_INFO_GET (state, data) {
    state.userInfo = data
  },
  PASSWORD_LEVEL (state, data) {
    state.passwordLevel = data
  }

  // changeNavState (state, newState) {
  //   state.isMap = newState
  // },
  // changeMapType (state, newState) {
  //   state.mapType = newState
  // },
  // changeMapSearch (state, newState) {
  //   state.hasMapSearch = newState
  // },
  // changeVideo (state, newState) {
  //   state.hasMapVideo = newState
  // },
  // changeBackState (state, newState) {
  //   state.allowBack = newState
  // },
  // changePathState (state, newState) {
  //   state.showPath = newState
  // },
  // changeMenu (state, newVal) {
  //   state.menuList = newVal
  // },
  // changeUserImg (state, newVal) {
  //   state.userImg = newVal
  // },
  // changeUserName (state, newVal) {
  //   state.userName = newVal
  // }
}

const actions = {
  increment ({ commit }) {
    commit('increment')
  },
  BASE_INFO_SET ({ commit }) {
    axios
      .get('user/getUserBasicInfo', {
        dmsfbsf: window.localStorage.getItem('TOKEN_KEY')
      })
      .then((res) => {
        if (res.data.success === true) {
          commit('BASE_INFO_GET', res.data.data)
          commit('PASSWORD_LEVEL', res.data.aqjb)
        }
      })
  }
  // changeNav (content, newState) {
  //   content.commit('changeNavState', newState)
  // },
  // changeMapSearch (content, newState) {
  //   content.commit('changeMapSearch', newState)
  // },
  // changeMapType (content, newState) {
  //   content.commit('changeMapType', newState)
  // },
  // changeVideo (content, newState) {
  //   content.commit('changeVideo', newState)
  // },
  // changeBackState (content, newState) {
  //   content.commit('changeBackState', newState)
  // },
  // changePathState (content, newState) {
  //   content.commit('changePathState', newState)
  // },
  // changeMenu (content, newVal) {
  //   content.commit('changeMenu', newVal)
  // },
  // changeUserImg (content, newVal) {
  //   content.commit('changeUserImg', newVal)
  // },
  // changeUserName (content, newVal) {
  //   content.commit('changeUserName', newVal)
  // }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
