<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      hasNet: true // 网络状态
    }
  },
  computed: { // vuex 参数引入
    ...mapState({
      // 获取用户信息
      userInfo: (state) => state.userInfo
    })
  },
  mounted () {
    this.getUserInfo()
  },
  created () {
    let that = this
    // 设置请求超时时间,20s
    axios.defaults.timeout = 20000 // 设置20s 的请求超时时间限制

    // 拦截request, 设置全局请求为ajax请求
    axios.interceptors.request.use((config) => {
      let sessionToken = sessionStorage.getItem('TOKEN_KEY')
      if (!sessionToken) {
        sessionToken = ''
      }
      config.headers.Token = sessionToken
      // that.hasNet = navigator.onLine
      // debugger
      return config
    }, (error) => {
      console.log(error)
      console.log('overtime')
      this.reload()
      return Promise.reject(error)
    })

    // 拦截响应response，并做一些错误处理
    axios.interceptors.response.use((response) => {
      if (response.headers.tokenmessagecode === '401') {
        // this.$message.error('Token已失效，请重新登录')
        sessionStorage.setItem('TOKEN_KEY', '')
        that.$router.push('/login')
      }
      return response
    }, (err) => { // 这里是返回状态码不为200时候的错误处理
      if (err && err.response) {
        switch (err.response.status) {
          case 400:
            err.message = '请求错误'
            console.log('400')
            break
          case 404:
            err.message = 'not found'
            console.log('not found')
            break
          case 408:
            err.message = '请求超时'
            console.log('overtime')
            that.isTimeOut = true
            break
          case 504:
            err.message = '网关超时'
            that.isTimeOut = true
            console.log('overtime')
            break
          default:
            err.message = '网络错误'
            that.hasNet = false
            break
        }
      }

      return Promise.reject(err)
    })

    // // 如果直接关闭页面不会出发beforeDestroy，需要每次加载手动清除上次遗留Url
    // if (localStorage.getItem('loginToUrl')) {
    //   localStorage.removeItem('loginToUrl')
    // }
  },
  methods: {
    // 获取用户基本信息
    getUserInfo () {
      this.$store.dispatch('BASE_INFO_SET')
    }
  }
}
</script>

<style lang="scss">
@import 'utils/css/style.scss';
html,body,#app{
  height: 100%;
  width: 100%;
  background: #f2f2f2;
}
</style>
