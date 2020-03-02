<template>
  <div class="wrap-side-nav" ref="sideNavDom">
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      unique-opened
      :background-color="theme"
      active-text-color="#ffffff"
      text-color="#ffffff"
      >
      <template
        v-for="(item, indexF) in menuList">
        <el-menu-item
          v-if="!item.list&&item.url !== '/'"
          :key="item.name"
          :index="item.url">
          <i class="icon-side-nav" :class="'icon-side-nav-'+indexF"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <a
          v-if="item.name === '应急指挥调度'"
          :href="getURL(item.url)" target='_self'
          :key= "item.name">
          <el-menu-item
            index="">
            <i class="icon-side-nav" :class="'icon-side-nav-'+indexF"></i>
            <span v-show="!isCollapse">{{item.name}}</span>
          </el-menu-item>
        </a>
        <el-submenu
          v-if="item.list"
          :key="item.name"
          :index="item.url">
          <template slot="title">
            <i class="icon-side-nav" :class="'icon-side-nav-'+indexF"></i>
            <span slot="title">{{item.name}}</span>
          </template>
            <el-menu-item
              v-for="(itemSub, index) in item.list"
              :key='index'
              :index="itemSub.url">
              <i class="icon-side-nav-sub" :class="'icon'+indexF+index"></i>
              {{itemSub.name}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import axios from '@/api/axios'

export default {
  name: 'IndexAside',
  data () {
    return {
      isCollapse: false, // 判断菜单收缩展开状态标志
      innerWidth: '', // 浏览器显示区宽度
      menuList: [
      //   {
      //     name: '首页',
      //     icon: 'home',
      //     url: '/dashboard'
      //   },
      //   {
      //     name: '安全基础管理',
      //     url: '/organization',
      //     active: false,
      //     list: [
      //       {
      //         fname: '安全基础管理',
      //         name: '组织机构',
      //         url: '/organization',
      //         active: false
      //       },
      //       {
      //         fname: '安全基础管理',
      //         name: '全员培训',
      //         url: '/staffTraining',
      //         active: false
      //       },
      //       {
      //         fname: '安全基础管理',
      //         name: '制度建设',
      //         url: '/systemConstruction',
      //         active: false
      //       },
      //       {
      //         fname: '安全基础管理',
      //         name: '基础资料',
      //         url: '/basicData',
      //         active: false
      //       },
      //       {
      //         fname: '安全基础管理',
      //         name: '证件管理',
      //         url: '/certificateManage',
      //         active: false
      //       }
      //     ]
      //   },
      //   {
      //     name: '风险辨识评估',
      //     url: '/riskIdentified',
      //     active: false,
      //     list: [
      //       {
      //         fname: '风险辨识评估',
      //         name: '风险辨识',
      //         url: '/riskIdentified',
      //         active: false
      //       },
      //       {
      //         fname: '风险辨识评估',
      //         name: '风险单元',
      //         url: '/riskUnit',
      //         active: false
      //       },
      //       {
      //         fname: '风险辨识评估',
      //         name: '评价记录',
      //         url: '/evaluationRecord',
      //         active: false
      //       },
      //       {
      //         fname: '风险辨识评估',
      //         name: '系统大数据',
      //         url: '/systemData',
      //         active: false
      //       }
      //     ]
      //   },
      //   {
      //     name: '风险分级管控',
      //     url: '/riskList',
      //     active: false,
      //     list: [
      //       {
      //         fname: '风险分级管控',
      //         name: '风险点清单',
      //         url: '/riskList',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '岗位风险告知卡',
      //         url: '/riskInfoCard',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '风险点分级管控台账',
      //         url: '/riskBook',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '重大安全风险',
      //         url: '/safeRisk',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '重大安全风险公告栏',
      //         url: '/riskBulletinBoard',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '风险四色图',
      //         url: '/riskColorImage',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '作业风险比较图',
      //         url: '/riskCompareChart',
      //         active: false
      //       },
      //       {
      //         fname: '风险分级管控',
      //         name: '风险分级管控表',
      //         url: '/riskControlList',
      //         active: false
      //       }
      //     ]
      //   },
      //   {
      //     name: '隐患排查治理',
      //     url: '/screeningList',
      //     active: false,
      //     list: [
      //       {
      //         fname: '隐患排查治理',
      //         name: '排查清单',
      //         url: '/screeningList',
      //         active: false
      //       },
      //       {
      //         fname: '隐患排查治理',
      //         name: '排查计划',
      //         url: '/screeningPlan',
      //         active: false
      //       },
      //       {
      //         fname: '隐患排查治理',
      //         name: '排查周期',
      //         url: '/screeningCycle',
      //         active: false
      //       },
      //       {
      //         fname: '隐患排查治理',
      //         name: '隐患排查',
      //         url: '/riskScreening',
      //         active: false
      //       },
      //       {
      //         fname: '隐患排查治理',
      //         name: '隐患治理',
      //         url: '/riskManagement',
      //         active: false
      //       }
      //     ]
      //   },
      //   {
      //     name: '应急指挥调度',
      //     active: false,
      //     url: ''
      //   },
      //   {
      //     name: '配置维护管理',
      //     url: '/userManagement',
      //     active: false,
      //     list: [
      //       {
      //         fname: '配置维护管理',
      //         name: '用户管理',
      //         url: '/userManagement',
      //         active: false
      //       },
      //       {
      //         fname: '配置维护管理',
      //         name: '角色管理',
      //         url: '/roleManagement',
      //         active: false
      //       },
      //       {
      //         fname: '配置维护管理',
      //         name: '数据字典',
      //         url: '/dataManagement',
      //         active: false
      //       },
      //       // 组织结构管理 这个部分暂时不写，需求未定
      //       // {
      //       //   fname: '配置维护管理',
      //       //   name: '组织结构管理',
      //       //   url: '/',
      //       //   active: false
      //       // },
      //       {
      //         fname: '配置维护管理',
      //         name: '日志',
      //         url: '/log',
      //         active: false
      //       },
      //       {
      //         fname: '配置维护管理',
      //         name: '新闻维护',
      //         url: '/newsManage',
      //         active: false
      //       },
      //       {
      //         fname: '配置维护管理',
      //         name: '绩效考核',
      //         url: '/performanceAssessment',
      //         active: false
      //       }
      //     ]
      //   }
      ],
      linkUrl: '' // 应急指挥调度跳转链接
    }
  },
  computed: { // vuex 参数引入
    ...mapState({
      theme: (state) => state.theme
    })
  },
  created () {
    this.getWidth()
  },
  mounted () {
    this.getWidth()
    // 监听浏览器显示区内的宽度，如果小于800, 侧导航收缩
    window.addEventListener('resize', this.getWidth)
    // 暂时注掉，后期再放开该方法
    this.initMenuList()
    this.initURL()
  },
  methods: {
    // 获取浏览器显示区内的宽度，同时设置侧导航显示宽度
    getWidth () {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 1440) {
        this.isCollapse = true
        // this.$refs.outLink.values = ''
        this.$refs.sideNavDom.style.width = '64px'
      } else {
        this.isCollapse = false
        this.$refs.sideNavDom.style.width = '270px'
      }
    },
    // 初始化菜单
    initMenuList () {
      axios
        .get('ontroller/getMenuLists')
        .then((res) => {
          if (res.data.code === 200) {
            this.menuList = res.data.menuList
            this.initURL()
          }
        })
    },
    // 初始化应急指挥调度url
    initURL () {
      let dmsfbsf = window.localStorage.getItem('TOKEN_KEY')
      axios
        .get('sso/getEmergency', {
          dmsfbsf: dmsfbsf
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.linkUrl = res.data.data
            this.menuList.forEach((item) => {
              if (item.name === '应急指挥调度') {
                item.url = this.linkUrl
                this.getURL(item.url)
              } else {
              }
            })
          }
        })
    },
    getURL (url) {
      let strURL = ''
      if (url) {
        if (url.substr(0, 7).toLowerCase() === 'http://' || url.substr(0, 8).toLowerCase() === 'https://') {
          strURL = url
        } else {
          strURL = 'http://' + url
        }
        return strURL
      } else {
        return null
      }
    }
  },
  watch: {
  },
  destroyed () {
    // 注销监听事件
    window.removeEventListener('resize', this.getWidth)
  }
}
</script>

