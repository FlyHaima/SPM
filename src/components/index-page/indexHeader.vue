<template>
  <div class="index-header">
    <div class="logo inline-block"></div>
    <ul class="header-menu inline-block">
      <li>
        <div class="btn task-btn" @click="goMineTodoPage()"><i></i>我的待办
          <span v-if="taskNum > 0" class="num-conner">{{taskNum > 99 ? '99+' : taskNum}}</span>
        </div>
      </li>
      <li>
        <div class="btn hard-disk" @click="goHardDiskPage()"><i></i>本机硬盘</div>
      </li>
      <li>
        <div class="btn msg-btn" @click="goMorePage()"><i></i>消息
          <span v-if="msgNum > 0" class="num-conner">{{msgNum > 99 ? '99+' : msgNum}}</span>
        </div>
      </li>
      <li class="skin-li">
        <div class="btn skin-btn"><i></i>皮肤</div>
        <ul class="theme-select">
          <li class="themes" v-for="(item, index) in themes" :key="index" @click="changeTheme(`${index}`, item.color)">
            <i class="theme-i" :style="{ background: `${item.color}`}"></i>
            {{item.name}}
          </li>
        </ul>
      </li>
      <li>
        <div
          class="btn user-name-btn"
          @click="goUserPage()">
            <i></i>
            <template v-if="userName">
              {{userName}}
            </template>
            <template v-else>
              {{accountName}}
            </template>
        </div>
      </li>
    </ul>
    <div class="quit-btn inline-block" @click="quitHandle()" title="退出登录">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '@/api/axios'
export default {
  name: 'IndexHeader',
  data () {
    return {
      showTaskA: false,
      showTaskB: true,
      showTaskC: true,
      showTaskD: true,
      themes: [
        {
          color: '#1a6fba',
          name: '海军蓝'
        },
        {
          color: '#232c37',
          name: '静谧黑'
        },
        {
          color: '#db4d6d',
          name: '温馨粉'
        },
        {
          color: '#86c166',
          name: '森林绿'
        }
      ],
      backgroundColorTheme: '$header-background-theme1'
    }
  },
  computed: {
    ...mapState({
      userName: (state) => state.userInfo.userName,
      accountName: (state) => state.userInfo.accountName,
      msgNum: (state) => state.msgNum,
      taskNum: (state) => state.taskNum
    })
  },
  mounted () {
    this.$store.dispatch('BASE_INFO_SET').then(() => {
      console.log('33333', this.$store.state.skin)
    })
  },
  methods: {
    initializeTheme (theme, color) {
      this.$store.dispatch('BASE_INFO_SET').then()
      switch (theme) {
        case 1:
          console.log(1)
          break
        case 2:
          console.log(2)
          break
        case 3:
          console.log(3)
          break
        case 4:
          console.log(4)
      }
      this.$store.dispatch('changeSetting', color)
      window.document.documentElement.setAttribute('data-theme', 'theme' + theme)
    },
    changeTheme (theme, color) {
      switch (theme) {
        case 1:
          console.log(1)
          break
        case 2:
          console.log(2)
          break
        case 3:
          console.log(3)
          break
        case 4:
          console.log(4)
      }
      console.log('11111', this.$store.state.skin)
      this.$store.dispatch('changeSetting', color)
      window.document.documentElement.setAttribute('data-theme', 'theme' + theme)
      const skinVlaue = {skin: theme}
      axios
        .post('user/updateSkin', skinVlaue)
        .then((res) => {
          if (res.data.code === 200) {
            // console.log(skinVlaue, typeof skinVlaue)
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    quitHandle () {
      let vm = this
      axios
        .delete('ontroller/logout', {
          dmsfbsf: sessionStorage.getItem('TOKEN_KEY')
        })
        .then((res) => {
          // vm.submitting = true
          if (res.data.code === 200) {
            sessionStorage.setItem('TOKEN_KEY', '')
            window.location = '/login'
          } else {
            vm.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          // vm.submitting = false
        })
    },
    // 跳转到我的待办列表页面
    goMineTodoPage () {
      this.$router.push({
        name: 'mineTodo',
        query: {
          tabType: '1'
        }
      })
    },
    // 跳转所有信息页面的点击事件
    goMorePage () {
      this.$router.push({
        name: 'messages',
        query: {
          tabType: '2'
        }
      })
    },
    // 跳转用户信息页面的点击事件
    goUserPage () {
      this.$router.push({
        name: 'basic'
      })
    },
    // 跳转本机硬盘页面
    goHardDiskPage () {
      this.$router.push('hardDisk')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_mixin.scss';
@import '@/utils/css/tools/_variables.scss';
.index-header{
  width: 100%;
  height: 100%;
  position: relative;
  @include header_bg($header-background-theme0);
  text-align: right;
  .logo{
    position: absolute;
    top: 16px;
    left: 47px;
    width: 278px;
    // width: 136px;
    height: 43px;
    background: url(../../assets/img/AGT-logo.png) no-repeat;
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
    // width: 700px;
    &>li{
      position: relative;
      height: 39px;
      line-height: 39px;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      + li{
        margin-left: 30px;
      }
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
      &.skin-li{
        .theme-select{
          display: none;
        }
        &:hover{
          .theme-select{
            display: block;
          }
        }
      }
      .theme-select{
        position: absolute;
        top: 38px;
        left: -2px;
        z-index: 9999;
        background: #fff;
        border: 1px solid #ddd;
        color: #505050;
        font-size: 14px;
        .themes{
          width: 90px;
          padding: 0 12px;
          line-height: 24px;
          &:hover{
            background: #ddd;
          }
          .theme-i{
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
