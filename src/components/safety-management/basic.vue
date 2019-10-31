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
                <p class="basic-info-txt-item">当前位置：哈尔滨-道外区</p>
              </div>
            </el-col>
            <el-col :span="18" :offset="1">
              <ul class="user-list">
                <li class="user-list-item">
                  <span class="user-label">用户名：</span>
                  <span class="user-value">王雪</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">登录ID:</span>
                  <span class="user-value">1546545314</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">账号创建时间:</span>
                  <span class="user-value">2019-06-04 10：16</span>
                </li>
                 <li class="user-list-item">
                  <span class="user-label">企业名：</span>
                  <span class="user-value">黑龙江省阿斯顿矿业开采有限公司</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">所属部门：</span>
                  <span class="user-value">安全部</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">职位：</span>
                  <span class="user-value">安全部部长</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">企业资格认证：</span>
                  <span class="user-value color-primary">已认证</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">账号状态：</span>
                  <span class="user-value color-primary">正常</span>
                  <span class="user-value color-warning">异常</span>
                  <span class="user-value color-danger">冻结</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">上次登录信息：</span>
                  <span class="user-value">2019-08-06 16：22</span>
                  <span class="user-value">
                    <i class="icon-location"></i>哈尔滨市</span>
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
            <div class="account-header-value">
              <div class="password-progress">
                <div class="password-progress-bar">
                  <div
                    class="password-progress-bar--fill"
                    :data-score="passwordLevel"
                  ></div>
                </div>
                <div class="password-level-text">
                  <span class="password-level-label">安全级别：</span>
                  <span class="password-level-value" :data-score="passwordLevel">{{passwordLevelText}}</span>
                </div>
              </div>

            </div>
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
                <a href="javascript:;" class="operation-txt operation-txt-link">注销账号</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="修改密码" :visible.sync="dialogFormPasswordVisible">
        <div class="form-tips">
          修改密码提升密码强度，可以保障账号的安全性
        </div>
        <div class="form-modal">
          <el-form
            :model="passwordForm"
            ref="passwordForm"
            :rules="rulesPassword"
            size="mini"
            label-width="100px"
            status-icon
          >
            <el-form-item label="旧密码：" prop="passwordOld">
              <el-input
                type="password"
                v-model="passwordForm.passwordOld"
                autocomplete="off"
                placeholder="请输入旧密码"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="passwordNew">
              <el-input
                type="password"
                v-model="passwordForm.passwordNew"
                autocomplete="off"
                placeholder="请输入新密码"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="passwordConfirm">
              <el-input
                type="password"
                v-model="passwordForm.passwordConfirm"
                autocomplete="off"
                placeholder="请再次输入新密码"
                clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitPasswordForm()">保 存</el-button>
          <el-button @click="dialogFormPasswordVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改绑定手机" :visible.sync="dialogFormTelVisible">
        <div class="form-modal">
          <el-form
            :model="telForm"
            ref="telForm"
            :rules="rulesTel"
            size="mini"
            label-width="110px"
            class="demo-dynamic"
          >
            <el-form-item label="原手机号码：" prop="telOld">
              <el-input
                type="text"
                v-model="telForm.telOld"
                autocomplete="off"
                placeholder="请输入原手机号码"
                :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="修改绑定手机：" prop="telNew">
              <el-input
                type="number"
                v-model="telForm.telNew"
                autocomplete="off"
                placeholder="请输入修改绑定手机"
                clearable></el-input>
              <el-button
                type="primary">发送</el-button>
            </el-form-item>
            <el-form-item label="验证码：" prop="captcha">
              <el-input
                type="number"
                v-model="telForm.captcha"
                autocomplete="off"
                placeholder="请输入验证码"
                clearable
                class="input-captcha"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="submitTelForm()">保 存</el-button>
          <el-button size="small" @click="dialogFormTelVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'basic',
  data () {
    let regexPwd = new RegExp('^[a-zA-Z0-9]{6,30}')
    // 校验旧密码
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前用户密码'))
      } else {
        // let regex = new RegExp('^[a-zA-Z0-9]{6,30}')
        if (!regexPwd.test(value)) {
          callback(new Error('密码格式不正确，请输入字母或数字组成且不少于6位数字符的密码'))
        }
        callback()
      }
    }
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
      } else if (value !== this.passwordForm.passwordNew) {
        callback(new Error('输入内容与前密码不符!'))
      } else {
        callback()
      }
    }
    // 校验修改的绑定手机号码
    var validateTelNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入修改绑定手机'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var validateCaptcha = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      passwordLevel: '', // 密码强度级别
      dialogFormPasswordVisible: false, // 修改密码弹框显示开关
      dialogFormTelVisible: false, // 修改绑定手机号弹框显示开关
      passwordForm: {
        passwordOld: '', // 旧密码
        passwordNew: '', // 新密码
        passwordConfirm: '' // 确认新密码
      }, // 修改密码form
      telForm: {
        telOld: '', // 原手机号码
        telNew: '', // 新手机号码
        captcha: '' // 验证码
      }, // 修改绑定手机
      rulesPassword: {
        passwordOld: [
          { validator: validatePassOld, trigger: 'blur' }
        ],
        passwordNew: [
          { validator: validatePassNew, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: validatePassConfirm, trigger: 'blur' }
        ]
      }, // 修改密码的校验规则
      rulesTel: {
        telNew: [
          { validator: validateTelNew, trigger: 'blur' }
        ],
        captcha: [
          { validator: validateCaptcha, trigger: 'blur' }
        ]
      } // 修改绑定手机的校验规则
    }
  },
  created () {
    this.passwordLevel = '3'
  },
  methods: {
    // 提交修改密码事件
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
    // 提交修改绑定手机事件
    submitTelForm () {
      this.$refs.telForm.validate((valid) => {
        if (valid) {
          alert('submit!')
          this.dialogFormTelVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    },
    passwordLevelText () {
      if (this.passwordLevel === '1') {
        return '低'
      } else if (this.passwordLevel === '2') {
        return '中'
      } else {
        return '高'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../utils/css/style.scss';

  // 可提取的公用样式
  .icon-location{
    display: inline-block;
    color: $colorPrimary;
    position: relative;
    width: 12px;
    height: 12px;
    border: solid 1px currentColor;
    border-radius: 6px 6px 6px 0px;
    -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
    margin-right: 8px;
    margin-left: 10px;
    &::before{
      content: '';
      position: absolute;
      left: 2px;
      top: 2px;
      width: 4px;
      height: 4px;
      border: solid 1px currentColor;
      border-radius: 3px;
    }
  }
  .view-box{
    background: #ffffff;
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
    flex: 0 0 33.33%;
    color: #666666;
    font-size: 16px;
    margin-bottom: 45px;
    &:nth-child(5),
    &:nth-child(6){
      margin-bottom: 0;
    }
  }
  .user-label{
    font-weight: 700;
  }

  .user-account-box{
    padding: 0 30px;
    font-size: 16px;
    color: #414141;
  }
  .user-account-header{
    padding: 38px 0;
  }
  .account-header-label{
    display: inline-block;
  }
  .account-header-value{
    display: inline-block;
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
    color: $colorPrimary;
  }
  .form-tips{
    margin-bottom: 40px;
  }
  // 修改组件样式
  .form-modal >>>{
    .el-form{
      width: 420px;
      margin: 0 auto;
    }
    .el-input{
      width: 240px;
    }
    .input-captcha{
      width: 140px;
    }
  }
  .password-progress{
    display: flex;
    align-items: center;
  }
  .password-progress-bar{
    width: 160px;
    position: relative;
    height: 6px;
    background: #dddddd;
    border-radius: 2px;
  }
  .password-progress-bar::before,
  .password-progress-bar::after{
    content: '';
    height: inherit;
    background: transparent;
    display: block;
    border-color: #FFF;
    border-style: solid;
    border-width: 0 5px 0 5px;
    position: absolute;
    z-index: 10;
  }
  .password-progress-bar::before{
    left: 30%;
  }
  .password-progress-bar::after{
    right: 30%;
  }

  .password-progress-bar--fill{
    background: transparent;
    height: inherit;
    position: absolute;
    width: 0;
    border-radius: inherit;
    transition: width 0.5s ease-in-out, background 0.25s;
  }
  .password-progress-bar--fill[data-score='1'] {
    background: $colorRed;
    width: 33.33%;
  }

  .password-progress-bar--fill[data-score='2'] {
    background: $colorOrange;
    width: 66.66%;
  }

  .password-progress-bar--fill[data-score='3'] {
    background: $colorGreen;
    width: 99.99%;
  }
  .password-level-text{
    margin-left: 40px;
  }
  .password-level-label{
    display: inline-block;
    vertical-align: top;
  }
  .password-level-value{
    display: inline-block;
    vertical-align: top;
  }
  .password-level-value[data-score='1']{
    color: $colorRed;
  }
  .password-level-value[data-score='2']{
    color: $colorOrange;
  }
  .password-level-value[data-score='3']{
    color: $colorGreen;
  }

</style>
