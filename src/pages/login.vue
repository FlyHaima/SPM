<!-- 登陆页面 -->
<template>
  <div class="wrap login-wrap">
    <el-row class="login-content">
      <el-col :span="14" class="login-content-left">
        <div class="logo"></div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="新闻动态" name="first">
            <div class="tab-content">
              <swiper
                :options="swiperOption"
                ref="mySwiper"
                class="swiper-container">
                <!-- slides -->
                <swiper-slide
                  v-for="(item, index) in swiperSlides"
                  :key="index">
                    <img
                      :src="item.imgSrc"
                      class="swiper-img" />
                    <div class="swiper-info">
                      <div class="swiper-info-txt">{{item.imgTxt}}</div>
                    </div>
                </swiper-slide>
                <!-- Optional controls -->
                <div class="swiper-pagination"  slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>
              <ul class="list-info">
                <li class="list-info-item">
                  <div class="list-info-title">
                    <span class="list-info-txt">你的安全清单并未完善，请点击这里</span>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
                <li class="list-info-item">
                  <div class="list-info-title">
                    <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
                <li class="list-info-item">
                  <div class="list-info-title">
                    <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
                <li class="list-info-item">
                  <div class="list-info-title">
                    <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
                <li class="list-info-item">
                  <div class="list-info-title">
                    <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
                <li class="list-info-item">
                  <div class="list-info-title">
                    <div class="list-info-txt">你的安全清单并未完善，请点击这里你的安全清单并未完善，请点击这里</div>
                  </div>
                  <div class="list-info-date">2017/12/20</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="政策解读" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="法律法规" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时安管生产事故" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>

      </el-col>
      <el-col :span="8" :offset="1" class="login-content-right">
        <div class="login-box">
          <div class="login-box-inner">
            <div class="login-title">
              <div class="login-title-en">ANGUANTONG SYSTEM <span class="txt-bold">PLATFORM</span></div>
              <div class="login-title-txt">安管通系统平台</div>
            </div>
            <div class="login-form-box">
              <div class="login-form-header">
                <div class="login-form-title">欢迎使用系统</div>
                <el-select v-model="value" placeholder="请选择身份">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <el-form
                :model="form"
                :rules="rules"
                status-icon
                ref="form"
                class="form-login">
                <el-form-item prop="accountName">
                  <el-input
                    type="text"
                    v-model.trim="form.accountName"
                    autocomplete="off"
                    placeholder="请输入用户名">
                    <i slot="prefix" class="icon-form icon-form-01"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="text"
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

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'loginPage',
  data () {
    return {
      submitting: false,
      activeName: 'first',
      form: {
        accountName: '',
        password: ''
      },
      rules: {
        accountName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
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
      swiperSlides: [
        {
          imgSrc: './static/images/login/banner/banner01.jpg',
          imgTxt: '我的骄傲，我的国！为中国女排打call'
        },
        {
          imgSrc: './static/images/login/banner/banner01.jpg',
          imgTxt: '我的骄傲，我的国！'
        }
      ]
    }
  },
  mounted () {
    // setInterval(() => {
    //   if (this.swiperSlides.length < 10) {
    //     this.swiperSlides.push(this.swiperSlides.length + 1)
    //   }
    // }, 3000)
    this.swiper.slideTo(3, 1000, false)
  },
  methods: {
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
                window.localStorage.setItem('TOKEN_KEY', token)
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
  margin: 36px 46px;
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
    margin: 200px 80px;
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
  color: #333333;
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
