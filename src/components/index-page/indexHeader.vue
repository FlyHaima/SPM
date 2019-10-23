<template>
  <div class="index-header">
    <div class="logo inline-block"></div>
    <ul class="header-menu inline-block">
      <li>
        <div class="btn task-btn"><i></i>我的任务
          <span v-if="taskNum > 0" class="num-conner">{{taskNum > 99 ? '99+' : taskNum}}</span>
        </div>
      </li>
      <li>
        <div class="btn hard-disk"><i></i>本机硬盘</div>
      </li>
      <li>
        <div class="btn msg-btn"><i></i>消息<span class="num-conner">18</span>
          <span v-if="msgNum > 0" class="num-conner">{{msgNum > 99 ? '99+' : msgNum}}</span>
        </div>
      </li>
      <li>
        <div class="btn skin-btn"><i></i>皮肤</div>
      </li>
      <li>
        <div class="btn user-name-btn"><i></i>管理员</div>
      </li>
    </ul>
    <div class="quit-btn inline-block" @click="quit" title="退出登录">
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexHeader',
  data () {
    return {
      taskNum: 110,
      msgNum: 11,
      showTaskA: false,
      showTaskB: true,
      showTaskC: true,
      showTaskD: true
    }
  },
  methods: {
    quit () {
      sessionStorage.setItem('token', '')
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';

.index-header{
  width: 100%;
  height: 100%;
  position: relative;
  background: $bgHeader;
  text-align: right;
  .logo{
    position: absolute;
    top: 0;
    left: 36px;
    width: 268px;
    height: 80px;
    /*background: url() no-repeat;*/
    vertical-align: middle;
    background-position: center center;
  }
  .quit-btn{
    position: absolute;
    width: 31px;
    height: 32px;
    top: 20px;
    right: 52px;
    cursor: pointer;
    background: url('~@/assets/img/header-out-icon.png') no-repeat;
  }
  .header-menu{
    position: absolute;
    top: 14px;
    right: 146px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 700px;
    &>li{
      position: relative;
      height: 39px;
      line-height: 39px;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      .btn{
        i{
          display: inline-block;
          vertical-align: middle;
          margin-right: 13px;
        }
        &.task-btn{
          i{
            background: url("~@/assets/img/header-icon01.png") no-repeat;
            background-size: contain;
            width: 32px;
            height: 32px;
          }
          .num-conner{
            position: absolute;
            right: -16px;
            bottom: -4px;
            width: 34px;
            height: 34px;
            line-height: 34px;
            border-radius: 50%;
            color: #fff;
            font-size: 21.48px;
            text-align: center;
            background: #ff0000;
            transform: scale(0.5);
          }
        }
        &.hard-disk{
          i{
            background: url("~@/assets/img/header-icon02.png") no-repeat;
            background-size: contain;
            width: 28px;
            height: 32px;
          }
        }
        &.msg-btn{
          i{
            background: url("~@/assets/img/header-icon03.png") no-repeat;
            background-size: contain;
            width: 31px;
            height: 31px;
          }
          .num-conner{
            position: absolute;
            left: 9px;
            bottom: -4px;
            width: 34px;
            height: 34px;
            line-height: 34px;
            border-radius: 50%;
            color: #fff;
            font-size: 21.48px;
            text-align: center;
            background: #ff0000;
            transform: scale(0.5);
          }
        }
        &.skin-btn{
          i{
            background: url("~@/assets/img/header-icon05.png") no-repeat;
            background-size: contain;
            width: 31px;
            height: 28px;
          }
        }
        &.user-name-btn{
          i{
            background: url("~@/assets/img/header-icon04.png") no-repeat;
            background-size: contain;
            width: 27px;
            height: 33px;
          }
        }
      }
    }
  }
}
</style>
