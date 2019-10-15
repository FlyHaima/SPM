<template>
  <div class="view-box">
    <div class="view-box-content">
      <div class="basic-box">
        <div class="basic-header">
          基本资料
        </div>
        <div class="basic-content">
          <el-row :gutter="20">
            <el-col class="basic-user-info" :span="4">
              <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              <div class="basic-info-txt">
                <p class="basic-info-txt-item">基本信息</p>
                <p class="basic-info-txt-item">企业用户-哈尔滨-道外区</p>
              </div>
            </el-col>
            <el-col :span="12">
              <ul class="user-list">
                <li class="user-list-item">
                  <span class="user-label">角色名：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">企业名：</span>
                  <span class="user-value">黑龙江省阿斯顿矿业开采有限公司</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">用户名：</span>
                  <span class="user-value">neuh1546545314</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">企业资格认证：</span>
                  <span class="user-value color-primary">已认证</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">权限等级：</span>
                  <span class="user-value color-primary">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">登录ID：</span>
                  <span class="user-value">164568975211</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="8">
              <ul class="user-list-time">
                <li class="user-list-time-item">
                  <span class="user-label">上次登录时间：</span>
                  <span class="user-value">2019-08-06 16：22</span>
                </li>
                <li class="user-list-time-item">
                  <span class="user-label">账号创建时间：</span>
                  <span class="user-value">2019-08-06 16：22</span>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="user-account-box">
        <div class="user-account-header">
          <div class="account-header-left">
            <span class="account-header-label">您当前账号安全程度</span>
            <span class="account-header-value">
              <el-progress
                :class="computedClass"
                :stroke-width="16"
                :percentage="60"
                :format="format"
                :color="customColors">
              </el-progress>
            </span>
          </div>
        </div>
        <div class="user-account-list">
          <div class="user-account-list-item">
            <div class="user-account-left">
              <span class="user-account-label">登录密码</span>
              <span class="user-account-value">
                安全性高的密码可以使账号更安全，建议您定期更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。
              </span>
            </div>
            <div class="user-account-operation">
              <div class="user-account-operation-item">
                <i class="operation-icon-finish"></i>
                <span class="operation-txt">已设置</span>
              </div>
              <div class="user-account-operation-item">
                <a
                  href="javascript:;"
                  class="operation-txt operation-txt-link"
                  @click="handleEditPassword"
                >修改</a>
              </div>
            </div>
          </div>
          <div class="user-account-list-item">
            <div class="user-account-left">
              <span class="user-account-label">手机绑定</span>
              <span class="user-account-value">
                您已绑定了手机151****6064【您的手机为安全手机，可以找回密码】
              </span>
            </div>
            <div class="user-account-operation">
              <div class="user-account-operation-item">
                <i class="operation-icon-finish"></i>
                <span class="operation-txt">已设置</span>
              </div>
              <div class="user-account-operation-item">
                <a
                  href="javascript:;"
                  class="operation-txt operation-txt-link"
                  @click="handleEditTel"
                >修改</a>
              </div>
            </div>
          </div>
          <div class="user-account-list-item">
            <div class="user-account-left">
              <span class="user-account-label">注销账号</span>
              <span class="user-account-value">
                如果您不在使用此账号，可以将其注销，账号成功注销后，其下所有服务、数据及隐私信息将会被删除并将无法恢复。
              </span>
            </div>
            <div class="user-account-operation">
              <div class="user-account-operation-item">
                <span class="operation-txt operation-txt-link">注销账号</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="修改密码" :visible.sync="dialogFormPasswordVisible">
        <div class="form-tips">
          修改密码提升密码强度，可以保障账号的安全性
        </div>
        <el-row>
          <el-col :offset="6" :span="12">
            <el-form
              :model="passwordForm"
              ref="passwordForm"
              :rules= "rules"
              size="mini"
              label-width="100px"
            >
              <el-form-item label="旧密码：" prop="passwordOld">
                <el-input
                  type="password"
                  v-model="passwordForm.passwordOld"
                  autocomplete="off"
                  placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码：" prop="passwordNew">
                <el-input
                  type="password"
                  v-model="passwordForm.passwordNew"
                  autocomplete="off"
                  placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码：" prop="passwordConfirm">
                <el-input
                  type="password"
                  v-model="passwordForm.passwordConfirm"
                  autocomplete="off"
                  placeholder="请再次输入新密码"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitPasswordForm()">保 存</el-button>
          <el-button @click="dialogFormPasswordVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-row :gutter="24">
        <el-col :span="24">

        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
