import Vue from 'vue'
import Router from 'vue-router'
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

// 登录页
const loginPage = require('@/pages/login')
const LoginPage = resolve => require.ensure([], () => resolve(loginPage), 'basicPageList')
// 404
const notFound = require('@/pages/404')
const NotFound = resolve => require.ensure([], () => resolve(notFound), 'basicPageList')
// 功能主页
const indexPage = require('@/pages/index')
const IndexPage = resolve => require.ensure([], () => resolve(indexPage), 'basicPageList')
// 安全基础管理--组织机构
const organization = require('@/components/safety-management/organization')
const Organization = resolve => require.ensure([], () => resolve(organization), 'pageListA')
// 安全基础管理--全员培训
const staffTraining = require('@/components/safety-management/staffTraining')
const StaffTraining = resolve => require.ensure([], () => resolve(staffTraining), 'pageListA')
// 安全基础管理--制度建设
const systemConstruction = require('@/components/safety-management/systemConstruction')
const SystemConstruction = resolve => require.ensure([], () => resolve(systemConstruction), 'pageListA')
// 安全基础管理--基础资料
const basicData = require('@/components/safety-management/basicData')
const BasicData = resolve => require.ensure([], () => resolve(basicData), 'pageListA')
// 风险辨识评估--风险辨识
const riskIdentified = require('@/components/risk-identifi-module/riskIdentified')
const RiskIdentified = resolve => require.ensure([], () => resolve(riskIdentified), 'pageListB')
// 风险辨识评估--风险单元
const riskUnit = require('@/components/risk-identifi-module/riskUnit')
const RiskUnit = resolve => require.ensure([], () => resolve(riskUnit), 'pageListB')
// 风险辨识评估--评价记录
// 风险辨识评估--系统大数据

