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
                  <span class="icon-box"><i class="icon" :class="'icon'+indexA+index"></i></span>
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
          url: '/dashboard'
        },
        {
          name: '安全基础管理',
          active: false,
          list: [
            {
              fname: '安全基础管理',
              name: '组织机构',
              url: '/organization',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '全员培训',
              url: '/staffTraining',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '制度建设',
              url: '/systemConstruction',
              active: false
            },
            {
              fname: '安全基础管理',
              name: '基础资料',
              url: '/basicData',
              active: false
            }
          ]
        },
        {
          name: '风险辨识评估',
          active: false,
          list: [
            {
              fname: '风险辨识评估',
              name: '风险辨识',
              url: '/riskIdentified',
              active: false
            },
            {
              fname: '风险辨识评估',
              name: '风险单元',
              url: '/riskUnit',
              active: false
            },
            {
              fname: '风险辨识评估',
              name: '评价记录',
              url: '/evaluationRecord',
              active: false
            },
            {
              fname: '风险辨识评估',
              name: '系统大数据',
              url: '/systemData',
              active: false
            }
          ]
        },
        {
          name: '风险分级管控',
          active: false,
          list: [
            {
              fname: '风险分级管控',
              name: '风险点清单',
              url: '/riskList',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '岗位风险告知卡',
              url: '/riskInfoCard',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '风险点分级管控台账',
              url: '/riskBook',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '重大安全风险',
              url: '/safeRisk',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '重大安全风险公告栏',
              url: '/riskBulletinBoard',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '风险四色图',
              url: '/riskColorImage',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '作业风险比较图',
              url: '/riskCompareChart',
              active: false
            },
            {
              fname: '风险分级管控',
              name: '风险分级管控表',
              url: '/riskControlList',
              active: false
            }
          ]
        },
        {
          name: '隐患排查治理',
          active: false,
          list: [
            {
              fname: '隐患排查治理',
              name: '排查清单',
              url: '/screeningList',
              active: false
            },
            {
              fname: '隐患排查治理',
              name: '排查计划',
              url: '/screeningPlan',
              active: false
            },
            {
              fname: '隐患排查治理',
              name: '排查周期',
              url: '/screeningCycle',
              active: false
            },
            {
              fname: '隐患排查治理',
              name: '隐患排查',
              url: '/riskScreening',
              active: false
            },
            {
              fname: '隐患排查治理',
              name: '隐患治理',
              url: '/riskManagement',
              active: false
            }
          ]
        },
        {
          name: '应急指挥调度',
          active: false,
          url: '/'
        },
        {
          name: '配置维护管理',
          active: false,
          list: [
            {
              fname: '配置维护管理',
              name: '用户管理',
              url: '/',
              active: false
            },
            {
              fname: '配置维护管理',
              name: '角色管理',
              url: '/',
              active: false
            },
            {
              fname: '配置维护管理',
              name: '数据管理',
              url: '/',
              active: false
            },
            // 组织结构管理 这个部分暂时不写，需求未定
            // {
            //   fname: '配置维护管理',
            //   name: '组织结构管理',
            //   url: '/',
            //   active: false
            // },
            {
              fname: '配置维护管理',
              name: '日志',
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
      this.$router.push(url)
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="scss">
@import '../../utils/css/style.scss';
.index-aside{
  width: 100%;
  min-height: 100%;
  position: relative;
  background: $bgAside;
  .aside-menu{
    width: 100%;
    .aside-menu-item{
      width: 100%;
      &.menu0{
        .title{
          i{
            background: url('../../assets/img/aside-icon00.png') no-repeat;
            background-size: 17px 17px;
            background-position: center center;
          }
        }
      }
      &.menu1{
        .title{
          i{
            background: url('../../assets/img/aside-icon01.png') no-repeat;
            background-size: 16px 16px;
            background-position: center center;
          }
        }
      }
      &.menu2{
        .title{
          i{
            background: url('../../assets/img/aside-icon02.png') no-repeat;
            background-size: 17px 17px;
            background-position: center center;
          }
        }
      }
      &.menu3{
        .title{
          i{
            background: url('../../assets/img/aside-icon03.png') no-repeat;
            background-size: 17px 15px;
            background-position: center center;
          }
        }
      }
      &.menu4{
        .title{
          i{
            background: url('../../assets/img/aside-icon04.png') no-repeat;
            background-size: 18px 18px;
            background-position: center center;
          }
        }
      }
      &.menu5{
        .title{
          i{
            background: url('../../assets/img/aside-icon05.png') no-repeat;
            background-size: 19px 19px;
            background-position: center center;
          }
        }
      }
      &.menu6{
        .title{
          i{
            background: url('../../assets/img/aside-icon06.png') no-repeat;
            background-size: 17px 17px;
            background-position: center center;
          }
        }
      }
      .title{
        height: 70px;
        line-height: 70px;
        padding-left: 60px;
        color: $colorAside;
        font-size: 18px;
        font-family: "Source Han Sans CN","PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
        width: 100%;
        position: relative;
        cursor: pointer;
        i{
          display: inline-block;
          vertical-align: middle;
          height: 28px;
          width: 28px;
          position: absolute;
          top: 21px;
          left: 22px;
        }
        &:hover{
          background: $bgAsideMenuHover;
          border-top: 1px solid $borderAsideMenu;
          line-height: 69px;
          i{
            top: 20px;
          }
        }
        &::after{
          content: '';
          display: block;
          position: absolute;
          width: 10px;
          height: 10px;
          background-position: top left;
          top: 20px;
          right: 25px;
          transform: rotate(90deg);
        }
        &.active{
          background: $bgAsideMenuHover;
          border-top: 1px solid $borderAsideMenu;
          line-height: 69px;
          i{
            top: 20px;
          }
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
        border-top: 1px solid $borderAsideSubMenu;
        background: #1779a4;
        li{
          line-height: 50px;
          color: #fff;
          background: $bgAsideSubMenu;
          cursor: pointer;
          &:hover{
            background: $bgAsideSubMenuHover;
            a{
              color: #fff;
            }
          }
          a{
            display: block;
            font-size: 16px;
            position: relative;
            padding-left: 96px;
            width: 100%;
            height: 100%;
            color: $colorAsideSubMenu;
            .icon-box{
              position: absolute;
              top: 12.5px;
              left: 57px;
              width: 24px;
              height: 24px;
              vertical-align: middle;
              overflow: hidden;
            }
            .icon{
              position: absolute;
              filter: drop-shadow(24px 0 $colorAsideSubMenu);
              top: 0;
              left: -24px;
              width: 24px;
              height: 24px;
              vertical-align: middle;
              &.icon10{
                background: url('../../assets/img/aside-icon00-0.png') no-repeat;
                background-size: 20px 18px;
                background-position: center center;
              }
              &.icon11{
                background: url('../../assets/img/aside-icon00-1.png') no-repeat;
                background-size: 22px 19px;
                background-position: center center;
              }
              &.icon12{
                background: url('../../assets/img/aside-icon00-2.png') no-repeat;
                background-size: 19px 19px;
                background-position: center center;
              }
              &.icon13{
                background: url('../../assets/img/aside-icon00-3.png') no-repeat;
                background-size: 16px 17px;
                background-position: center center;
              }
              &.icon20{
                background: url('../../assets/img/aside-icon01-0.png') no-repeat;
                background-size: 20px 18px;
                background-position: center center;
              }
              &.icon21{
                background: url('../../assets/img/aside-icon01-1.png') no-repeat;
                background-size: 22px 19px;
                background-position: center center;
              }
              &.icon22{
                background: url('../../assets/img/aside-icon01-2.png') no-repeat;
                background-size: 19px 19px;
                background-position: center center;
              }
            }
            &.active{
              color: #fff;
              background: $bgAsideSubMenuHover;
              .icon{
                filter: drop-shadow(24px 0 $colorAsideSubMenu);
                overflow: hidden;
                left: 0;
              }
            }
            &:hover{
              color: #fff;
              .icon{
                filter: drop-shadow(24px 0 $colorAsideSubMenu);
                overflow: hidden;
                left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
