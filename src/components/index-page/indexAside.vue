<template>
  <div class="index-aside">
    <ul class="aside-menu">
      <li v-for="(item, indexA) in menuList" :key="indexA" :class="'menu'+indexA" class="aside-menu-item">
        <template v-if="item.list != null && item.list.length > 0">
          <div class="title" @click="foldingMenu(indexA)" :class="item.active ? 'active' : ''">
            <i></i>{{item.name}}
          </div>
          <el-collapse-transition>
            <ul class="menu-items" v-show="item.active">
              <li v-for="(child, index) in item.list" :key="index">
                <a @click="turnToPage(child.url, child.fname+'-'+child.name, indexA, index)"
                   :to="child.url"
                   :class="child.active ? 'active' : ''">
                  {{child.name}}
                </a>
              </li>
            </ul>
          </el-collapse-transition>
        </template>
        <!-- 没有下级，当前级别需点击 -->
        <template v-else>
          <div class="title only-title"
               @click="turnToPage(item.url, item.name, indexA, 0, 'isRemote')"
               :class="item.active ? 'active' : ''">
            <i></i>{{item.name}}
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {setLocalStorage} from '../../utils/js/common'

export default {
  name: 'IndexAside',
  data () {
    return {
      menuList: [
        {
          name: '首页',
          active: true,
          url: '/home'
        },
        {
          name: '安全基础管理',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: '组织机构',
              url: '/',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '全员培训',
              url: '/',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '制度建设',
              url: '/',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '基础资料',
              url: '/',
              active: false
            }
          ]
        },
        {
          name: '风险辨识评估',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: 'child01',
              url: '/',
              active: false
            }
          ]
        },
        {
          name: '风险分级管控',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: 'child01',
              url: '/',
              active: false
            }
          ]
        },
        {
          name: '隐患排查治理',
          url: '/remoteQuery',
          active: false
        },
        {
          name: '应急指挥调度',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: 'child01',
              url: '/',
              active: false
            }
          ]
        },
        {
          name: '配置维护管理',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: 'child01',
              url: '/',
              active: false
            }
          ]
        }
      ]
    }
  },
  computed: { // vuex 参数引入
    ...mapState({
      // menuList: state => state.menuList
    })
  },
  created () {
    // menuList参数的active属性是前台自添加, 原始请求下来的数据是没有active的
    // let returenMenu = [
    //   {
    //     name: '安全基础管理',
    //     active: true,
    //     list: [
    //       {
    //         fname: '安全基础管理',
    //         name: '组织机构',
    //         url: '/',
    //         active: false
    //       },
    //       {
    //         fname: '安全基础管理',
    //         name: '全员培训',
    //         url: '/',
    //         active: false
    //       },
    //       {
    //         fname: '安全基础管理',
    //         name: '制度建设',
    //         url: '/',
    //         active: false
    //       },
    //       {
    //         fname: '安全基础管理',
    //         name: '基础资料',
    //         url: '/',
    //         active: false
    //       }
    //     ]
    //   },
    //   {
    //     name: '风险辨识评估',
    //     active: false,
    //     list: [
    //       {
    //         fname: '安全基础管理',
    //         name: 'child01',
    //         url: '/',
    //         active: false
    //       }
    //     ]
    //   },
    //   {
    //     name: '风险分级管控',
    //     active: false,
    //     list: [
    //       {
    //         fname: '安全基础管理',
    //         name: 'child01',
    //         url: '/',
    //         active: false
    //       }
    //     ]
    //   },
    //   {
    //     name: '隐患排查治理',
    //     url: '/remoteQuery',
    //     active: false
    //   },
    //   {
    //     name: '应急指挥调度',
    //     active: false,
    //     list: [
    //       {
    //         fname: '安全基础管理',
    //         name: 'child01',
    //         url: '/',
    //         active: false
    //       }
    //     ]
    //   },
    //   {
    //     name: '配置维护管理',
    //     active: false,
    //     list: [
    //       {
    //         fname: '安全基础管理',
    //         name: 'child01',
    //         url: '/',
    //         active: false
    //       }
    //     ]
    //   }
    // ]
    // if (getLocalStorage('menuList')) { // 获取Storage，会在登录后主动清空Storage，因此如果存在即为刷新
    //   let menuCookie = JSON.parse(getLocalStorage('menuList'))
    //   this.$store.dispatch('changeMenu', menuCookie)
    // } else {
    //   this.$store.dispatch('changeMenu', returenMenu) // 每次刷新均重新请求后台获取最新数据,放到vuex里统一管理
    // }
  },
  methods: {
    foldingMenu (index) {
      let vm = this
      vm.menuList.forEach((i) => {
        i.active = false
      })
      vm.menuList[index].active = true
    },
    turnToPage (url, name, indexA, indexB, menuName) {
      this.menuList.forEach((i) => {
        if (i.list) {
          i.list.forEach((j) => {
            j.active = false
          })
        }
      })
      if (menuName === 'isPCenter') {
        this.menuList[0].list[indexB].active = true
      } else if (menuName === 'isRemote') {
        this.foldingMenu(indexA)
        this.menuList[indexA].active = true
      } else {
        this.menuList[indexA].list[indexB].active = true
      }
      setLocalStorage('menuList', JSON.stringify(this.menuList))
      let nArr = name.split('-')
      this.$emit('changeBreadcrumb', nArr)
      // this.$router.push(url)
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="scss">
.index-aside{
  width: 100%;
  min-height: 100%;
  position: relative;
  background: #247ece;
  border-top: 1px solid #144f84;
  .aside-menu{
    width: 100%;
    .aside-menu-item{
      width: 100%;
      &.menu0{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-01.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu1{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-02.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu2{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-03.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu3{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-04.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu4{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-05.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu5{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-06.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      &.menu6{
        .title{
          i{
            /*background: url('../../assets/img/aside-icon-07.png') no-repeat;*/
            background-size: contain;
            background-position: center center;
          }
        }
      }
      .title{
        height: 70px;
        line-height: 70px;
        padding-left: 90px;
        color: #fff;
        font-size: 24px;
        width: 100%;
        position: relative;
        cursor: pointer;
        i{
          display: inline-block;
          vertical-align: middle;
          height: 18px;
          width: 20px;
          position: absolute;
          top: 16px;
          left: 30px;
        }
        &:hover{
          background: #1d588d;
          border-top: 1px solid #144f84;
          line-height: 69px;
        }
        &::after{
          content: '';
          display: block;
          position: absolute;
          width: 10px;
          height: 10px;
          /*background: url('../../assets/img/index-side-coner-icon.png') no-repeat;*/
          background-position: top left;
          top: 20px;
          right: 25px;
          transform: rotate(90deg);
        }
        &.active{
          background: #1d588d;
          border-top: 1px solid #144f84;
          line-height: 69px;
          &::after{
            transform: rotate(0);
          }
        }
        &.only-title{
          &::after{
            display: none;
          }
        }
      }
      .menu-items{
        background: #1779a4;
        margin-top: 1px;
        background: #1779a4;
        padding: 8px 0 8px 30px;
        li{
          line-height: 30px;
          padding-left: 42px;
          color: #fff;
          a{
            font-size: 14px;
            position: relative;
            color: #fff;
            &::before{
              content: '';
              display: block;
              position: absolute;
              width: 0;
              height: 0;
              border: 5px solid transparent;
              border-left-color: #fff;
              top: 5px;
              left: -15px;
            }
            &.active{
              color: #6eef7a;
              &::before{
                border-left-color: #6eef7a;
              }
            }
            &:hover{
              color: #6eef7a;
              &::before{
                border-left-color: #6eef7a;
              }
            }
          }
        }
      }
    }
  }
}
</style>
