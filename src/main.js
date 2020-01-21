// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-contrib-hls'
import echarts from 'echarts'
import BaseUrl from './api/baseUrl.js'
import axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 最后引入router，以实现覆盖组件内部样式的目的
import router from './router'

axios.interceptors.request.use(
  config => {
    // 在所有请求头部添加token值
    const token = store.state.token
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

Vue.prototype.BaseUrl = BaseUrl

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(VideoPlayer)

Vue.use(VueAwesomeSwiper)

Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