export default {
  name: 'basic',
  data () {
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.passwordForm.passwordOld !== '') {
          this.$refs.passwordForm.validateField('passwordOld')
        }
        callback()
      }
    }
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passwordForm.passwordNew !== '') {
          this.$refs.passwordForm.validateField('passwordNew')
        }
        callback()
      }
    }
    var validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.passwordNew) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#d13a38', percentage: 60},
        {color: '#d13a38', percentage: 80},
        {color: 'orange', percentage: 100}
      ], // 进度条自定义颜色
      dialogFormPasswordVisible: false, // 修改密码弹框显示开关
      dialogFormTelVisible: false, // 修改绑定手机号弹框显示开关
      passwordForm: {
        passwordOld: '', // 旧密码
        passwordNew: '', // 新密码
        passwordConfirm: '' // 确认新密码
      }, // 修改密码form
      rules: {
        passwordOld: [
          { validator: validatePassOld, trigger: 'blur' }
        ],
        passwordNew: [
          { validator: validatePassNew, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: validatePassConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitPasswordForm () {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          alert('submit!')
          this.dialogFormPasswordVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    format (percentage) {
      return percentage === 60 ? `安全级别：中` : `${percentage}%`
    },
    // 修改登录密码
    handleEditPassword () {
      this.dialogFormPasswordVisible = true
    },
    // 修改绑定手机
    handleEditTel () {
      this.dialogFormTelVisible = true
    }
  },
  computed: {
    computedClass () {
      return {'user-progress': true}
    }
  }
}
</script>
<style lang="scss" scoped>
  $colorBorder: #e9e9e9;
  $colorPrimary: #409eff;
  .color-primary{
    color: $colorPrimary;
  }
  .basic-box{
    padding: 50px 40px 40px 30px;
    border-bottom: 4px solid $colorBorder;
  }
  .basic-header{
    font-size: 20px;
    color: #313131;
    position: relative;
    &::after{
      content: "";
      display: inline-block;
      width: 92%;
      height: 1px;
      border-top: 1px solid #646464;
      position: absolute;
      right: 0;
      top: 50%;

    }
  }
  .el-avatar--circle{
    border: 2px solid #227dce;
  }
  .basic-content{
    padding-top: 60px;
  }
  .basic-user-info{
    text-align: center;
  }
  .basic-info-txt{
    font-size: 16px;
    line-height: 26px;
    color: #3e3e3e;
  }

  .user-list{
    display: flex;
    flex-wrap: wrap;
  }
  .user-list-item{
    flex: 0 0 50%;
    color: #666666;
    font-size: 16px;
    margin-bottom: 45px;
    &:nth-child(5),
    &:nth-child(6){
      margin-bottom: 0;
    }
  }
  .user-label{

  }
  .user-value{

  }
  .user-list-time{

  }
  .user-list-time-item{
    color: #666666;
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 16px;
  }
  .user-account-box{
    padding: 0 30px;
    font-size: 16px;
    color: #414141;
  }
  .user-account-header{
    padding: 38px 0;
  }
  .account-header-left{

  }
  .account-header-label{
    display: inline-block;
  }
  .account-header-value{
    display: inline-block;
    width: 300px;
    margin-left: 30px;
  }
  .user-account-list{

  }
  .user-account-left{

  }
  .user-account-list-item{
    display: flex;
    justify-content: space-between;
    padding: 38px 0;
    border-top: 1px dashed #414141;
  }
  .user-account-label{

  }
  .user-account-value{
    margin-left: 60px;
  }
  .user-account-operation{
    display: flex;
  }
  .user-account-operation-item{
    &:last-child{
      .operation-txt{
        border-right: 0;
      }
    }
  }
  .operation-icon-finish{
    display: inline-block;
    position: relative;
    margin-left:-24px;
    width: 18px;
    height: 18px;
    border: 1px solid #2aaa91;
    border-radius: 18px;
    color: #2aaa91;
    vertical-align: top;
    &::before{
      content: "";
      display: inline-block;
      position: absolute;
      margin-left: 3px;
      margin-top: 4px;
      width: 10px;
      height: 4px;
      border-bottom: solid 1px currentColor;
      border-left: solid 1px currentColor;
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
    }

  }
  .operation-txt{
    display: inline-block;
    color: #2aaa91;
    vertical-align: top;
    line-height: 18px;
    border-right: 1px solid #d7d7d7;
    white-space: nowrap;
    padding: 0 12px;
  }
  .operation-txt-link{
    color: #409eff;
  }
  .form-tips{
    margin-bottom: 40px;
  }
  // 修改组件样式
  .user-progress >>> {
    .el-progress-bar{
      width: 78%;
    }
    .el-progress__text{
      color: #f19729 !important;
    }
    .el-progress-bar__outer{
      border-radius: 2px;
      background: #d1d1d1;
      margin-right: 30px;
    }
    .el-progress-bar__inner{
      border-radius: 2px;
    }
  }
  .el-dialog__wrapper >>> {
    .el-dialog__header{
      background: $colorPrimary;
    }
    .el-dialog__title{
      color: #ffffff;
    }
    .el-dialog__headerbtn .el-dialog__close{
      color: #ffffff;
    }
  }
</style>
