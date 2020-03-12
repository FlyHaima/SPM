<!-- 登陆页面 -->
<template>
  <div class="wrap login-wrap" v-loading="pageLoading">
    <div class="login-content-left">
      <div class="logo"></div>
      <div class="left-container-wrap">
        <div class="left-container">
          <div class="swiper-wrap">
            <swiper
              :options="swiperOption"
              ref="mySwiper"
              class="swiper-container">
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
              <div class="swiper-pagination"  slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>
          <el-tabs v-model="tabType" @tab-click='clickTab'>
            <el-tab-pane label="新闻动态" name="xwdt">
              <div class="tab-content">
                <ul class="list-info">
                  <li
                    v-for="(item, index) in newsList"
                    :key="index"
                    class="list-info-item">
                    <a :href="item.url" target="_blank">
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
                    class="list-info-item">
                    <a :href="item.url" target="_blank">
                      <div class="list-info-title">
                      <span class="list-info-txt">{{item.newsName}}</span>
                    </div>
                    </a>
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
                    class="list-info-item">
                    <a :href="item.url" target="_blank">
                      <div class="list-info-title">
                      <span class="list-info-txt">{{item.newsName}}</span>
                    </div>
                    </a>
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
                    class="list-info-item">
                    <a :href="item.url" target="_blank">
                      <div class="list-info-title">
                      <span class="list-info-txt">{{item.newsName}}</span>
                    </div>
                    </a>
                    <div class="list-info-date">{{item.impTime | send-time-filter}}</div>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="login-content-right">
      <div class="login-box">
      <div class="login-box-inner">
        <div class="login-form-box">
          <div class="login-form-header">
            <div class="login-form-title">注册</div>
          </div>
          <div class="login-form-tips">
            <span class="login-form-tips-sign">*</span>
            提示：此注册为企业唯一账号
          </div>
          <el-form
            :model="form"
            :rules="rules"
            status-icon
            ref="form"
            @submit.native.prevent
            class="form-login">
            <el-form-item prop="accountName">
              <el-input
                type="text"
                autocomplete="off"
                placeholder="请输入企业社会信用代码"
                v-model.trim="form.accountName">
                <i slot="prefix" class="icon-form icon-form-03"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="companyName">
              <el-input
                type="text"
                autocomplete="off"
                placeholder="请输入企业名称"
                v-model.trim="form.companyName">
                <i slot="prefix" class="icon-form icon-form-04"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                autocomplete="off"
                placeholder="请输入密码"
                v-model.trim="form.password">
                <i slot="prefix" class="icon-form icon-form-02"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="confrimPassword">
              <el-input
                type="password"
                autocomplete="off"
                placeholder="请确认密码"
                v-model.trim="form.confrimPassword">
                <i slot="prefix" class="icon-form icon-form-02"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="industryName">
              <el-select v-model="form.industryName" placeholder="请选择所属行业">
                <i slot="prefix" class="icon-form icon-form-05"></i>
                <el-option
                  v-for="item in industryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="custom-form-item">
              请选择是否使用所属行业大数据
              <el-select v-model="form.useIndustry" placeholder="使用">
                <el-option
                  v-for="item in useIndustryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-form-item class="form-links">
              <a class="form-links-item" href="/login">登录已有账号</a>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="submitting"
                @click="submitForm()"
                native-type="submit"
                round>注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { INDUSTRY_NAME_LIST, USE_INDUSTRY } from '@/constants/status'
export default {
  name: 'loginPage',
  data () {
    let regexPwd = new RegExp('^[a-zA-Z0-9]{6,12}$')
    // 校验新密码
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入字母或数字组成且不少于6位数字符的密码'))
      } else {
        // let regex = new RegExp('^[a-zA-Z0-9]{6,30}')
        if (!regexPwd.test(value)) {
          callback(new Error('密码格式不正确，请输入字母或数字组成且不少于6位数字符的密码'))
        }
        callback()
      }
    }
    // 再次确认密码的校验
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('输入内容与前密码不符!'))
      } else {
        callback()
      }
    }
    return {
      pageLoading: false,
      submitting: false,
      tabType: 'xwdt',
      form: {
        userName: '', // 企业信用代码
        companyName: '', // 企业名称
        password: '', // 密码
        industryName: '', // 所属行业
        useIndustry: '' // 是否使用大数据
      },
      rules: {
        accountName: [
          { required: true, message: '请输入企业社会信用代码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        industryName: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        password: [
          { validator: validatePassNew, trigger: 'blur' }
        ],
        confrimPassword: [
          { validator: validatePassConfirm, trigger: 'blur' }
        ]
      },
      industryOptions: INDUSTRY_NAME_LIST,
      useIndustryOptions: USE_INDUSTRY,
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
      this.pageLoading = true
      axios
        .get('ontroller/getNewsList', {
          tabType: this.tabType
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.pageLoading = false
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
      window.location.href = url
    },
    // 注册事件
    submitForm () {
      let vm = this
      vm.$refs.form.validate((valid) => {
        if (valid) {
          axios
            .post('registerController/register', vm.form)
            .then((res) => {
              vm.pageLoading = true
              if (res.data.code === 200) {
                vm.$notify.success('注册成功')
                window.location = '/login'
              } else {
                vm.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              vm.pageLoading = false
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
  display: flex;
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  position: relative;
  background-image: url('../assets/img/login/login-bg-left.png');
  background-repeat: no-repeat;
  background-size: cover;
  // overflow-y: hidden;
  // background: #ffffff;
}
.login-content{
  height: 100%;
  // height: 100vh;
}
.logo{
  position: absolute;
  top: 0;
  left: 0;
  width: 136px;
  height: 43px;
  margin: 36px 30px 0;
  background-image: url('../assets/img/login/login-logo.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.left-container-wrap{
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 150px 0 100px;
}
.left-container{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
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
  flex: 1;
  padding: 0 30px;
  color: #ffffff;
  >>>.el-tabs{
    flex: 1;
    margin-left: 20px;
    // max-width: 600px;
    .el-tabs__content{
      min-height: 20px;
    }
    .el-tabs__nav{
      margin: 0 30px;
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
  flex: 0 0 25%;
  height: 100%;
  color: #333333;
  background: #ffffff;
  padding: 0 50px;
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
.swiper-wrap{
  width: 500px;
  height: 100%;
  // height: 416px;
}
.swiper-container{
  width: 100%;
  height: 100%;
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
  padding: 0 30px;
  max-height: 440px;
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

@media only screen and (max-width:1680px) {
  .login-content-left{
    padding: 0 10px;
  }
  .login-content-right{
    padding: 0 20px;
  }
}
// register
.custom-form-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 57px;
}
</style>
