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
            <el-col :span="9">
              <ul class="user-list">
                <li class="user-list-item">
                  <span class="user-label">角色名：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">企业名：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">用户名：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">企业资格认证：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">权限等级：</span>
                  <span class="user-value">管理员</span>
                </li>
                <li class="user-list-item">
                  <span class="user-label">登录ID：</span>
                  <span class="user-value">管理员</span>
                </li>
              </ul>
            </el-col>
            <el-col :span="9">
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
        <div class="">
            <div class="user-account-left">
              <span class="user-account-label">您当前账号安全程度</span>
              <span class="user-account-value">
                <el-row>
                  <el-col :span="6">
                    <el-progress
                      :class="computedClass"
                      :stroke-width="16"
                      :percentage="80"
                      :format="format"
                      :color="customColors">
                    </el-progress>
                  </el-col>
                </el-row>
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
            <div class="user-account-right">
              <div>
                <i>icon</i>
                <span>已设置</span>
              </div>
              <div>
                <span>修改</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    return {
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },
  methods: {

    format (percentage) {
      return percentage === 60 ? `安全级别：中` : `${percentage}%`
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
  .basic-box{
    padding: 50px 40px 40px 30px;
    border-bottom: 4px solid $colorBorder;
  }
  .basic-header{
    font-size: 20px;
    color: #313131;
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
    line-height: 30px;
  }
  .user-account-box{
    padding: 0 30px;
    font-size: 16px;
    color: #414141;
  }
  .user-account-list{

  }
  .user-account-left{

  }
  .user-account-list-item{
    display: flex;
    justify-content: space-between;
    padding: 38px 0;
    border-bottom: 1px dashed #414141;
  }
  .user-account-label{

  }
  .user-account-value{
    margin-left: 60px;
  }
  .user-account-right{
    display: flex;
  }
  .user-progress{
    >>> .el-progress-bar{
      width: 80%;
    }
    >>> .el-progress__text{
      color: #f19729 !important;
    }
    >>> .el-progress-bar__outer{
      border-radius: 2px;
      background: #d1d1d1;
    }
    >>> .el-progress-bar__inner{
      border-radius: 2px;
    }
  }
</style>
