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
const Organization = resolve => require.ensure([], () => resolve(organization), 'pagelist')
// 安全基础管理--全员培训
const staffTraining = require('@/components/safety-management/staffTraining')
const StaffTraining = resolve => require.ensure([], () => resolve(staffTraining), 'pagelist')
// 安全基础管理--制度建设
const systemConstruction = require('@/components/safety-management/systemConstruction')
const SystemConstruction = resolve => require.ensure([], () => resolve(systemConstruction), 'pagelist')
// 安全基础管理--基础资料
const basicData = require('@/components/safety-management/basicData')
const BasicData = resolve => require.ensure([], () => resolve(basicData), 'pagelist')

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
        component: () =>
          import(`@/components/home/dashboard.vue`)
      },
      {
        path: '/messages',
        title: '所有消息',
        name: 'messages',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: () =>
          import(`@/components/home/messages.vue`)
      },
      {
        path: '/messagesDetails',
        title: '消息详情页',
        name: 'messagesDetails',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: () =>
          import(`@/components/home/messagesDetails.vue`)
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
        component: BasicData
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
