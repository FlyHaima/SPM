import Vue from 'vue'
import Router from 'vue-router'

// 登录页
const loginPage = require('@/pages/login')
const LoginPage = resolve => require.ensure([], () => resolve(loginPage), 'pagelist')
// 404
const notFound = require('@/pages/404')
const NotFound = resolve => require.ensure([], () => resolve(notFound), 'pagelist')
// 功能主页
const indexPage = require('@/pages/index')
const IndexPage = resolve => require.ensure([], () => resolve(indexPage), 'pagelist')
// 安全基础管理--组织机构
const organization = require('@/components/safety-management/organization')
const Organization = resolve => require.ensure([], () => resolve(organization), 'pagelist')

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
    children: [
      {
        path: 'dashboard',
        title: '首页',
        name: 'HomeDashboard',
        meta: {
          access: true
        },
        parent: 'IndexPage',
        component: () =>
          import(`@/pages/home/dashboard.vue`)
      },
      {
        path: '/organization',
        name: 'Organization',
        component: Organization
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