<style scoped lang="scss">
@import '@/utils/css/tools/_variables.scss';
@import '@/utils/css/tools/_mixin.scss';
.wrap-side-nav{
  background: #545c64;
  width: 270px;
  >>> .el-menu{
    border-right: 0;
  }
  >>> .el-menu-item{
    a,
    i,
    .el-submenu__title i{
      color: #ffffff;
    }
    &.is-active{
      color: #ffffff !important;
      @include secmenu_bg($sec-menu-theme0);
    }
  }
  >>> .el-submenu {
    &.is-opened{
      .el-submenu__title,
      .el-menu-item{
        @include secmenu_bg($sec-menu-theme0);
      }
    }
    .el-menu-item{
      &:hover,
      &.is-active{
        @include secmenu_active_bg($secmenu-active-theme0);
      }
    }
  }
}
.icon-side-nav{
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  &.icon-side-nav-0{
    background-image: url('../../assets/img/aside-icon00.png');
  }
  &.icon-side-nav-1{
    background-image: url('../../assets/img/aside-icon01.png');
  }
  &.icon-side-nav-2{
    background-image: url('../../assets/img/aside-icon02.png');
  }
  &.icon-side-nav-3{
    background-image: url('../../assets/img/aside-icon03.png');
  }
  &.icon-side-nav-4{
    background-image: url('../../assets/img/aside-icon04.png');
  }
  &.icon-side-nav-5{
    background-image: url('../../assets/img/aside-icon05.png');
  }
  &.icon-side-nav-6{
    background-image: url('../../assets/img/aside-icon06.png');
  }
}
.icon-side-nav-sub{
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  &.icon10{
    background-image: url('../../assets/img/aside-icon00-0.png');
  }
  &.icon11{
    background-image: url('../../assets/img/aside-icon00-1.png');
  }
  &.icon12{
    background-image: url('../../assets/img/aside-icon00-2.png');
  }
  &.icon13{
    background-image: url('../../assets/img/aside-icon00-3.png');
  }
  &.icon14{
    background-image: url('../../assets/img/aside-icon00-4.png');
  }
  &.icon20{
    background-image: url('../../assets/img/aside-icon01-0.png');
  }
  &.icon21{
    background-image: url('../../assets/img/aside-icon01-1.png');
  }
  &.icon22{
    background-image: url('../../assets/img/aside-icon01-2.png');
  }
  &.icon23{
    background-image: url('../../assets/img/aside-icon01-2.png');
  }
  &.icon30{
    background-image: url('../../assets/img/aside-icon02-0.png');
  }
  &.icon31{
    background-image: url('../../assets/img/aside-icon02-1.png');
  }
  &.icon32{
    background-image: url('../../assets/img/aside-icon02-2.png');
  }
  &.icon33{
    background-image: url('../../assets/img/aside-icon02-3.png');
  }
  &.icon34{
    background-image: url('../../assets/img/aside-icon02-4.png');
  }
  &.icon35{
    background-image: url('../../assets/img/aside-icon02-5.png');
  }
  &.icon36{
    background-image: url('../../assets/img/aside-icon02-6.png');
  }
  &.icon37{
    background-image: url('../../assets/img/aside-icon02-7.png');
  }
  &.icon40{
    background-image: url('../../assets/img/aside-icon03-0.png');
  }
  &.icon41{
    background-image: url('../../assets/img/aside-icon03-1.png');
  }
  &.icon42{
    background-image: url('../../assets/img/aside-icon03-2.png');
  }
  &.icon43{
    background-image: url('../../assets/img/aside-icon03-3.png');
  }
  &.icon44{
    background-image: url('../../assets/img/aside-icon03-4.png');
  }
  &.icon45{
    background-image: url('../../assets/img/aside-icon03-5.png');
  }
  &.icon46{
    background-image: url('../../assets/img/aside-icon03-6.png');
  }
  &.icon60{
    background-image: url('../../assets/img/aside-icon06-0.png');
  }
  &.icon61{
    background-image: url('../../assets/img/aside-icon06-1.png');
  }
  &.icon62{
    background-image: url('../../assets/img/aside-icon06-2.png');
  }
  &.icon63{
    background-image: url('../../assets/img/aside-icon06-3.png');
  }
  &.icon64{
    background-image: url('../../assets/img/aside-icon06-4.png');
  }
  &.icon65{
    background-image: url('../../assets/img/aside-icon06-5.png');
  }
}
</style>