// 首页
const homeDashboard = require('@/components/home/dashboard.vue')
const HomeDashboard = resolve => require.ensure([], () => resolve(homeDashboard), 'pagelist')
// 所有消息
const messages = require('@/components/home/messages.vue')
const Messages = resolve => require.ensure([], () => resolve(messages), 'pagelist')
// 消息详情页
const messagesDetails = require('@/components/home/messagesDetails.vue')
const MessagesDetails = resolve => require.ensure([], () => resolve(messagesDetails), 'pagelist')
// 用户基本信息
const basic = require('@/components/home/basic.vue')
const Basic = resolve => require.ensure([], () => resolve(basic), 'pagelist')
// 组织机构图
const organigram = require('@/components/organigram/organigram.vue')
const Organigram = resolve => require.ensure([], () => resolve(organigram), 'pagelist')
// 风险点清单
const riskList = require('@/components/risk-control/riskList.vue')
const RiskList = resolve => require.ensure([], () => resolve(riskList), 'pagelist')
// 岗位风险告知卡
const riskInfoCard = require('@/components/risk-control/riskInfoCard.vue')
const RiskInfoCard = resolve => require.ensure([], () => resolve(riskInfoCard), 'pagelist')
// 风险点分级管控台账
const riskBook = require('@/components/risk-control/riskBook.vue')
const RiskBook = resolve => require.ensure([], () => resolve(riskBook), 'pagelist')
// 重大安全风险
const safeRisk = require('@/components/risk-control/safeRisk.vue')
const SafeRisk = resolve => require.ensure([], () => resolve(safeRisk), 'pagelist')
// 重大安全风险公告栏
const riskBulletinBoard = require('@/components/risk-control/riskBulletinBoard.vue')
const RiskBulletinBoard = resolve => require.ensure([], () => resolve(riskBulletinBoard), 'pagelist')
// 风险四色图
const riskColorImage = require('@/components/risk-control/riskColorImage.vue')
const RiskColorImage = resolve => require.ensure([], () => resolve(riskColorImage), 'pagelist')
// 作业风险比较图
const riskCompareChart = require('@/components/risk-control/riskCompareChart.vue')
const RiskCompareChart = resolve => require.ensure([], () => resolve(riskCompareChart), 'pagelist')
// 风险分级管控表
const riskControlList = require('@/components/risk-control/riskControlList.vue')
const RiskControlList = resolve => require.ensure([], () => resolve(riskControlList), 'pagelist')
// 排查清单
const screeningList = require('@/components/risk-screening/screeningList.vue')
const ScreeningList = resolve => require.ensure([], () => resolve(screeningList), 'pagelist')
// 排查计划
const screeningPlan = require('@/components/risk-screening/screeningPlan.vue')
const ScreeningPlan = resolve => require.ensure([], () => resolve(screeningPlan), 'pagelist')
// 排查周期
const screeningCycle = require('@/components/risk-screening/screeningCycle.vue')
const ScreeningCycle = resolve => require.ensure([], () => resolve(screeningCycle), 'pagelist')
// 隐患排查
const riskScreening = require('@/components/risk-screening/riskScreening.vue')
const RiskScreening = resolve => require.ensure([], () => resolve(riskScreening), 'pagelist')
// 隐患治理
const riskManagement = require('@/components/risk-screening/riskManagement.vue')
const RiskManagement = resolve => require.ensure([], () => resolve(riskManagement), 'pagelist')
// 用户管理
const userManagement = require('@/components/config-management/userManagement.vue')
const UserManagement = resolve => require.ensure([], () => resolve(userManagement), 'pagelist')
// 角色管理
const roleManagement = require('@/components/config-management/roleManagement.vue')
const RoleManagement = resolve => require.ensure([], () => resolve(roleManagement), 'pagelist')
// 数据管理
const dataManagement = require('@/components/config-management/dataManagement.vue')
const DataManagement = resolve => require.ensure([], () => resolve(dataManagement), 'pagelist')
// 日志
const log = require('@/components/config-management/log.vue')
const Log = resolve => require.ensure([], () => resolve(log), 'pagelist')

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      allowBack: false
    }
  },
  {
    path: '/index',
    name: 'IndexPage',
    component: IndexPage,
    meta: {
      keepAlive: true
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        title: '首页',
        name: 'HomeDashboard',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: HomeDashboard
      },
      {
        path: '/messages',
        title: '所有消息',
        name: 'messages',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: Messages
      },
      {
        path: '/messagesDetails',
        title: '消息详情页',
        name: 'messagesDetails',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: MessagesDetails
      },
      {
        path: '/organigram',
        name: 'organigram',
        title: '组织机构图',
        component: Organigram
      },
      {
        path: '/organization',
        name: 'Organization',
        title: '组织机构',
        component: Organization
      },
      {
        path: '/staffTraining',
        name: 'StaffTraining',
        title: '全员培训',
        component: StaffTraining
      },
      {
        path: '/systemConstruction',
        name: 'SystemConstruction',
        title: '制度建设',
        component: SystemConstruction
      },
      {
        path: '/basicData',
        name: 'BasicData',
        title: '基础资料',
        component: BasicData
      },
      {
        path: '/riskIdentified',
        name: 'RiskIdentified',
        title: '风险辨识',
        component: RiskIdentified
      },
      {
        path: '/riskUnit',
        name: 'RiskUnit',
        title: '风险单元',
        component: RiskUnit
      },
      {
        path: '/basic',
        name: 'basic',
        title: '用户信息',
        component: Basic
      },
      {
        path: '/riskList',
        name: 'riskList',
        title: '风险点清单',
        component: RiskList
      },
      {
        path: '/riskInfoCard',
        name: 'riskInfoCard',
        title: '岗位风险告知卡',
        component: RiskInfoCard
      },
      {
        path: '/riskBook',
        name: 'riskBook',
        title: '风险点分级管控台账',
        component: RiskBook
      },
      {
        path: '/safeRisk',
        name: 'safeRisk',
        title: '重大安全风险',
        component: SafeRisk
      },
      {
        path: '/riskBulletinBoard',
        name: 'riskBulletinBoard',
        title: '重大安全风险公告栏',
        component: RiskBulletinBoard
      },
      {
        path: '/riskColorImage',
        name: 'riskColorImage',
        title: '风险四色图',
        component: RiskColorImage
      },
      {
        path: '/riskCompareChart',
        name: 'riskCompareChart',
        title: '作业风险比较图',
        component: RiskCompareChart

      },
      {
        path: '/riskControlList',
        name: 'riskControlList',
        title: '风险分级管控表',
        component: RiskControlList
      },
      {
        path: '/screeningList',
        name: 'screeningList',
        title: '排查清单',
        component: ScreeningList
      },
      {
        path: '/screeningPlan',
        name: 'screeningPlan',
        title: '排查计划',
        component: ScreeningPlan
      },
      {
        path: '/screeningCycle',
        name: 'screeningCycle',
        title: '排查周期',
        component: ScreeningCycle
      },
      {
        path: '/riskScreening',
        name: 'riskScreening',
        title: '隐患排查',
        component: RiskScreening
      },
      {
        path: '/riskManagement',
        name: 'riskManagement',
        title: '隐患治理',
        component: RiskManagement
      },
      {
        path: '/userManagement',
        name: 'userManagement',
        title: '用户管理',
        component: UserManagement
      },
      {
        path: '/roleManagement',
        name: 'roleManagement',
        title: '角色管理',
        component: RoleManagement
      },
      {
        path: '/dataManagement',
        name: 'dataManagement',
        title: '数据管理',
        component: DataManagement
      },
      {
        path: '/log',
        name: 'log',
        title: '日志',
        component: Log
      }
    ]
  },
  {
    path: '/*',
    name: '404',
    component: NotFound
  }
]

var router = new Router({
  routes,
  mode: 'history' // history模式
})

// 全局钩子
// 注册全局前置router守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.fullPath === '/home') {
    sessionStorage.setItem('token', '') // 监听home login路由，删除token
    next()
  } else {
    next()
  }

  if (to.fullPath === '/404') {
    // console.log('page not found')
    // console.log(from)
    // console.log(to)
    sessionStorage.setItem('lastPageUrl', from.fullPath)
    next()
  }
})

// 注册全局解析守卫
router.beforeResolve((to, form, next) => {
  // console.log('beforeResolve')
  next()
})

// 注册后置守卫
router.afterEach((to, from) => {
  // console.log('afterEach')
})

export default router
