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
            background: url('../../assets/img/aside-icon00.png') no-repeat;
            background-size: 23px 23px;
            background-position: center center;
          }
        }
      }
      &.menu1{
        .title{
          i{
            background: url('../../assets/img/aside-icon01.png') no-repeat;
            background-size: 24px 24px;
            background-position: center center;
          }
        }
      }
      &.menu2{
        .title{
          i{
            background: url('../../assets/img/aside-icon02.png') no-repeat;
            background-size: 22px 22px;
            background-position: center center;
          }
        }
      }
      &.menu3{
        .title{
          i{
            background: url('../../assets/img/aside-icon03.png') no-repeat;
            background-size: 23px 21px;
            background-position: center center;
          }
        }
      }
      &.menu4{
        .title{
          i{
            background: url('../../assets/img/aside-icon04.png') no-repeat;
            background-size: 25px 25px;
            background-position: center center;
          }
        }
      }
      &.menu5{
        .title{
          i{
            background: url('../../assets/img/aside-icon05.png') no-repeat;
            background-size: 26px 24px;
            background-position: center center;
          }
        }
      }
      &.menu6{
        .title{
          i{
            background: url('../../assets/img/aside-icon06.png') no-repeat;
            background-size: 24px 23px;
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
          height: 28px;
          width: 28px;
          position: absolute;
          top: 21px;
          left: 47px;
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
        border-top: 1px solid #114d77;
        background: #1779a4;
        li{
          line-height: 50px;
          color: #fff;
          background: #1d588d;
          cursor: pointer;
          &:hover{
            background: #104676;
            a{
              color: #fff;
            }
          }
          a{
            display: block;
            font-size: 18px;
            position: relative;
            padding-left: 126px;
            width: 100%;
            height: 100%;
            color: #8ac8ff;
            .icon-box{
              position: absolute;
              top: 12.5px;
              left: 87px;
              width: 24px;
              height: 24px;
              vertical-align: middle;
              overflow: hidden;
            }
            .icon{
              position: absolute;
              filter: drop-shadow(24px 0 #8ac8ff);
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
            }
            &.active{
              color: #fff;
              background: #104676;
              .icon{
                filter: drop-shadow(24px 0 #8ac8ff);
                overflow: hidden;
                left: 0;
              }
            }
            &:hover{
              color: #fff;
              .icon{
                filter: drop-shadow(24px 0 #8ac8ff);
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
