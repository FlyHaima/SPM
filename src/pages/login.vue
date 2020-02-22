<!-- 登陆页面 -->
<template>
  <div class="wrap login-wrap">
    <el-row class="login-content">
      <el-col :span="16" class="login-content-left">
        <div class="logo"></div>
        <el-row>
          <el-col :span="10">
            <swiper
              :options="swiperOption"
              ref="mySwiper"
              class="swiper-container">
              <!-- slides -->
              <swiper-slide
                v-for="(item, index) in swiperSlides"
                :key="index">
                  <img
                    :src="item.picUrl"
                    class="swiper-img" />
                  <div class="swiper-info">
                    <div class="swiper-info-txt">{{item.picName}}</div>
                  </div>
              </swiper-slide>
              <!-- Optional controls -->
              <div class="swiper-pagination"  slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </el-col>
          <el-col :span="14">
            <el-tabs v-model="tabType" @tab-click='clickTab'>
              <el-tab-pane label="新闻动态" name="xwdt">
                <div class="tab-content">
                  <ul class="list-info">
                    <li
                      v-for="(item, index) in newsList"
                      :key="index"
                      class="list-info-item">
                      <a :href="item.url">
                        <div class="list-info-title">
                        <span class="list-info-txt">{{item.newsName}}</span>
                      </div>
                      </a>
                      <div class="list-info-date">{{item.impTime | send-time-filter}}</div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="政策解读" name="zcjd">
                <div class="tab-content">
                  <ul class="list-info">
                    <li
                      v-for="(item, index) in newsList"
                      :key="index"
                      @click="gotoDetailsHandle(item.url)"
                      class="list-info-item">
                      <div class="list-info-title">
                        <span class="list-info-txt">{{item.newsName}}</span>
                      </div>
                      <div class="list-info-date">{{item.impTime | send-time-filter}}</div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="法律法规" name="flfg">
                <div class="tab-content">
                  <ul class="list-info">
                    <li
                      v-for="(item, index) in newsList"
                      :key="index"
                      @click="gotoDetailsHandle(item.url)"
                      class="list-info-item">
                      <div class="list-info-title">
                        <span class="list-info-txt">{{item.newsName}}</span>
                      </div>
                      <div class="list-info-date">{{item.impTime | send-time-filter}}</div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="定时安管生产事故" name="aqscsg">
                <div class="tab-content">
                  <ul class="list-info">
                    <li
                      v-for="(item, index) in newsList"
                      :key="index"
                      @click="gotoDetailsHandle(item.url)"
                      class="list-info-item">
                      <div class="list-info-title">
                        <span class="list-info-txt">{{item.newsName}}</span>
                      </div>
                      <div class="list-info-date">{{item.impTime | send-time-filter}}</div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" :offset="1" class="login-content-right">
        <div class="login-box">
          <div class="login-box-inner">
            <div class="login-title">
              <div class="login-title-en">ANGUANTONG SYSTEM <span class="txt-bold">PLATFORM</span></div>
              <div class="login-title-txt">安管通系统平台</div>
            </div>
            <div class="login-form-box">
              <div class="login-form-header">
                <div class="login-form-title">欢迎使用系统</div>
                <!-- <el-select v-model="value" placeholder="请选择身份">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
              </div>
              <el-form
                :model="form"
                :rules="rules"
                status-icon
                ref="form"
                class="form-login"
                @submit.native.prevent>
                <el-form-item prop="accountName">
                  <el-input
                    type="text"
                    v-model.trim="form.accountName"
                    autocomplete="off"
                    maxlength="25"
                    placeholder="请输入用户名">
                    <i slot="prefix" class="icon-form icon-form-01"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model.trim="form.password"
                    autocomplete="off"
                    placeholder="请输入密码">
                    <i slot="prefix" class="icon-form icon-form-02"></i>
                  </el-input>
                </el-form-item>
                <el-form-item class="form-links">
                  <a class="form-links-item" href="/register">新用户注册</a>
                </el-form-item>
                <el-form-item>
                  <el-button
                    v-loading="submitting"
                    @click.prevent="submitForm()"
                    native-type="submit"
                    round>登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'loginPage',
  data () {
    return {
      submitting: false,
      tabType: 'xwdt',
      form: {
        accountName: '',
        password: ''
      },
      rules: {
        accountName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      options: [{
        value: '1',
        label: '政府'
      }],
      value: '',
      swiperOption: {
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
          renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span>' +
                  '/' +
                  '<span class="' + totalClass + '"></span>'
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        lazy: {
          loadPrevNext: true
        }
        // on: {
        //   lazyImageLoad: function (slide, image) {
        //     image.onerror = function () {
        //       this.src = 'static/images/lazyload/750x800.png'
        //     }
        //   },
        //   slideChange: function (index) {
        //     self.activeIndex = this.activeIndex + 1
        //   }
        // }
      },
      swiperSlides: [],
      newsList: null,
      picList: null
    }
  },
  filters: {
    // 格式化日期格式
    'send-time-filter' (value) {
      if (value) {
        return moment(value).format('YYYY/MM/DD')
      } else {
        return null
      }
    }
  },
  mounted () {
    this.fetchData()
    this.swiper.slideTo(3, 1000, false)
  },
  methods: {
    // 获取新闻列表
    fetchData () {
      axios
        .get('ontroller/getNewsList', {
          tabType: this.tabType
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.newsList = res.data.newsList
            this.swiperSlides = res.data.picList
          }
        })
    },
    // tab切换事件
    clickTab (item) {
      this.fetchData()
    },
    gotoDetailsHandle (url) {
      console.log(url)
      window.location.href = url
    },
    // 提交发布消息事件
    submitForm () {
      let vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          axios
            .post('ontroller/login', vm.form)
            .then((res) => {
              vm.submitting = true
              if (res.data.code === 200) {
                vm.$notify.success('登录成功')
                // 保存token
                const token = res.data.data
                sessionStorage.setItem('TOKEN_KEY', token)
                window.location = '/dashboard'
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              vm.submitting = false
            })
        } else {
          return false
        }
      })
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style scoped lang="scss">
.login-wrap{
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background: #ffffff;
}
.login-content{
  height: 100vh;
}
.logo{
  width: 136px;
  height: 43px;
  margin: 36px 46px 180px;
  background-image: url('../assets/img/login/login-logo.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.login-box{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 370px;
}
.login-box-inner{
  width: 100%;
}
.login-content-left{
  display: inline-block;
  height: 100%;
  background-image: url('../assets/img/login/login-bg-left.png');
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffff;
  >>>.el-tabs{
    // margin: 200px 80px;
    max-width: 600px;
    .el-tabs__content{
      min-height: 20px;
    }
    .el-tabs__nav{
      margin: 0 70px;
    }
    .el-tabs__header{
      background: rgba(61,147,255, 0.25);
    }
    .el-tabs__item{
      color: #ffffff;
    }
    .el-tabs__active-bar{
      background-color: #b53943;
    }
    .el-tabs__nav-wrap::after{
      background-color: transparent;
    }
  }
}
.login-content-right{
  display: inline-block;
  height: 100%;
  color: #333333;
}
.login-title{
  text-align: center;
  margin-bottom: 50px;
}
.login-title-en{
  margin-left: 85px;
  line-height: 16px;
  .txt-bold{
    color: #409eff;
  }
}
.login-title-txt{
  font-size: 42px;
  letter-spacing: 9px;
  color: #282828;
}
.login-form-box{

}
.login-form-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  >>>.el-select{
    .el-input__inner{
      width: 138px;
      height: 24px;
      line-height: 24px;
    }
    .el-input__icon{
      line-height: 24px;
    }
  }

}
.login-form-title{
  display: inline-block;
  font-size: 19px;
  letter-spacing: 2px;
  color: #303030;
  border-bottom: 2px solid #409eff;
}
.login-form-tips{
  line-height: 42px;
}
.login-form-tips-sign{
  color: #c30000;
}
.form-login{
  width: 100%;
  margin-top: 35px;
}
.form-links{
  display: flex;
  justify-content: flex-end;
}
.form-links-item{
  color: #409eff;
  text-decoration: underline;
}
/deep/.el-form{
  .el-form-item__error{
    padding-left: 50px;
  }
  .el-input{
    .el-input__inner{
      border-width: 0 0 1px 0;
      border-color: #ababab;
      border-radius: 0;
      padding-left: 0;
      height: 20px;
      line-height: 20px;
      background: transparent;
      margin-left: 50px;
      width: calc(100% - 50px);
    }
  }
  .el-button{
    width: 100%;
    padding-top: 14px;
    padding-bottom: 14px;
    font-size: 20px;
    background: #409eff;
    color: #ffffff;
  }
  .el-input__prefix{
    display: flex;
    align-items: center;
  }
}
.tab-content{
  display: flex;
}
.swiper-container{
  width: 440px;
  height: 416px;
  position: relative;
  z-index: 999;
  >>> .swiper-pagination{
    position: absolute;
    bottom: 0;
    padding-right: 20px;
    line-height: 58px;
    text-align: right;
  }
}
.swiper-img{
  width: 100%;
  height: 100%;
}
.swiper-info{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 58px;
  line-height: 58px;
  padding-left: 40px;
  padding-right: 20px;
  background: rgba(25,25,25,0.88);
}
.swiper-info-txt{
  max-width: 340px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.list-info{
  flex: 0 0 540px;
  margin-left: 40px;
  height: 440px;
  overflow: hidden;
}
.list-info-item{
  display: flex;
  justify-content: space-between;
  padding: 16px 10px 16px 0;
  border-bottom: 1px dashed #dadada;
  cursor: pointer;
  a{
    color: #ffffff;
  }
}
.list-info-title{

}
.list-info-txt{
  max-width: 430px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  padding-left: 10px;
  &::after{
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0%, -50%);
    width: 3px;
    height: 3px;
    background: #dadada;
    border-radius: 50%;
  }
}
.list-info-date{
  white-space: nowrap;
}
.icon-form{
  display: inline-block;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.icon-form-01{
  background-image: url(../assets/img/login/icon-form-01.png)
}
.icon-form-02{
  background-image: url(../assets/img/login/icon-form-02.png)
}
.icon-form-03{
  background-image: url(../assets/img/login/icon-form-02.png)
}
.icon-form-04{
  background-image: url(../assets/img/login/icon-form-02.png)
}
.icon-form-05{
  background-image: url(../assets/img/login/icon-form-02.png)
}

</style>
